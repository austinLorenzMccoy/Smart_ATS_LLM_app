#!/usr/bin/env python3
"""
API Demo Script for AI Career Copilot
Demonstrates all available endpoints with sample requests
"""

import json
import requests
from pathlib import Path

# Base URL - update if running on different host/port
BASE_URL = "http://localhost:8000"


def print_section(title: str):
    """Print a formatted section header."""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80 + "\n")


def make_request(method: str, endpoint: str, **kwargs):
    """Make HTTP request and display results."""
    url = f"{BASE_URL}{endpoint}"
    print(f"→ {method.upper()} {endpoint}")
    
    try:
        if method.lower() == "get":
            response = requests.get(url, **kwargs)
        elif method.lower() == "post":
            response = requests.post(url, **kwargs)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        print(f"Status: {response.status_code}")
        
        if response.ok:
            try:
                data = response.json()
                print(f"Response:\n{json.dumps(data, indent=2)}\n")
            except json.JSONDecodeError:
                print(f"Response: {response.text}\n")
        else:
            print(f"Error: {response.text}\n")
        
        return response
    
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Could not connect to API. Make sure the server is running.")
        print("   Start the server with: uvicorn src.api.api:app --reload\n")
        return None
    except Exception as e:
        print(f"❌ ERROR: {e}\n")
        return None


def demo_root():
    """Test root endpoint."""
    print_section("1. Root Endpoint")
    make_request("GET", "/")


def demo_analyze_resume():
    """Test legacy ATS analysis endpoint."""
    print_section("2. Legacy ATS Analysis (File Upload)")
    
    # Create a sample PDF file for testing
    sample_resume = Path("sample_resume.pdf")
    if not sample_resume.exists():
        print("⚠️  Note: sample_resume.pdf not found. Skipping file upload test.")
        print("   Create a sample PDF resume to test this endpoint.\n")
        return
    
    with open(sample_resume, "rb") as f:
        files = {"resume": ("resume.pdf", f, "application/pdf")}
        data = {"job_description": "Looking for a Python developer with FastAPI experience"}
        make_request("POST", "/analyze", files=files, data=data)


def demo_resume_rewrite():
    """Test resume rewriting endpoint."""
    print_section("3. Resume Rewrite")
    
    payload = {
        "resume_text": "Software Engineer with 3 years experience in Python and web development.",
        "job_description": "Senior Python Developer needed for AI/ML projects. Must have FastAPI experience.",
        "tone": "Professional",
        "focus_role": "Senior Python Developer"
    }
    
    make_request("POST", "/resume/rewrite", json=payload)


def demo_skill_gap():
    """Test skill gap analysis."""
    print_section("4. Skill Gap Analysis")
    
    payload = {
        "resume_text": "Junior developer with HTML, CSS, JavaScript experience.",
        "job_description": "Full-stack developer needed. React, Node.js, Docker, AWS required."
    }
    
    make_request("POST", "/resume/skill-gap", json=payload)


def demo_achievements():
    """Test achievement quantification."""
    print_section("5. Achievement Quantification")
    
    payload = {
        "resume_text": "Led team projects. Improved system performance. Reduced bugs."
    }
    
    make_request("POST", "/resume/achievements", json=payload)


def demo_role_fit():
    """Test role fit scoring."""
    print_section("6. Role Fit Assessment")
    
    payload = {
        "resume_text": "Data Scientist with 5 years experience in Python, ML, and statistical analysis.",
        "job_description": "Senior Data Scientist role requiring Python, TensorFlow, and cloud experience."
    }
    
    make_request("POST", "/resume/role-fit", json=payload)


def demo_cover_letter():
    """Test cover letter generation."""
    print_section("7. Cover Letter Generation")
    
    payload = {
        "resume_text": "Software Engineer specializing in backend development.",
        "job_description": "Backend Engineer position at innovative startup.",
        "applicant_context": {
            "name": "John Doe",
            "years_experience": "5",
            "motivation": "Passionate about scalable systems"
        }
    }
    
    make_request("POST", "/resume/cover-letter", json=payload)


def demo_career_coach():
    """Test career coaching chatbot."""
    print_section("8. Career Coach (Conversational AI)")
    
    payload = {
        "message_history": [
            {"role": "user", "content": "I want to transition from web development to data science."},
            {"role": "assistant", "content": "That's a great goal! What's your current skill level in Python and statistics?"},
            {"role": "user", "content": "I'm comfortable with Python but new to statistics."}
        ]
    }
    
    make_request("POST", "/career/coach", json=payload)


def demo_career_path():
    """Test career path prediction."""
    print_section("9. Career Path Prediction")
    
    payload = {
        "resume_text": "Mid-level Software Engineer with 4 years experience in Python and cloud technologies."
    }
    
    make_request("POST", "/career/path", json=payload)


def demo_job_market():
    """Test job market insights."""
    print_section("10. Job Market Insights")
    
    payload = {
        "target_role": "Machine Learning Engineer",
        "location": "San Francisco, CA"
    }
    
    make_request("POST", "/career/job-market", json=payload)


