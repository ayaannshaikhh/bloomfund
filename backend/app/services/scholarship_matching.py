import os
import json
from anthropic import Anthropic
from app.db.models import get_all_scholarships
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

client = Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

def scholarship_matching(resume_json):

    # Get scholarship list from DB
    scholarships = get_all_scholarships()

    # Top-level system prompt (required by SDK)
    system_prompt = (
    "You are an expert scholarship-matching system. "
    "You ONLY output machine-readable JSON. "
    "You MUST respond with an object that has exactly one top-level key: "
    "`ranked_scholarships`, which is a non-empty array. "
    "No explanations, no markdown, no extra keys."
    )

    # Build user text block (must be text only)
    user_content = (
        "Here is the user's extracted profile JSON:\n\n"
        f"{json.dumps(resume_json, indent=2)}\n\n"
        "Here is the list of scholarships from the database:\n\n"
        f"{json.dumps(scholarships, indent=2)}\n\n"

        "Your task:\n"
        "- Compare the user's profile to each scholarship's eligibility.\n"
        "- Determine eligibility_status: eligible, partially_eligible, not_eligible.\n"
        "- Assign match_score from 0 to 100.\n"
        "- Provide a brief reason for each.\n"
        "- Sort results from highest match to lowest.\n\n"

        "Return ONLY this JSON schema:\n\n"
        "{\n"
        "  \"ranked_scholarships\": [\n"
        "    {\n"
        "      \"scholarship_id\": <number>,\n"
        "      \"title\": \"string\",\n"
        "      \"match_score\": <0-100>,\n"
        "      \"eligibility_status\": \"eligible | partially_eligible | not_eligible\",\n"
        "      \"reason\": \"string\"\n"
        "    }\n"
        "  ]\n"
        "}\n\n"
        "Return STRICT JSON ONLY. No markdown, no explanation."
    )

    # Call Claude 3 Haiku API
    response = client.messages.create(
        model="claude-2.1",
        max_tokens=1500,
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content":[
                    {"type": "text", "text": user_content}
                ]
            }
        ]
    )

    # Extract returned text block
    output_text = None
    for block in response.content:
        if block.type == "text":
            output_text = block.text
            break
    
    if not output_text:
        raise RuntimeError("No text content returned from Claude.")

    # Clean + parse JSON
    cleaned = output_text.strip()
    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"Claude returned invalid JSON: {cleaned}") from e

    return parsed.get("ranked_scholarships", [])