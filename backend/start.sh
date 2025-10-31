#!/bin/bash
set -e

# Print environment information
echo "Current directory: $(pwd)"
echo "Python version before activation:"
python --version

# Activate the virtual environment if it exists
if [ -d ".venv" ]; then
    echo "Activating virtual environment"
    source .venv/bin/activate
    echo "Python version after activation:"
    python --version
fi

# Check for uvicorn directly
echo "Checking for uvicorn:"
which uvicorn || echo "uvicorn not found in PATH"

# Start the FastAPI application
echo "Starting FastAPI application..."
exec python -m uvicorn src.api.api:app --host 0.0.0.0 --port ${PORT:-8000}
