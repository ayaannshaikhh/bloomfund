import json
from app.services.scholarship_finder import scholarship_finder

resume_data = {
    "name": "Ayaan",
    "major": "Computer Science",
    "degree_level": "Undergraduate",
    "year_of_study": "2",
    "gpa": 3.7,
    "skills": ["python", "math", "data science"],
    "extracurriculars": ["coding club"],
    "demographics": ["international student"]
}

def test_finder():
    results = scholarship_finder(resume_data)
    print("\n=== SCHOLARSHIP FINDER OUTPUT ===")
    print(json.dumps(results, indent=2))
    assert isinstance(results, list)

# Allow direct running via: python -m app.tests.test_finder
if __name__ == "__main__":
    test_finder()
