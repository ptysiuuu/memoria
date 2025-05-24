import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_flashcards(facts: str) -> str:
    prompt = f"""
Convert the following facts into a set of Q&A flashcards. Format:
Q: ...
A: ...

Facts:
{facts}
"""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()
