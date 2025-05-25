from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from flashcard_agent_pipeline.agent_pipeline import flashcard_pipeline


app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class FlashcardRequest(BaseModel):
    text: str


@app.post("/flashcard")
async def create_flashcards(request: FlashcardRequest):
    flashcards = flashcard_pipeline(request.text)
    return {"flashcards": flashcards}
