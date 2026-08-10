import pickle
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# Load embedding model
print("Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")

# Load FAISS index
print("Loading FAISS index...")
index = faiss.read_index("vector_db/kcc_index.faiss")

# Load documents
with open("vector_db/documents.pkl", "rb") as f:
    documents = pickle.load(f)

print("\nAgroSaarthi AI Semantic Search Ready!\n")

while True:

    query = input("Ask a farming question (type 'exit' to quit): ")

    if query.lower() == "exit":
        break

    query_embedding = model.encode([query]).astype("float32")

    distances, indices = index.search(query_embedding, k=5)

    print("\n========== TOP MATCHES ==========\n")

    for i, idx in enumerate(indices[0]):

        print(f"Result {i+1}")
        print("-" * 50)
        print(documents[idx])
        print()