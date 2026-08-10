from fastapi import FastAPI
from backend.app.api.search import router

app = FastAPI(title="AgroSaarthi AI")

app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "Welcome to AgroSaarthi AI 🌾"
    }