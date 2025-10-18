from openmodels_llamaindex import OpenModelsLLM, OpenModelsEmbedding
from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext
from llama_index.llms import ChatMessage, MessageRole
import asyncio


async def llamaindex_example():
    """Basic LlamaIndex example with OpenModels."""
    
    # Initialize OpenModels LLM
    llm = OpenModelsLLM(
        base_url="https://mikethebot44--openmodels-text-inference-create-app.modal.run",
        model="microsoft/DialoGPT-medium",
        temperature=0.7,
        max_tokens=200
    )
    
    # Initialize OpenModels Embeddings
    embeddings = OpenModelsEmbedding(
        base_url="https://mikethebot44--openmodels-embed-inference-create-app.modal.run",
        model="sentence-transformers/all-MiniLM-L6-v2"
    )
    
    # Create service context
    service_context = ServiceContext.from_defaults(
        llm=llm,
        embed_model=embeddings
    )
    
    # Create sample documents
    documents = [
        "Artificial intelligence is transforming industries worldwide.",
        "Machine learning algorithms can process vast amounts of data efficiently.",
        "Natural language processing enables computers to understand human language.",
        "Computer vision allows machines to interpret visual information.",
        "Deep learning uses neural networks to solve complex problems."
    ]
    
    # Create index
    print("Creating vector index...")
    index = VectorStoreIndex.from_documents(
        documents,
        service_context=service_context
    )
    
    # Create query engine
    query_engine = index.as_query_engine()
    
    # Ask questions
    questions = [
        "What is artificial intelligence?",
        "How does machine learning work?",
        "What are the applications of NLP?"
    ]
    
    for question in questions:
        print(f"\nQuestion: {question}")
        response = query_engine.query(question)
        print(f"Answer: {response.response}")


if __name__ == "__main__":
    asyncio.run(llamaindex_example())
