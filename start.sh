#!/bin/bash
set -e

# Start the FastAPI application
exec python -m uvicorn src.api.api:app --host 0.0.0.0 --port ${PORT:-8000}
