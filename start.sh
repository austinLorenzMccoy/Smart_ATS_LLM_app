#!/bin/bash
set -e

# Activate the virtual environment if it exists
if [ -d ".venv" ]; then
    echo "Activating virtual environment"
    source .venv/bin/activate
fi

# Start the FastAPI application
exec python -m uvicorn src.api.api:app --host 0.0.0.0 --port ${PORT:-8000}
