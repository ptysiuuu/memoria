from agents.parser import parse_text
from agents.extractor import extract_facts
from agents.generator import generate_flashcards

def main():
    text = parse_text("sample.txt")
    facts = extract_facts(text)
    flashcards = generate_flashcards(facts)

    print("Generated Flashcards:\n")
    print(flashcards)

if __name__ == "__main__":
    main()
