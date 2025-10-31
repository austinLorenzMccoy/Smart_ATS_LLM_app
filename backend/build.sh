#!/bin/bash
set -e

# Print Python version information
echo "System Python version:"
python --version
echo "Python 3.8 availability:"
which python3.8 || echo "Python 3.8 not found in PATH"

# Ensure we're using Python 3.8
PYTHON_CMD="python3.8"

# Check if Python 3.8 is available
if command -v $PYTHON_CMD &> /dev/null; then
    echo "Using $PYTHON_CMD"
    # Create a virtual environment with Python 3.8
    $PYTHON_CMD -m venv .venv
    # Activate the virtual environment
    source .venv/bin/activate
else
    echo "$PYTHON_CMD not found, trying to install it"
    # Try to install Python 3.8 if not available (this works on some Linux distros)
    apt-get update && apt-get install -y python3.8 python3.8-venv || true
    
    # Check again if Python 3.8 is available after attempted install
    if command -v $PYTHON_CMD &> /dev/null; then
        echo "Successfully installed $PYTHON_CMD"
        $PYTHON_CMD -m venv .venv
        source .venv/bin/activate
    else
        echo "Could not install $PYTHON_CMD, falling back to system Python"
        # Create a virtual environment with system Python
        python -m venv .venv
        source .venv/bin/activate
    fi
fi

# Print the Python version being used
python --version

# Install dependencies with pip
pip install --upgrade pip
pip install wheel setuptools

# Force use of binary packages only, no source builds
pip install --only-binary=:all: -r requirements.txt
