import pytest
from src.utils.prompts import get_ats_evaluation_prompt

def test_get_ats_evaluation_prompt():
    # Test data
    resume_text = "Python developer with 5 years experience"
    job_description = "Looking for Python developer"
    
    # Get the prompt
    prompt = get_ats_evaluation_prompt(resume_text, job_description)
    
    # Assert that the prompt contains the test data
    assert resume_text in prompt
    assert job_description in prompt
    
    # Assert that the prompt contains the required structure
    assert "JD Match" in prompt
    assert "MissingKeywords" in prompt
    assert "Profile Summary" in prompt
