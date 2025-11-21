from pypdf import PdfReader
from io import BytesIO
from app.utils.cleaner import clean_extracted_text

def read_pdf_bytes(file_bytes):
    reader = PdfReader(BytesIO(file_bytes))
    page = reader.pages[0]
    raw_text = page.extract_text()
    cleaned_text = clean_extracted_text(raw_text)

    return cleaned_text