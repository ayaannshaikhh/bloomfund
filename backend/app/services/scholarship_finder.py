import os
import json
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()
client = Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

def scholarship_finder(resume_data: dict):
    """
    Analyzes user's resume data and finds matching REAL scholarships using web search.
    Works for any student profile - adapts search to their specific qualifications.
    """
    system_prompt = """You are a scholarship research assistant. Find REAL scholarships matching the user's profile using web search. Return ONLY valid JSON, no commentary.

JSON schema:
{
  "scholarships": [{
    "title": "string",
    "description": "string",
    "eligibility": {
      "major": ["string"] or null,
      "degree_level": ["string"] or null,
      "gpa_min": number or null,
      "year_of_study": ["string"] or null,
      "demographic_requirements": ["string"] or null
    },
    "essay_required": boolean,
    "deadline": "YYYY-MM-DD",
    "award_amount": "string",
    "link": "https://..."
  }]
}"""

    # Build concise search criteria
    criteria = []
    if resume_data.get("major"):
        criteria.append(f"Major: {resume_data['major']}")
    if resume_data.get("degree_level"):
        criteria.append(f"Level: {resume_data['degree_level']}")
    if resume_data.get("gpa"):
        criteria.append(f"GPA: {resume_data['gpa']}")
    if resume_data.get("demographics"):
        criteria.append(f"Demographics: {', '.join(resume_data['demographics'])}")

    user_message_text = f"""Profile: {' | '.join(criteria)}

Search for 5-7 real scholarships matching this profile. After searching, return results in JSON format only."""

    messages = [{"role": "user", "content": user_message_text}]

    # Initial API call
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system=system_prompt,
        tools=[{"type": "web_search_20250305", "name": "web_search"}],
        messages=messages
    )

    # Handle tool use loop with minimal context
    iteration = 0
    max_iterations = 10
    
    while response.stop_reason == "tool_use" and iteration < max_iterations:
        iteration += 1
        
        tool_uses = [b for b in response.content if b.type == "tool_use"]
        
        # Only keep the last message exchange to reduce tokens
        if len(messages) > 2:
            messages = messages[-2:]
        
        messages.append({"role": "assistant", "content": response.content})
        
        tool_results = [
            {
                "type": "tool_result",
                "tool_use_id": tu.id,
                "content": "Search completed"
            }
            for tu in tool_uses
        ]
        
        messages.append({"role": "user", "content": tool_results})

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=system_prompt,
            tools=[{"type": "web_search_20250305", "name": "web_search"}],
            messages=messages
        )
    
    # Extract text from final response
    output_text = None
    for block in response.content:
        if block.type == "text":
            output_text = block.text
            break
    
    if not output_text:
        raise RuntimeError("No text returned by Claude.")
    
    # If response is not JSON, request JSON format
    if not output_text.strip().startswith(("{", "[")):
        messages = messages[-2:] + [
            {"role": "assistant", "content": response.content},
            {"role": "user", "content": "Return scholarship results as JSON only, no text."}
        ]
        
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=system_prompt,
            messages=messages
        )
        
        output_text = None
        for block in response.content:
            if block.type == "text":
                output_text = block.text
                break

    if not output_text:
        raise RuntimeError("No text in final response.")

    # Clean and parse JSON
    cleaned = output_text.strip()
    
    # Remove markdown if present
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        cleaned = "\n".join(lines[1:-1]).strip()

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON: {e}\n\nRaw output:\n{cleaned}")

    scholarships = parsed.get("scholarships", [])
    
    if not isinstance(scholarships, list):
        raise ValueError(f"Expected list, got {type(scholarships)}")
    
    return scholarships