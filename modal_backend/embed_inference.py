import modal

app = modal.App("openmodels-embed-inference")

# Create image with dependencies for embeddings
image = modal.Image.debian_slim().pip_install([
    "fastapi",
    "uvicorn", 
    "pydantic",
    "sentence-transformers",
    "torch",
    "numpy"
])

@app.function(image=image, gpu="A10G", max_containers=4, scaledown_window=300)
@modal.asgi_app()
def create_app():
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel
    from typing import List, Dict, Any, Optional
    import json
    import uuid
    import numpy as np
    from sentence_transformers import SentenceTransformer
    
    fastapi_app = FastAPI(title="OpenModels Embedding Inference")
    
    # Global model cache
    model_cache = {}
    
    class EmbeddingRequest(BaseModel):
        model: str
        input: str | List[str]
        encoding_format: Optional[str] = "float"

    class EmbeddingResponse(BaseModel):
        object: str = "list"
        data: List[Dict[str, Any]]
        model: str
        usage: Dict[str, int]
    
    def load_model(model_name: str):
        """Load embedding model with caching"""
        if model_name not in model_cache:
            print(f"Loading embedding model: {model_name}")
            
            # Load sentence transformer model
            model = SentenceTransformer(model_name)
            model_cache[model_name] = model
            print(f"Embedding model {model_name} loaded successfully!")
        
        return model_cache[model_name]
    
    @fastapi_app.post("/embed")
    async def create_embeddings(request: EmbeddingRequest):
        try:
            # Load the model
            model = load_model(request.model)
            
            # Handle single string or list of strings
            if isinstance(request.input, str):
                texts = [request.input]
            else:
                texts = request.input
            
            # Generate embeddings
            embeddings = model.encode(texts, normalize_embeddings=True)
            
            # Convert to list format
            embedding_data = []
            for i, embedding in enumerate(embeddings):
                embedding_data.append({
                    "object": "embedding",
                    "index": i,
                    "embedding": embedding.tolist()
                })
            
            # Calculate usage (rough estimate)
            total_tokens = sum(len(text.split()) for text in texts)
            
            return EmbeddingResponse(
                data=embedding_data,
                model=request.model,
                usage={
                    "prompt_tokens": total_tokens,
                    "total_tokens": total_tokens
                }
            )
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    
    @fastapi_app.get("/health")
    async def health_check():
        return {"status": "healthy", "loaded_models": list(model_cache.keys())}
    
    @fastapi_app.get("/models")
    async def list_models():
        """List available embedding models"""
        return {
            "models": [
                "sentence-transformers/all-MiniLM-L6-v2",
                "sentence-transformers/all-mpnet-base-v2",
                "BAAI/bge-large-en",
                "BAAI/bge-base-en",
                "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
                "sentence-transformers/all-MiniLM-L12-v2"
            ]
        }
    
    return fastapi_app
