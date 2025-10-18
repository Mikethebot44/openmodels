import modal
import os
import sys
import io
import base64
import warnings
from typing import List, Dict, Any, Optional
import uuid
from pydantic import BaseModel

# Completely suppress all warnings and progress bars
warnings.filterwarnings("ignore")
os.environ['PYTHONIOENCODING'] = 'utf-8'
os.environ['LANG'] = 'en_US.UTF-8'
os.environ['TRANSFORMERS_VERBOSITY'] = 'error'
os.environ['DIFFUSERS_VERBOSITY'] = 'error'
os.environ['HF_HUB_DISABLE_PROGRESS_BARS'] = '1'
os.environ['HF_HUB_DISABLE_TELEMETRY'] = '1'

# Redirect stdout to suppress progress bars
class SuppressOutput:
    def __init__(self):
        self.original_stdout = sys.stdout
        self.original_stderr = sys.stderr
    
    def __enter__(self):
        sys.stdout = open(os.devnull, 'w')
        sys.stderr = open(os.devnull, 'w')
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        sys.stdout.close()
        sys.stderr.close()
        sys.stdout = self.original_stdout
        sys.stderr = self.original_stderr

app = modal.App("openmodels-image-inference")

# Create image with dependencies for image generation
image = modal.Image.debian_slim().pip_install([
    "fastapi",
    "uvicorn", 
    "pydantic",
    "diffusers",
    "torch",
    "transformers",
    "accelerate",
    "pillow",
    "numpy"
]).env({
    "PYTHONIOENCODING": "utf-8", 
    "LANG": "en_US.UTF-8",
    "TRANSFORMERS_VERBOSITY": "error",
    "DIFFUSERS_VERBOSITY": "error", 
    "HF_HUB_DISABLE_PROGRESS_BARS": "1",
    "HF_HUB_DISABLE_TELEMETRY": "1"
})

model_cache = {}

class ImageRequest(BaseModel):
    model: str
    prompt: str
    n: int = 1
    size: str = "1024x1024"
    quality: str = "standard"
    style: str = "vivid"

class ImageData(BaseModel):
    b64_json: Optional[str] = None
    url: Optional[str] = None
    revised_prompt: Optional[str] = None

class ImageResponse(BaseModel):
    created: int
    data: List[ImageData]

def load_model(model_name: str):
    """Load image generation model with caching"""
    if model_name not in model_cache:
        print(f"Loading image model: {model_name}")
        
        # Suppress all output during model loading
        with SuppressOutput():
            from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
            import torch
            
            # Load Stable Diffusion pipeline
            pipe = StableDiffusionPipeline.from_pretrained(
                model_name,
                torch_dtype=torch.float16,
                use_safetensors=True
            )
            
            # Use DPMSolver for faster inference
            pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)
            pipe = pipe.to("cuda")
            
            # Enable memory efficient attention
            pipe.enable_attention_slicing()
            
            model_cache[model_name] = pipe
        
        print(f"Image model {model_name} loaded successfully!")
    
    return model_cache[model_name]

def parse_size(size_str: str) -> tuple:
    """Parse size string to width, height tuple"""
    width, height = map(int, size_str.split('x'))
    return width, height

@app.function(image=image, gpu="A10G", max_containers=4, scaledown_window=300)
@modal.asgi_app()
def create_app():
    from fastapi import FastAPI, HTTPException
    
    fastapi_app = FastAPI(title="OpenModels Image Inference")

    @fastapi_app.post("/image")
    async def create_images(request: ImageRequest):
        try:
            # Load the model
            pipe = load_model(request.model)
            
            # Parse size
            width, height = parse_size(request.size)
            
            # Generate images
            images = pipe(
                prompt=request.prompt,
                height=height,
                width=width,
                num_images_per_prompt=request.n,
                num_inference_steps=20 if request.quality == "standard" else 50,
                guidance_scale=7.5
            ).images
            
            # Convert images to base64
            image_data = []
            for i, image in enumerate(images):
                # Convert PIL image to base64
                buffer = io.BytesIO()
                image.save(buffer, format="PNG")
                img_str = base64.b64encode(buffer.getvalue()).decode()
                
                image_data.append({
                    "b64_json": img_str,
                    "revised_prompt": request.prompt
                })
            
            return ImageResponse(
                created=int(uuid.uuid4().time_low),
                data=image_data
            )
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    
    @fastapi_app.get("/health")
    async def health_check():
        return {"status": "healthy", "loaded_models": list(model_cache.keys())}
    
    @fastapi_app.get("/models")
    async def list_models():
        """List available image generation models"""
        return {
            "models": [
                "stabilityai/stable-diffusion-xl-base-1.0",
                "runwayml/stable-diffusion-v1-5",
                "stabilityai/stable-diffusion-2-1",
                "CompVis/stable-diffusion-v1-4"
            ]
        }

    return fastapi_app