import pandas as pd
from sentence_transformers import SentenceTransformer
import pickle
import os

print("Loading dataset...")

df = pd.read_csv("data/processed/kcc_clean.csv")

print("Loading embedding model...")

model = SentenceTransformer("all-MiniLM-L6-v2")

documents = []

for _, row in df.iterrows():

    text = f"""
Farmer Query:
{row['QueryText']}

Expert Answer:
{row['KccAns']}

Crop:
{row['Crop']}

Category:
{row['Category']}

District:
{row['DistrictName']}
"""

    documents.append(text)

print("Generating embeddings...")

embeddings = model.encode(
    documents,
    show_progress_bar=True
)

os.makedirs("vector_db", exist_ok=True)

with open("vector_db/documents.pkl", "wb") as f:
    pickle.dump(documents, f)

with open("vector_db/embeddings.pkl", "wb") as f:
    pickle.dump(embeddings, f)

print("\nDone!")
print("Total Documents:", len(documents))
print("Embedding Shape:", embeddings.shape)