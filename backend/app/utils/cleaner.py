import re

def clean_extracted_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\n\s*\n+", "\n", text)
    text = text.encode("utf-8", "ignore").decode()
    return text.strip()
