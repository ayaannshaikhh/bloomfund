from datetime import datetime
from app.db.models import get_user_scholarship_deadlines

def calculate_deadline_status(deadline_str):
    deadline = datetime.strptime(deadline_str, "%Y-%m-%d").date()
    today = datetime.today().date()
    delta = (deadline - today).days

    if delta < 0:
        status = "expired"
    elif delta == 0:
        status = "due_today"
    elif delta <= 7:
        status = "due_soon"
    else:
        status = "upcoming"
    
    return {"status": status, "days_left": delta}

def get_user_notifications(user_id):
    fav_scholarships = get_user_scholarship_deadlines(user_id)
    notifications = []

    for item in fav_scholarships:
        scholarship = item['scholarships']
        status_info = calculate_deadline_status(scholarship['deadline'])

        if status_info['status'] in ['due_today', 'due_soon']:
            notifications.append({
                "id": scholarship['id'],
                "title": scholarship['title'],
                "deadline": scholarship['deadline'],
                "link": scholarship['link'],
                "status": status_info['status'],
                "days_left": status_info['days_left']
            })
    
    return notifications