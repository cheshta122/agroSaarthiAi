import pickle
import faiss
import numpy as np

print("Loading embeddings...")

with open("vector_db/embeddings.pkl", "rb") as f:
    embeddings = pickle.load(f)

embeddings = np.array(embeddings).astype("float32")

print("Embedding Shape:", embeddings.shape)

dimension = embeddings.shape[1]

index = faiss.IndexFlatL2(dimension)

index.add(embeddings)

faiss.write_index(index, "vector_db/kcc_index.faiss")

print("Index built successfully!")
print("Total vectors:", index.ntotal)