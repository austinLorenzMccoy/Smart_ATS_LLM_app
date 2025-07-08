#!/bin/bash
set -e

# Ensure we're using Python 3.8
PYTHON_VERSION="3.8"

# Check if Python 3.8 is available
if command -v python$PYTHON_VERSION &> /dev/null; then
    echo "Using Python $PYTHON_VERSION"
    # Create a virtual environment with Python 3.8
    python$PYTHON_VERSION -m venv .venv
    # Activate the virtual environment
    source .venv/bin/activate
else
    echo "Python $PYTHON_VERSION not found, using system Python"
    # Create a virtual environment with system Python
    python -m venv .venv
    # Activate the virtual environment
    source .venv/bin/activate
fi

# Install dependencies with pip
pip install --upgrade pip
pip install wheel setuptools

# Force use of binary packages only, no source builds
pip install --only-binary=:all: -r requirements.txt
