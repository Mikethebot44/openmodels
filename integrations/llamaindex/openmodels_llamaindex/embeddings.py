from typing import List, Optional, Any
import requests
import json
from llama_index.embeddings.base import BaseEmbedding


class OpenModelsEmbedding(BaseEmbedding):
    """OpenModels Embedding for LlamaIndex."""

    def __init__(
        self,
        base_url: str,
        model: str,
        api_key: Optional[str] = None,
        encoding_format: str = "float",
        **kwargs: Any,
    ) -> None:
        self.base_url = base_url
        self.model = model
        self.api_key = api_key
        self.encoding_format = encoding_format
        super().__init__(**kwargs)

    def _get_query_embedding(self, query: str) -> List[float]:
        """Get embedding for a single query."""
        return self._get_embeddings([query])[0]

    def _get_text_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Get embeddings for multiple texts."""
        return self._get_embeddings(texts)

    def _get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Get embeddings from OpenModels API."""
        headers = {
            "Content-Type": "application/json",
        }
        
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        data = {
            "model": self.model,
            "input": texts if len(texts) > 1 else texts[0],
            "encoding_format": self.encoding_format
        }

        try:
            response = requests.post(
                f"{self.base_url}/embed",
                headers=headers,
                json=data,
                timeout=30
            )
            response.raise_for_status()
            
            result = response.json()
            
            if isinstance(result["data"], list):
                return [item["embedding"] for item in result["data"]]
            else:
                return [result["data"]["embedding"]]
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"OpenModels embedding API error: {e}")

    async def _aget_query_embedding(self, query: str) -> List[float]:
        """Async get embedding for a single query."""
        # For now, just call the sync version
        return self._get_query_embedding(query)

    async def _aget_text_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Async get embeddings for multiple texts."""
        # For now, just call the sync version
        return self._get_text_embeddings(texts)
