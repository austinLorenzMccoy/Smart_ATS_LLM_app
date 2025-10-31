import pytest
from unittest.mock import MagicMock, patch
from src.utils.pdf_utils import extract_text_from_pdf

def test_extract_text_from_pdf():
    # Create a mock PDF file
    mock_file = MagicMock()
    
    # Create a mock PDF reader
    mock_page = MagicMock()
    mock_page.extract_text.return_value = "Sample text from PDF"
    
    mock_reader = MagicMock()
    mock_reader.pages = [mock_page, mock_page]  # Two pages
    
    # Patch the PdfReader to return our mock
    with patch('src.utils.pdf_utils.pdf.PdfReader', return_value=mock_reader):
        result = extract_text_from_pdf(mock_file)
        
        # Assert the result is as expected
        assert result == "Sample text from PDFSample text from PDF"
        assert len(result) > 0
