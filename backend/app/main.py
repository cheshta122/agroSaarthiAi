from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from backend.app.api.search import router
from backend.app.analytics import router as analytics_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(analytics_router)


@app.get("/")
def root():
    return {
        "message": "AgroSaarthi AI backend is running"
    }