import os
import json
from anthropic import Anthropic
from app.db.models import get_scholarship_by_id
from dotenv import load_dotenv

load_dotenv()

client = Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

def generate_essay(user_info, scholarship_id):
    # Fetch scholarship details
    scholarship_info = get_scholarship_by_id(scholarship_id)

    # SYSTEM PROMPT — must be top-level
    system_prompt = (
        "You are an expert scholarship-essay writing system. "
        "Your job is to generate polished, compelling, and personalized scholarship essays. "
        "You MUST:\n"
        "- Write in a human, natural, authentic tone.\n"
        "- Base content ONLY on the user's provided profile.\n"
        "- Never invent accomplishments or facts.\n"
        "- Relate content to the scholarship's mission, values, and eligibility.\n"
        "- Structure with intro, body, conclusion.\n"
        "- Length: 300–600 words unless stated otherwise.\n"
        "- Output ONLY plain text. No JSON, Markdown, or special formatting."
    )

    # USER MESSAGE — must be TEXT block only
    user_content = (
        "Here is the user's extracted profile (as JSON):\n\n"
        f"{json.dumps(user_info, indent=2)}\n\n"
        "Here is the scholarship's information:\n\n"
        f"{json.dumps(scholarship_info, indent=2)}\n\n"
        "Write a tailored scholarship essay based on this information.\n\n"
        "Instructions:\n"
        "1. Analyze the user's education, skills, experience, extracurriculars, projects, awards, and goals.\n"
        "2. Identify qualities that directly match the scholarship's mission and eligibility.\n"
        "3. If the scholarship includes an essay prompt, answer it fully.\n"
        "4. Write an authentic, persuasive, human-sounding essay.\n"
        "5. DO NOT invent new accomplishments or make up details.\n\n"
        "Return ONLY the final essay in plain text."
    )

    # CALL CLAUDE 3
    response = client.messages.create(
        model="claude-3-sonnet-20240229",  # recommended over "claude-sonnet-4-5"
        max_tokens=1500,
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": user_content}
                ]
            }
        ]
    )

    # Extract first text block safely
    for block in response.content:
        if block.type == "text":
            return block.text

    raise RuntimeError("No text content returned from Claude.")