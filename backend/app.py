from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from flashcard_agent_pipeline.agent_pipeline import flashcard_pipeline
import fitz
import docx
import io


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


@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    contents = await file.read()
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        return {"text": extract_from_pdf(contents)}
    elif filename.endswith(".docx"):
        return {"text": extract_from_docx(contents)}
    elif filename.endswith(".txt"):
        return {"text": contents.decode("utf-8")}
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")


def extract_from_pdf(data: bytes) -> str:
    pdf = fitz.open(stream=data, filetype="pdf")
    return "\n".join(page.get_text() for page in pdf)


def extract_from_docx(data: bytes) -> str:
    file_stream = io.BytesIO(data)
    doc = docx.Document(file_stream)
    return "\n".join(p.text for p in doc.paragraphs)
