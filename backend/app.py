from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
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
async def create_flashcards(
    request: FlashcardRequest,
    language: Optional[str] = Header(None)
):
    flashcards = flashcard_pipeline(request.text, language=language)
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

@app.post("/upload-generate")
async def upload_and_generate(
    file: UploadFile = File(...),
    language: Optional[str] = Header(None)
):
    contents = await file.read()
    filename = file.filename.lower()
    text = ""

    if filename.endswith(".pdf"):
        text = extract_from_pdf(contents)
    elif filename.endswith(".docx"):
        text = extract_from_docx(contents)
    elif filename.endswith(".txt"):
        text = contents.decode("utf-8")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    flashcards = flashcard_pipeline(text, language=language)
    return {"flashcards": flashcards}
