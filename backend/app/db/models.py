from .supabase_client import supabase
from datetime import datetime

def get_all_scholarships():
    response = ( 
        supabase.table("scholarships")
        .select("*")
        .execute()
    )
    return response.data

def add_a_scholarship(title, eligibility, description, essay_required, deadline, link):
    deadline = deadline.strftime("%Y-%m-%d")
    response = (
        supabase.table("scholarships")
        .insert([
            {"title": title, "eligibility": eligibility, "description": description, "essay_required": essay_required, "deadline": deadline, "link": link}
            ])
        .execute()
    )
    return response.data

def save_a_scholarship(user_id, scholarship_id):
    response = (
        supabase.table("favourites")
        .insert({"user_id": user_id, "scholarship_id": scholarship_id})
        .execute()
    )
    return response.data

def get_scholarship_by_id(scholarship_id):
    response = (
        supabase.table("scholarships")
        .select("*")
        .eq("scholarship_id", scholarship_id)
        .single()
        .execute()
    )
    return response.data

def get_user_favourites(user_id):
    response = (
        supabase.table("favourites")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    return response.data

def remove_favourite(user_id, scholarship_id):
    response = (
        supabase.table("favourites")
        .delete()
        .eq("user_id", user_id)
        .eq("scholarship_id", scholarship_id)
        .execute()
    )
    return response.data

def get_user_scholarship_deadlines(user_id):
    response = (
        supabase.table("favourites")
        .select("scholarships (id, title, deadline, link)")
        .eq("user_id", user_id)
        .execute()
    )
    return response.data

