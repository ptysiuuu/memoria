import os
from openai import OpenAI
from dotenv import load_dotenv
import json


load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_flashcards(facts: str) -> list[dict]:
    prompt = f"""
You are a creative flashcard generator. From the following facts, generate a JSON array of Q&A flashcards.

Try to not only restate the facts directly, but also add some questions deeply related to provided topic.

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
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    raw_output = response.choices[0].message.content.strip()

    try:
        flashcards = json.loads(raw_output)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON returned from LLM: {e}\nOutput:\n{raw_output}")

    return flashcards

