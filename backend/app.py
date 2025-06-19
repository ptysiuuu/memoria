from fastapi import FastAPI, UploadFile, File, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from flashcard_agent_pipeline.agent_pipeline import flashcard_pipeline
from auth_utils import get_current_user
from firebase_admin import credentials, initialize_app
import os
import json
import fitz
import docx
import io


firebase_json = os.environ["FIREBASE_CREDENTIALS"]
cred_dict = json.loads(firebase_json)
cred = credentials.Certificate(cred_dict)
initialize_app(cred)

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
    language: Optional[str] = Header(None),
    user=Depends(get_current_user)
):
    flashcards = flashcard_pipeline(request.text, language=language)
    return {"flashcards": flashcards}

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...), user=Depends(get_current_user)):
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
    language: Optional[str] = Header(None),
    detail_level: Optional[int] = Header(None, alias="detail-level"),
    keywords: Optional[str] = Header(None, alias="keywords"),
    study_goal: Optional[str] = Header(None, alias="study-goal"),
    user=Depends(get_current_user)
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

    flashcards = flashcard_pipeline(text, keywords, study_goal, language, detail_level)
    return {"flashcards": flashcards}
