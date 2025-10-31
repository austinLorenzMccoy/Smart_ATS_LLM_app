import pytest
from unittest.mock import patch, MagicMock
from src.models.gemini import configure_gemini, get_gemini_response

def test_configure_gemini():
    # Mock the genai.configure function
    with patch('src.models.gemini.genai.configure') as mock_configure:
        # Call our function
        configure_gemini("test_api_key")
        
        # Assert that genai.configure was called with the correct API key
        mock_configure.assert_called_once_with(api_key="test_api_key")

def test_get_gemini_response():
    # Create a mock response
    mock_response = MagicMock()
    mock_response.text = "This is a test response"
    
    # Mock the GenerativeModel and generate_content
    mock_model = MagicMock()
    mock_model.generate_content.return_value = mock_response
    
    # Patch the GenerativeModel to return our mock
    with patch('src.models.gemini.genai.GenerativeModel', return_value=mock_model):
        # Call our function
        result = get_gemini_response("Test prompt")
        
        # Assert the result is as expected
        assert result == "This is a test response"
        
        # Assert that generate_content was called with the correct prompt
        mock_model.generate_content.assert_called_once_with("Test prompt")
