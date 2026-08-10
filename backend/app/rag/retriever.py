import faiss
import pickle
import numpy as np
import re
from sentence_transformers import SentenceTransformer
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

model = SentenceTransformer("all-MiniLM-L6-v2")

index = faiss.read_index(
    str(BASE_DIR / "vector_store" / "kcc_index.faiss")
)

with open(BASE_DIR / "vector_store" / "documents.pkl", "rb") as f:
    documents = pickle.load(f)


def search(query, district=None, top_k=5):

    embedding = model.encode([query])

    distances, indices = index.search(
        np.array(embedding).astype("float32"),
        20
    )

    district_docs = []
    other_docs = []

    for idx in indices[0]:

        doc = documents[idx]

        match = re.search(
            r"District:\s*(.+)",
            doc,
            re.IGNORECASE
        )

        doc_district = ""

        if match:
            doc_district = match.group(1).strip().upper()

        if district and doc_district == district.upper():
            district_docs.append(doc)
        else:
            other_docs.append(doc)

    return (district_docs + other_docs)[:top_k]