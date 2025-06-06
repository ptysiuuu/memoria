from flashcard_agent_pipeline.extractor import extract_facts
from flashcard_agent_pipeline.generator import generate_flashcards


def parse_text(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


def flashcard_pipeline(text: str, language: str = 'english') -> str:
    facts = extract_facts(text)
    flashcards = generate_flashcards(facts, language)

    return flashcards
