import os
from openai import OpenAI
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_facts(text: str, keywords: Optional[str] = None) -> str:
    """
    Extracts concise facts or key points from the given text.
    Can additionally take keywords into account.

    Args:
        text (str): The source text from which facts are to be extracted.
        keywords (Optional[str]): Optional keywords for the AI to focus on.

    Returns:
        str: The generated facts.
    """

    prompt_base = """
Extract concise, clear, and important facts or key points from the following text.
Ensure each fact is presented in a flashcard-friendly format.
"""

    if keywords:
        keyword_instruction = f"""
Additionally, prioritize and extract facts specifically related to these keywords/topics: {keywords}.
If a fact is strongly related to one of the keywords, make sure to include it.
"""
    else:
        keyword_instruction = ""

    final_prompt = f"""
{prompt_base.strip()}
{keyword_instruction.strip()}

Text to analyze:
{text}

Please list the facts clearly, each on a new line (e.g., using bullet points or numbering):
"""

    response = client.chat.completions.create(
        model="o4-mini-2025-04-16",
        messages=[{"role": "user", "content": final_prompt}]
    )
    return response.choices[0].message.content.strip()
