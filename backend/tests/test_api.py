import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import io
import json

from src.api.api import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to AI Career Copilot API"}

@pytest.fixture
def mock_pdf_file():
    return io.BytesIO(b"fake pdf content")

@patch("src.api.api.extract_text_from_pdf")
@patch("src.api.api.get_gemini_response")
def test_analyze_endpoint(mock_get_response, mock_extract_text, mock_pdf_file):
    # Mock the PDF text extraction
    mock_extract_text.return_value = "Sample resume text"
    
    # Mock the Gemini response
    mock_response = json.dumps({
        "jd_match": "85%",
        "missing_keywords": ["python", "fastapi"],
        "profile_summary": "Good candidate"
    })
    mock_get_response.return_value = mock_response
    
    # Create test data
    job_description = "Looking for a Python developer"
    
    # Make the request
    response = client.post(
        "/analyze",
        files={"resume": ("resume.pdf", mock_pdf_file, "application/pdf")},
        data={"job_description": job_description}
    )
    
    # Check the response
    assert response.status_code == 200
    assert response.json() == {
        "jd_match": "85%",
        "missing_keywords": ["python", "fastapi"],
        "profile_summary": "Good candidate"
    }
    
    # Verify the mocks were called
    mock_extract_text.assert_called_once()
    mock_get_response.assert_called_once()


@patch("src.api.api.prompts.get_resume_rewrite_prompt")
@patch("src.api.api.get_gemini_response")
def test_resume_rewrite_endpoint(mock_get_response, mock_prompt):
    mock_prompt.return_value = "prompt"
    mock_get_response.return_value = json.dumps({
        "rewritten_resume": "Updated resume",
        "key_adjustments": ["Added metrics"],
        "keyword_alignment_score": "92%"
    })

    payload = {
        "resume_text": "Original resume",
        "job_description": "JD",
        "tone": "Friendly",
        "focus_role": "Data Scientist"
    }

    response = client.post("/resume/rewrite", json=payload)

    assert response.status_code == 200
    assert response.json()["rewritten_resume"] == "Updated resume"
    mock_prompt.assert_called_once()
    mock_get_response.assert_called_once_with("prompt")


@patch("src.api.api.prompts.get_job_market_prompt")
@patch("src.api.api.get_gemini_response")
def test_job_market_endpoint(mock_get_response, mock_prompt):
    mock_prompt.return_value = "prompt"
    mock_get_response.return_value = json.dumps({
        "demand_level": "High",
        "top_skills": ["Python"],
        "emerging_roles": ["AI Strategist"],
        "market_commentary": "Growing demand"
    })

    payload = {"target_role": "ML Engineer", "location": "Remote"}
    response = client.post("/career/job-market", json=payload)

    assert response.status_code == 200
    body = response.json()
    assert body["demand_level"] == "High"
    mock_prompt.assert_called_once_with("ML Engineer", "Remote")
    mock_get_response.assert_called_once_with("prompt")
