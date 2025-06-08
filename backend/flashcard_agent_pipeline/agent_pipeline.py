from flashcard_agent_pipeline.extractor import extract_facts
from flashcard_agent_pipeline.generator import generate_flashcards


def parse_text(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


def flashcard_pipeline(text: str, keywords: str, study_goal: str,  language: str = 'english', detail_level: str = "3") -> str:
    facts = extract_facts(text, keywords)
    flashcards = generate_flashcards(facts, study_goal, detail_level, language)

    return flashcards
