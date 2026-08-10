from fastapi import APIRouter

from backend.app.models.requests import AskRequest
from backend.app.location.lookup import get_location
from backend.app.rag.retriever import search
from backend.app.rag.prompt_builder import build_prompt
from backend.app.rag.generator import generate_answer

router = APIRouter()


@router.post("/ask")
def ask(request: AskRequest):

    location = get_location(request.pincode)

    district = (
        location["district"]
        if location
        else "Unknown"
    )

    docs = search(
    request.question,
    district=district
)

    prompt = build_prompt(
        request.question,
        district,
        docs
    )

    answer = generate_answer(prompt)

    return {
        "question": request.question,
        "district": district,
        "office": location["office"] if location else "Unknown",
        "retrieved_documents": docs,
        "answer": answer
    }