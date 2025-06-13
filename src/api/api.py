from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import io
import uvicorn
from typing import Optional
import json

from src.utils.pdf_utils import extract_text_from_pdf
from src.utils.prompts import get_ats_evaluation_prompt
from src.models.gemini import configure_gemini, get_gemini_response
from src.config.config import load_config

# Initialize FastAPI app
app = FastAPI(
    title="Smart ATS API",
    description="API for resume analysis against job descriptions",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load configuration
config = load_config()
configure_gemini(config["api_key"])

# Define response models
class ATSResponse(BaseModel):
    jd_match: str
    missing_keywords: list[str]
    profile_summary: str

@app.get("/")
async def root():
    return {"message": "Welcome to Smart ATS API"}

@app.post("/analyze", response_model=ATSResponse)
async def analyze_resume(
    job_description: str = Form(...),
    resume: UploadFile = File(...),
):
    """
    Analyze a resume against a job description
    
    - **job_description**: The job description text
    - **resume**: The resume file (PDF)
    
    Returns an analysis of the resume against the job description
    """
    try:
        # Read the PDF file
        contents = await resume.read()
        pdf_file = io.BytesIO(contents)
        
        # Extract text from PDF
        resume_text = extract_text_from_pdf(pdf_file)
        
        # Generate prompt
        prompt = get_ats_evaluation_prompt(resume_text, job_description)
        
        # Get response from Gemini
        response_text = get_gemini_response(prompt)
        
        # Parse the response
        try:
            # The response is expected to be a JSON string
            response_json = json.loads(response_text)
            
            # Extract the required fields
            return ATSResponse(
                jd_match=response_json.get("JD Match", "0%"),
                missing_keywords=response_json.get("MissingKeywords", []),
                profile_summary=response_json.get("Profile Summary", "")
            )
        except json.JSONDecodeError:
            # If the response is not valid JSON, return it as is
            raise HTTPException(
                status_code=500, 
                detail="Failed to parse model response"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def start():
    """Run the API server"""
    uvicorn.run("src.api.api:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    start()
