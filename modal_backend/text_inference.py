import modal

app = modal.App("openmodels-text-inference")

# Create image with dependencies for any HF model
image = modal.Image.debian_slim().pip_install([
    "fastapi",
    "uvicorn", 
    "pydantic",
    "transformers",
    "torch",
    "accelerate",
    "sentencepiece",
    "protobuf"
])

@app.function(image=image, gpu="A10G", max_containers=4, scaledown_window=300)
@modal.asgi_app()
def create_app():
    from fastapi import FastAPI, HTTPException
    from fastapi.responses import StreamingResponse
    from pydantic import BaseModel
    from typing import List, Dict, Any, Optional
    import json
    import uuid
    import torch
    from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
    
    fastapi_app = FastAPI(title="OpenModels Text Inference")
    
    # Global model cache
    model_cache = {}
    
    class ChatMessage(BaseModel):
        role: str
        content: str

    class ChatCompletionRequest(BaseModel):
        model: str
        messages: List[ChatMessage]
        max_tokens: Optional[int] = 200
        temperature: Optional[float] = 0.7
        stream: Optional[bool] = False

    class ChatCompletionResponse(BaseModel):
        id: str
        object: str = "chat.completion"
        model: str
        choices: List[Dict[str, Any]]
        usage: Dict[str, int]
    
    def load_model(model_name: str):
        """Load model with caching"""
        if model_name not in model_cache:
            print(f"Loading model: {model_name}")
            
            # Use pipeline for easier handling
            pipe = pipeline(
                "text-generation",
                model=model_name,
                torch_dtype=torch.float16,
                device_map="auto",
                trust_remote_code=True
            )
            
            model_cache[model_name] = pipe
            print(f"Model {model_name} loaded successfully!")
        
        return model_cache[model_name]
    
    def format_messages_for_model(messages: List[ChatMessage], model_name: str) -> str:
        """Format messages based on model type"""
        prompt = ""
        
        # Simple formatting - can be enhanced per model
        for msg in messages:
            if msg.role == "system":
                prompt += f"System: {msg.content}\n"
            elif msg.role == "user":
                prompt += f"User: {msg.content}\n"
            elif msg.role == "assistant":
                prompt += f"Assistant: {msg.content}\n"
        
        # Add assistant prefix for generation
        prompt += "Assistant: "
        return prompt
    
    @fastapi_app.post("/chat")
    async def chat_completion(request: ChatCompletionRequest):
        try:
            # Load the model
            pipe = load_model(request.model)
            
            # Format messages
            prompt = format_messages_for_model(request.messages, request.model)
            
            if request.stream:
                return StreamingResponse(
                    stream_generation(pipe, prompt, request),
                    media_type="text/event-stream"
                )
            else:
                # Generate response
                result = pipe(
                    prompt,
                    max_new_tokens=request.max_tokens,
                    temperature=request.temperature,
                    do_sample=True,
                    pad_token_id=pipe.tokenizer.eos_token_id,
                    return_full_text=False
                )
                
                response_text = result[0]["generated_text"].strip()
                
                return ChatCompletionResponse(
                    id=f"chatcmpl-{uuid.uuid4().hex[:8]}",
                    model=request.model,
                    choices=[{
                        "message": {
                            "role": "assistant",
                            "content": response_text
                        },
                        "finish_reason": "stop"
                    }],
                    usage={
                        "prompt_tokens": len(prompt.split()),
                        "completion_tokens": len(response_text.split())
                    }
                )
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    
    async def stream_generation(pipe, prompt: str, request: ChatCompletionRequest):
        """Stream token generation"""
        try:
            # For streaming, we'll simulate token-by-token generation
            # This is a simplified version - real streaming would require more complex implementation
            
            result = pipe(
                prompt,
                max_new_tokens=request.max_tokens,
                temperature=request.temperature,
                do_sample=True,
                pad_token_id=pipe.tokenizer.eos_token_id,
                return_full_text=False
            )
            
            response_text = result[0]["generated_text"].strip()
            
            # Simulate streaming by yielding words
            words = response_text.split()
            for i, word in enumerate(words):
                chunk = {
                    "id": f"chatcmpl-{uuid.uuid4().hex[:8]}",
                    "object": "chat.completion.chunk",
                    "model": request.model,
                    "choices": [{
                        "delta": {"content": word + " "},
                        "finish_reason": None
                    }]
                }
                yield f"data: {json.dumps(chunk)}\n\n"
            
            # Send final chunk
            final_chunk = {
                "id": f"chatcmpl-{uuid.uuid4().hex[:8]}",
                "object": "chat.completion.chunk",
                "model": request.model,
                "choices": [{
                    "delta": {},
                    "finish_reason": "stop"
                }]
            }
            yield f"data: {json.dumps(final_chunk)}\n\n"
            yield "data: [DONE]\n\n"
            
        except Exception as e:
            error_chunk = {
                "error": {
                    "message": str(e),
                    "type": "server_error"
                }
            }
            yield f"data: {json.dumps(error_chunk)}\n\n"
    
    @fastapi_app.get("/health")
    async def health_check():
        return {"status": "healthy", "loaded_models": list(model_cache.keys())}
    
    @fastapi_app.get("/models")
    async def list_models():
        """List available models"""
        return {
            "models": [
                "meta-llama/Llama-3-8b",
                "microsoft/DialoGPT-medium", 
                "microsoft/DialoGPT-large",
                "facebook/blenderbot-400M-distill",
                "EleutherAI/gpt-neo-2.7B",
                "EleutherAI/gpt-j-6B",
                "microsoft/DialoGPT-small",
                "distilbert-base-uncased"
            ]
        }
    
    return fastapi_app