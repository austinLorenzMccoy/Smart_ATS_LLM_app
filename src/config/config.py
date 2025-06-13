import os
from dotenv import load_dotenv

def load_config():
    """Load environment variables from .env file"""
    load_dotenv()
    return {
        "api_key": os.getenv("GOOGLE_API_KEY")
    }
