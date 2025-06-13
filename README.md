<div align="center">

# 🚀 Austin's Smart ATS API

[![Python](https://img.shields.io/badge/Python-3.12%2B-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688)](https://fastapi.tiangolo.com/)
[![Google Generative AI](https://img.shields.io/badge/Google%20Generative%20AI-0.3.2-4285F4)](https://ai.google.dev/)
[![pytest](https://img.shields.io/badge/pytest-7.4.0-yellow)](https://docs.pytest.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

<img src="https://img.icons8.com/color/96/000000/resume.png" alt="Smart ATS Logo" width="120"/>

**Supercharge your job applications with AI-powered resume analysis API**

</div>

Austin's Smart ATS API is a powerful backend service designed to evaluate resumes against job descriptions using Google's Generative AI. The API simulates an Application Tracking System (ATS) and provides comprehensive insights into how well a resume aligns with a job description by analyzing keywords, content relevance, and generating tailored improvement recommendations.

## ✨ Features

- **Upload Resume:** Upload a PDF resume for analysis through the API
- **Job Description Matching:** Provide the job description to evaluate how well the resume aligns with the role
- **Keyword Matching:** The system identifies missing keywords crucial for optimizing the resume for ATS
- **Profile Summary:** Summarizes the key strengths of the resume and areas for improvement based on the job description
- **REST API:** FastAPI backend for easy integration with frontend applications
- **Modular Architecture:** Well-organized codebase for easy maintenance and extension
- **Comprehensive Documentation:** Interactive API documentation with Swagger UI

## 🛠️ Technologies Used

### Backend API
- **FastAPI**: High-performance API framework with automatic OpenAPI documentation
- **Uvicorn**: ASGI server for serving the FastAPI application
- **Pydantic**: Data validation and settings management
- **Python-Multipart**: Handling file uploads and form data

### AI & Processing
- **Google Generative AI**: Gemini 1.5 Flash model for intelligent resume analysis
- **PyPDF2**: PDF parsing and text extraction

### Development & Testing
- **pytest**: Comprehensive testing framework
- **pytest-mock**: Mocking framework for unit tests
- **httpx**: HTTP client for API testing
- **python-dotenv**: Environment variable management
- **Modular Architecture**: Clean separation of concerns with a well-structured codebase

## 🚀 Installation

### Prerequisites
Ensure you have Python 3.12+ installed on your machine. Then, clone the repository and set up the environment using the provided setup script.

1. Clone the repository:

   ```bash
   git clone https://github.com/austinLorenzMccoy/Smart_ATS_LLM_app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd -Smart_ATS_LLM_app
   ```

3. Run the setup script to create a virtual environment and install dependencies:

   ```bash
   chmod +x setup.sh  # Make the script executable if needed
   ./setup.sh
   ```

4. Activate the virtual environment:

   ```bash
   source atsLLMapp2_env/bin/activate  # On Windows: .\atsLLMapp2_env\Scripts\activate
   ```

### Environment Setup
Create a `.env` file in the project root directory and add your Google API key:

```bash
GOOGLE_API_KEY=your_google_api_key
```

### Running the API

To start the FastAPI server:

```bash
python api.py
```

The API will be available at `http://localhost:8000` with interactive documentation at `http://localhost:8000/docs`

## 📚 API Documentation

### Endpoints

#### GET /
- **Description**: Welcome endpoint
- **Response**: Simple welcome message
- **Example**:
  ```bash
  curl -X GET "http://localhost:8000/"
  ```

#### POST /analyze
- **Description**: Analyze a resume against a job description
- **Request**:
  - `job_description` (form field): The job description text
  - `resume` (file upload): The resume PDF file
- **Response**: JSON with the following fields:
  - `jd_match`: Percentage match with the job description
  - `missing_keywords`: List of keywords from the job description not found in the resume
  - `profile_summary`: Summary of the candidate's profile and suggestions
- **Example**:
  ```bash
  curl -X POST "http://localhost:8000/analyze" \
    -H "accept: application/json" \
    -F "job_description=Software Engineer with 5+ years of Python experience" \
    -F "resume=@/path/to/your/resume.pdf"
  ```

### Interactive Documentation

FastAPI provides interactive API documentation:

- **Swagger UI**: Visit `http://localhost:8000/docs` for an interactive interface to test the API
- **ReDoc**: Visit `http://localhost:8000/redoc` for alternative documentation

### Response Example

```json
{
  "jd_match": "85%",
  "missing_keywords": ["Docker", "Kubernetes", "CI/CD"],
  "profile_summary": "Strong Python developer with excellent backend experience. Consider adding more details about containerization and deployment experience."
}
```

## 💻 Usage

The API provides a RESTful interface for programmatic access to the resume analysis functionality. You can use tools like curl or any HTTP client to interact with the API.

### Example

```bash
# Check API status
curl -X GET "http://localhost:8000/"

# Analyze a resume
curl -X POST "http://localhost:8000/analyze" \
  -H "accept: application/json" \
  -F "job_description=Software Engineer with 5+ years of Python experience" \
  -F "resume=@/path/to/your/resume.pdf"
```

## Example

Here’s an example of how the app generates responses:

```
{
   "JD Match": "85%",
   "MissingKeywords": ["Python", "Data Science", "Machine Learning"],
   "Profile Summary": "The resume is strong in software engineering but lacks significant keywords related to data science..."
}
```

## 📚 Project Structure

```
.
├── api.py                  # API entry point for FastAPI backend
├── requirements.txt        # Project dependencies
├── setup.sh               # Environment setup script
├── pytest.ini             # Pytest configuration
├── .env                    # Environment variables (not in repo)
├── .gitignore              # Git ignore file
├── README.md               # Project documentation
├── src/                    # Source code directory
│   ├── __init__.py         # Package initialization
│   ├── api/                # API module
│   │   ├── __init__.py
│   │   └── api.py          # FastAPI implementation
│   ├── config/             # Configuration module
│   │   ├── __init__.py
│   │   └── config.py       # Environment and configuration management
│   ├── models/             # AI models module
│   │   ├── __init__.py
│   │   └── gemini.py       # Google Gemini AI integration
│   └── utils/              # Utilities module
│       ├── __init__.py
│       ├── pdf_utils.py    # PDF processing utilities
│       └── prompts.py      # AI prompt templates
└── tests/                  # Test directory
    ├── test_api.py         # API tests
    ├── test_config.py      # Configuration tests
    ├── test_gemini.py      # AI model tests
    ├── test_pdf_utils.py   # PDF utility tests
    └── test_prompts.py     # Prompt template tests
```

## 💯 Testing

The project includes comprehensive tests for all components. To run the tests:

```bash
# Activate the virtual environment if not already activated
source atsLLMapp2_env/bin/activate  # On Windows: .\atsLLMapp2_env\Scripts\activate

# Run all tests
python -m pytest

# Run tests with verbose output
python -m pytest -v

# Run specific test file
python -m pytest tests/test_api.py
```

The test suite covers:
- API endpoints functionality
- Configuration loading
- Google Gemini AI integration
- PDF text extraction
- Prompt template generation

To run tests with coverage report:

```bash
python -m pytest --cov=src tests/
```

## 📈 API Documentation

When the FastAPI server is running, you can access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔧 Environment Management

The project includes a `setup.sh` script that handles environment setup:

- Removes any existing virtual environment directory
- Creates a new Python virtual environment
- Installs all required dependencies from `requirements.txt`
- Installs additional development dependencies for testing

This ensures a clean, consistent environment for development and testing.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👏 Acknowledgements

Special thanks to:

- [Streamlit](https://streamlit.io/) for the interactive web UI framework
- [FastAPI](https://fastapi.tiangolo.com/) for the high-performance API framework
- [Google Generative AI](https://ai.google.dev/) for the powerful Gemini model
- [PyPDF2](https://pypdf2.readthedocs.io/) for PDF processing capabilities
- All the open-source contributors who make these tools possible

## 🔒 License

This project is licensed under the MIT License - see the LICENSE file for details.

