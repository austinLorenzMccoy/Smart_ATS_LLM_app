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
    assert response.json() == {"message": "Welcome to Smart ATS API"}

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
        "JD Match": "85%",
        "MissingKeywords": ["python", "fastapi"],
        "Profile Summary": "Good candidate"
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
