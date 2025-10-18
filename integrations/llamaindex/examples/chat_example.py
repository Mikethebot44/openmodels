from openmodels_llamaindex import OpenModelsLLM, OpenModelsEmbedding
from llama_index import VectorStoreIndex, Document
from llama_index.llms import ChatMessage, MessageRole
import asyncio


async def chat_example():
    """Chat example with OpenModels LLM."""
    
    # Initialize OpenModels LLM
    llm = OpenModelsLLM(
        base_url="https://mikethebot44--openmodels-text-inference-create-app.modal.run",
        model="microsoft/DialoGPT-medium",
        temperature=0.7,
        max_tokens=200
    )
    
    # Start conversation
    messages = [
        ChatMessage(role=MessageRole.SYSTEM, content="You are a helpful AI assistant."),
        ChatMessage(role=MessageRole.USER, content="Hello! Can you tell me about machine learning?")
    ]
    
    print("Starting chat conversation...")
    
    # Chat loop
    while True:
        # Get AI response
        response = llm.chat(messages)
        print(f"AI: {response.message.content}")
        
        # Get user input
        user_input = input("\nYou: ")
        if user_input.lower() in ['exit', 'quit', 'bye']:
            break
            
        # Add user message to conversation
        messages.append(ChatMessage(role=MessageRole.USER, content=user_input))
        
        # Add AI response to conversation
        messages.append(response.message)
        
        # Keep conversation history manageable
        if len(messages) > 10:
            messages = messages[-10:]


async def streaming_example():
    """Streaming example with OpenModels LLM."""
    
    # Initialize OpenModels LLM
    llm = OpenModelsLLM(
        base_url="https://mikethebot44--openmodels-text-inference-create-app.modal.run",
        model="microsoft/DialoGPT-medium",
        temperature=0.7,
        max_tokens=200
    )
    
    prompt = "Write a short story about a robot learning to paint."
    
    print("Streaming response:")
    print("=" * 50)
    
    # Stream the response
    for chunk in llm.stream_complete(prompt):
        print(chunk.delta, end="", flush=True)
    
    print("\n" + "=" * 50)


if __name__ == "__main__":
    print("Choose an example:")
    print("1. Chat conversation")
    print("2. Streaming response")
    
    choice = input("Enter choice (1 or 2): ")
    
    if choice == "1":
        asyncio.run(chat_example())
    elif choice == "2":
        asyncio.run(streaming_example())
    else:
        print("Invalid choice")
