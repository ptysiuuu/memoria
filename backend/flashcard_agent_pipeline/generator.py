import os
from openai import OpenAI
from dotenv import load_dotenv
import json


load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_flashcards(facts: str, study_goal: str, detail_level: str = "3", language: str = 'english') -> list[dict]:
    prompt = f"""
You are a creative flashcard generator. From the following facts, generate a JSON array of Q&A flashcards.

Try to not only restate the facts directly, but also add some questions deeply related to provided topic.

The language of the flashcards should be: {language}, if this value doesn't represent a language - english is the default.

The detail level of the generate flashcards should be: {detail_level}/5. If this value doesn't represent a valid detail level, use: 3/5.

The study goal of the user is: {study_goal}. If this value doesn't represent a valid study goal, ignore this part.

Format:
[
  {{
    "question": "...",
    "answer": "..."
  }},
  ...
]

Facts:
{facts}
"""
    print(prompt)
    response = client.chat.completions.create(
        model="o4-mini-2025-04-16",
        messages=[{"role": "user", "content": prompt}],
    )

    raw_output = response.choices[0].message.content.strip()

    try:
        flashcards = json.loads(raw_output)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON returned from LLM: {e}\nOutput:\n{raw_output}")

    return flashcards

