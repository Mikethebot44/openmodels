from typing import Any, List, Optional, Sequence
import requests
import json
from llama_index.llms.base import LLM, LLMMetadata
from llama_index.llms.custom import CustomLLM
from llama_index.llms.types import ChatMessage, MessageRole, CompletionResponse, CompletionResponseGen
from llama_index.callbacks import CallbackManager


class OpenModelsLLM(CustomLLM):
    """OpenModels LLM for LlamaIndex."""

    def __init__(
        self,
        base_url: str,
        model: str,
        api_key: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 200,
        callback_manager: Optional[CallbackManager] = None,
        **kwargs: Any,
    ) -> None:
        self.base_url = base_url
        self.model = model
        self.api_key = api_key
        self.temperature = temperature
        self.max_tokens = max_tokens
        
        super().__init__(
            callback_manager=callback_manager,
            **kwargs,
        )

    @property
    def metadata(self) -> LLMMetadata:
        """Get LLM metadata."""
        return LLMMetadata(
            context_window=self.max_tokens,
            num_output=self.max_tokens,
            model_name=self.model,
        )

    @property
    def _llm_type(self) -> str:
        """Return type of LLM."""
        return "openmodels"

    def _call(self, prompt: str, **kwargs: Any) -> str:
        """Call the OpenModels API."""
        headers = {
            "Content-Type": "application/json",
        }
        
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        data = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "stream": False
        }

        try:
            response = requests.post(
                f"{self.base_url}/chat",
                headers=headers,
                json=data,
                timeout=30
            )
            response.raise_for_status()
            
            result = response.json()
            return result["choices"][0]["message"]["content"]
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"OpenModels API error: {e}")

    def stream_complete(self, prompt: str, **kwargs: Any) -> CompletionResponseGen:
        """Stream completion from OpenModels API."""
        headers = {
            "Content-Type": "application/json",
        }
        
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        data = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "stream": True
        }

        try:
            response = requests.post(
                f"{self.base_url}/chat",
                headers=headers,
                json=data,
                stream=True,
                timeout=30
            )
            response.raise_for_status()
            
            def generate() -> CompletionResponseGen:
                for line in response.iter_lines():
                    if line:
                        line_str = line.decode('utf-8')
                        if line_str.startswith('data: '):
                            data_str = line_str[6:]
                            if data_str == '[DONE]':
                                break
                            try:
                                chunk = json.loads(data_str)
                                if chunk.get("choices") and chunk["choices"][0].get("delta", {}).get("content"):
                                    yield CompletionResponse(
                                        delta=chunk["choices"][0]["delta"]["content"],
                                        raw=chunk
                                    )
                            except json.JSONDecodeError:
                                continue
            
            return generate()
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"OpenModels API error: {e}")

    def chat(self, messages: Sequence[ChatMessage], **kwargs: Any) -> ChatResponse:
        """Chat with the OpenModels API."""
        # Convert LlamaIndex messages to OpenModels format
        openmodels_messages = []
        for msg in messages:
            if msg.role == MessageRole.USER:
                openmodels_messages.append({"role": "user", "content": msg.content})
            elif msg.role == MessageRole.ASSISTANT:
                openmodels_messages.append({"role": "assistant", "content": msg.content})
            elif msg.role == MessageRole.SYSTEM:
                openmodels_messages.append({"role": "system", "content": msg.content})

        headers = {
            "Content-Type": "application/json",
        }
        
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        data = {
            "model": self.model,
            "messages": openmodels_messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "stream": False
        }

        try:
            response = requests.post(
                f"{self.base_url}/chat",
                headers=headers,
                json=data,
                timeout=30
            )
            response.raise_for_status()
            
            result = response.json()
            return ChatResponse(
                message=ChatMessage(
                    role=MessageRole.ASSISTANT,
                    content=result["choices"][0]["message"]["content"]
                ),
                raw=result
            )
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"OpenModels API error: {e}")