def demo_job_parser():
    """Test job description parser."""
    print_section("11. Job Description Parser")
    
    payload = {
        "resume_text": "",  # Not used for parsing
        "job_description": """
        Senior Software Engineer
        
        Company: TechCorp Inc.
        Location: Remote
        
        Responsibilities:
        - Design and implement scalable backend systems
        - Mentor junior developers
        - Collaborate with product team
        
        Requirements:
        - 5+ years Python experience
        - FastAPI, Docker, AWS
        - Strong communication skills
        """
    }
    
    make_request("POST", "/jobs/parse", json=payload)


def demo_ats_check():
    """Test ATS compatibility checker."""
    print_section("12. ATS Compatibility Check")
    
    payload = {
        "resume_text": "Software Engineer with Python, FastAPI, Docker experience.",
        "job_description": "Looking for Python developer with cloud experience."
    }
    
    make_request("POST", "/jobs/ats-check", json=payload)


def demo_one_click_optimize():
    """Test one-click optimization."""
    print_section("13. One-Click Resume Optimization")
    
    payload = {
        "resume_text": "Developer with programming skills.",
        "job_description": "Python Developer needed for AI projects. FastAPI, TensorFlow required."
    }
    
    make_request("POST", "/jobs/one-click-optimize", json=payload)


def demo_job_alerts():
    """Test AI job alerts."""
    print_section("14. AI Job Alerts")
    
    payload = {
        "resume_text": "Data Scientist with Python, ML, and cloud experience.",
        "target_role": "Senior Data Scientist",
        "location": "New York, NY"
    }
    
    make_request("POST", "/jobs/alerts", json=payload)


def demo_visualizations():
    """Test visualization data generation."""
    print_section("15. Visualization Data (Skill Heatmap, Keyword Cloud)")
    
    payload = {
        "resume_text": "Python developer with FastAPI, Docker, AWS experience.",
        "job_description": "Senior Python Engineer. FastAPI, Kubernetes, GCP required."
    }
    
    make_request("POST", "/visualizations/summary", json=payload)


def demo_recruiter_bulk():
    """Test recruiter bulk screening."""
    print_section("16. Recruiter Bulk Resume Screening")
    
    payload = {
        "resumes": [
            "Software Engineer with 3 years Python experience.",
            "Data Scientist with ML and statistics background.",
            "Junior developer learning Python and web development."
        ],
        "job_description": "Mid-level Python Developer for backend systems."
    }
    
    make_request("POST", "/recruiter/bulk-score", json=payload)


def demo_interview_readiness():
    """Test interview preparation."""
    print_section("17. Interview Readiness Report")
    
    payload = {
        "resume_text": "Software Engineer with Python and cloud experience.",
        "job_description": "Backend Engineer role requiring Python, AWS, and system design skills."
    }
    
    make_request("POST", "/interview/readiness", json=payload)


def demo_salary_benchmark():
    """Test salary benchmarking."""
    print_section("18. Salary Benchmarking")
    
    payload = {
        "role": "Senior Software Engineer",
        "location": "Seattle, WA",
        "experience_years": 7.5
    }
    
    make_request("POST", "/salary/benchmark", json=payload)


def demo_portfolio():
    """Test portfolio generation."""
    print_section("19. Career Portfolio Generator")
    
    payload = {
        "resume_text": "Full-stack developer with multiple successful projects in e-commerce and fintech."
    }
    
    make_request("POST", "/portfolio/generate", json=payload)


def demo_career_progress_tracker():
    """Test career progress tracker."""
    print_section("20. Career Progress Tracker")
    
    payload = {
        "resume_text": "Software Engineer with 3 years experience in Python and web development.",
        "certifications": [
            "AWS Certified Solutions Architect",
            "Google Cloud Professional",
            "Certified Kubernetes Administrator"
        ],
        "skills_acquired": [
            "Docker",
            "Kubernetes",
            "FastAPI",
            "React",
            "PostgreSQL"
        ],
        "job_applications": [
            {"company": "TechCorp", "role": "Senior Backend Engineer", "status": "interview"},
            {"company": "StartupXYZ", "role": "Full Stack Developer", "status": "offer"},
            {"company": "BigTech Inc", "role": "Software Engineer", "status": "rejected"}
        ]
    }
    
    make_request("POST", "/career/progress-tracker", json=payload)


def main():
    """Run all demo requests."""
    print("\n" + "🚀" * 40)
    print("  AI Career Copilot API Demo")
    print("🚀" * 40)
    
    # Test basic endpoints
    demo_root()
    
    # Resume intelligence endpoints
    demo_analyze_resume()
    demo_resume_rewrite()
    demo_skill_gap()
    demo_achievements()
    demo_role_fit()
    demo_cover_letter()
    
    # Career guidance endpoints
    demo_career_coach()
    demo_career_path()
    demo_job_market()
    
    # Job search endpoints
    demo_job_parser()
    demo_ats_check()
    demo_one_click_optimize()
    demo_job_alerts()
    
    # Analytics and visualization
    demo_visualizations()
    demo_recruiter_bulk()
    
    # Additional features
    demo_interview_readiness()
    demo_salary_benchmark()
    demo_portfolio()
    demo_career_progress_tracker()
    
    print_section("Demo Complete!")
    print("✅ All endpoint demonstrations finished.\n")
    print("📝 Note: Actual AI responses require a running server with valid GOOGLE_API_KEY")
    print("   Start server: uvicorn src.api.api:app --reload")
    print("   Then run: python api_demo.py\n")


if __name__ == "__main__":
    main()
