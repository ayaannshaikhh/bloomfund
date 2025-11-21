from app.services.scholarship_matching import scholarship_matching

# Fake resume JSON
resume = {
    "name": "Ayaan",
    "gpa": 3.7,
    "major": "Computer Science",
    "skills": ["python", "data science", "cybersecurity"]
}

# Fake DB scholarships (bypass Supabase)
def get_all_scholarships():
    return [
        {"id": 1, "title": "CS Excellence Award", "eligibility": {"major": "Computer Science"}},
        {"id": 2, "title": "Women in STEM", "eligibility": {"gender": "female"}},
    ]

import app.services.scholarship_matching
scholarship_matching.get_all_scholarships = get_all_scholarships

print(scholarship_matching(resume))
