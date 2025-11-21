import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

client = Anthropic(
    api_key=os.getenv("CLAUDE_API_KEY")
)

def jsonify_user_resume(resume_text: str) -> str:

    message = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=1000,

        # ✔ SYSTEM GOES HERE — NOT in messages[]
        system=(
            "You are an expert resume-analysis system. "
            "Your job is to extract structured data from raw, unformatted resume text. "
            "You must output strictly valid JSON and never include explanations or commentary. "
            "If a field is missing, return null or an empty list."
        ),

        # ✔ ONLY user messages go inside messages[]
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text":
                        "Extract a structured JSON profile from the following resume text.\n\n"
                        "The JSON must follow this schema:\n\n"
                        "{\n"
                        '  \"name\": \"string or null\",\n'
                        '  \"email\": \"string or null\",\n'
                        '  \"phone\": \"string or null\",\n'
                        '  \"education\": [\n'
                        "    {\n"
                        '      \"institution\": \"string\",\n'
                        '      \"degree\": \"string\",\n'
                        '      \"major\": \"string or null\",\n'
                        '      \"minor\": \"string or null\",\n'
                        '      \"gpa\": \"number or null\",\n'
                        '      \"year\": \"string or null\"\n'
                        "    }\n"
                        "  ],\n"
                        '  \"experience\": [\n'
                        "    {\n"
                        '      \"title\": \"string\",\n'
                        '      \"organization\": \"string\",\n'
                        '      \"start_date\": \"string or null\",\n'
                        '      \"end_date\": \"string or null\",\n'
                        '      \"description\": \"string\"\n'
                        "    }\n"
                        "  ],\n"
                        '  \"skills\": [\"string\"],\n'
                        '  \"projects\": [\n'
                        "    {\n"
                        '      \"title\": \"string\",\n'
                        '      \"description\": \"string\"\n'
                        "    }\n"
                        "  ],\n"
                        '  \"extracurriculars\": [\"string\"],\n'
                        '  \"certifications\": [\"string\"],\n'
                        '  \"awards\": [\"string\"]\n'
                        "}\n\n"
                        "Here is the user's resume text:\n\n"
                        f"{resume_text}\n\n"
                        "Respond ONLY with valid JSON following the schema."
                    }
                ]
            }
        ]
    )

    # Safely extract text block
    for block in message.content:
        if block.type == "text":
            return block.text

    raise RuntimeError("Claude returned no text content.")