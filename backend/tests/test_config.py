import pytest
from unittest.mock import patch, MagicMock
from src.config.config import load_config

def test_load_config():
    # Mock the load_dotenv function
    with patch('src.config.config.load_dotenv') as mock_load_dotenv:
        # Mock the os.getenv function to return a test API key
        with patch('src.config.config.os.getenv', return_value="test_api_key"):
            # Call our function
            config = load_config()
            
            # Assert that load_dotenv was called
            mock_load_dotenv.assert_called_once()
            
            # Assert that the config contains the expected API key
            assert config["api_key"] == "test_api_key"
