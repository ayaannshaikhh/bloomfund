from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
from typing import Optional

from app.config import config
from app.services.file_validator import check_if_file_is_pdf
from app.services.pdf_extraction import read_pdf_bytes
from app.services.jsonify_user_data import jsonify_user_resume
from app.services.deadline_tracker import calculate_deadline_status
from app.services.scholarship_matching import scholarship_matching
from app.db.models import (
    get_all_scholarships,
    add_a_scholarship,
    get_scholarship_by_id,
    save_a_scholarship,
    get_user_favourites,
    get_user_scholarship_deadlines,
    remove_favourite
)

# initialize FastAPI app
app = FastAPI(
    title=config.API_TITLE,
    version=config.API_VERSION,
    description=config.API_DESCRIPTION
)

# configure CORS, allows frontend to connect to the backend 
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CORS_ORIGINS = [
    "http://localhost:3000",                 # local frontend
    "https://bloomfund-lac.vercel.app",      # vercel production frontend
]

# runs validation on startup
@app.on_event("startup")
async def startup_event():
    """Validate configuration on startup"""
    try:
        config.validate()
    except ValueError as e:
        raise RuntimeError(f"Configuration error: {e}")

# basic end point to check if the server is running
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Bloomfund API",
        "version": config.API_VERSION,
        "status": "running"
    }

# basic end point to check if the server is healthy
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# resume processing endpoints
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload a PDF resume and extract structured JSON data.
    
    - **file**: PDF file containing the resume
    """
    try:
        # validate file type
        if not check_if_file_is_pdf(file.filename):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only PDF files are supported."
            )
        
        # read file bytes
        file_bytes = await file.read()
        
        # extract text from PDF
        resume_text = read_pdf_bytes(file_bytes)
        
        if not resume_text or len(resume_text.strip()) == 0:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from PDF. The file may be corrupted or empty."
            )
        
        # convert to structured JSON using AI
        structured_json = jsonify_user_resume(resume_text)
        
        # parse JSON to validate it
        try:
            parsed_json = json.loads(structured_json)
        except json.JSONDecodeError:
            # if JSON parsing fails, return the raw text (might need manual parsing)
            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "raw_json": structured_json,
                    "message": "JSON extracted but may need validation"
                }
            )
        
        return {
            "success": True,
            "profile": parsed_json,
            "raw_text_length": len(resume_text)
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing resume: {str(e)}"
        )


@app.post("/match-scholarships")
async def match_scholarships(profile_json: str = Form(...)):
    """
    Match a user profile (JSON string) to available scholarships.
    
    - **profile_json**: JSON string of the user's structured profile
    """
    try:
        # parse the profile JSON
        try:
            profile = json.loads(profile_json)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=400,
                detail="Invalid JSON format for profile"
            )
        
        # get scholarship matches
        matches_json = scholarship_matching(profile_json)
        
        # parse the matches JSON
        try:
            matches = json.loads(matches_json)
        except json.JSONDecodeError:
            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "raw_json": matches_json,
                    "message": "Matches generated but may need validation"
                }
            )
        
        return {
            "success": True,
            "matches": matches
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error matching scholarships: {str(e)}"
        )


# scholarship Endpoints

@app.get("/scholarships")
async def get_scholarships():
    """Get all available scholarships"""
    try:
        scholarships = get_all_scholarships()
        return {
            "success": True,
            "count": len(scholarships),
            "scholarships": scholarships
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching scholarships: {str(e)}"
        )


@app.get("/scholarships/{scholarship_id}")
async def get_scholarship(scholarship_id: int):
    """Get a specific scholarship by ID"""
    try:
        scholarship = get_scholarship_by_id(scholarship_id)
        if not scholarship:
            raise HTTPException(
                status_code=404,
                detail=f"Scholarship with ID {scholarship_id} not found"
            )
        return {
            "success": True,
            "scholarship": scholarship
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching scholarship: {str(e)}"
        )


@app.post("/scholarships")
async def create_scholarship(
    title: str = Form(...),
    eligibility: str = Form(...),
    description: str = Form(...),
    essay_required: bool = Form(False),
    deadline: str = Form(...),
    link: str = Form(...)
):
    """
    Add a new scholarship to the database.
    
    - **title**: Scholarship title
    - **eligibility**: Eligibility requirements
    - **description**: Scholarship description
    - **essay_required**: Whether an essay is required (default: False)
    - **deadline**: Deadline date (YYYY-MM-DD format)
    - **link**: Application link
    """
    try:
        from datetime import datetime
        
        # Validate deadline format
        try:
            deadline_date = datetime.strptime(deadline, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid deadline format. Use YYYY-MM-DD"
            )
        
        scholarship = add_a_scholarship(
            title=title,
            eligibility=eligibility,
            description=description,
            essay_required=essay_required,
            deadline=deadline_date,
            link=link
        )
        
        return {
            "success": True,
            "scholarship": scholarship
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating scholarship: {str(e)}"
        )


# Favourites Endpoints

@app.post("/favourites")
async def save_favourite(
    user_id: str = Form(...),
    scholarship_id: int = Form(...)
):
    """
    Save a scholarship to a user's favorites.
    
    - **user_id**: User identifier
    - **scholarship_id**: Scholarship ID to save
    """
    try:
        result = save_a_scholarship(user_id, scholarship_id)
        return {
            "success": True,
            "favourite": result
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error saving favourite: {str(e)}"
        )


@app.get("/favourites/{user_id}")
async def get_favourites(user_id: str):
    """Get all favorites for a specific user"""
    try:
        favourites = get_user_favourites(user_id)
        return {
            "success": True,
            "count": len(favourites),
            "favourites": favourites
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching favourites: {str(e)}"
        )


@app.delete("/favourites/{user_id}/{scholarship_id}")
async def delete_favourite(user_id: str, scholarship_id: int):
    """Remove a scholarship from a user's favorites"""
    try:
        result = remove_favourite(user_id, scholarship_id)
        return {
            "success": True,
            "message": "Favourite removed successfully",
            "result": result
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error removing favourite: {str(e)}"
        )

@app.get("/deadlines/{user_id}")
async def get_deadlines(user_id: str):
    scholarships = get_user_scholarship_deadlines(user_id)

    results = []
    for entry in scholarships:
        s = entry["scholarships"]
        status = calculate_deadline_status(s["deadline"])

        results.append({
            "id": s["id"],
            "title": s["title"],
            "deadline": s["deadline"],
            "link": s["link"],
            "status": status["status"],
            "days_left": status["days_left"],
        })

    return results