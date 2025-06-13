#!/bin/bash

# Exit on error
set -e

echo "Setting up Smart ATS environment..."

# Remove old environment if it exists
if [ -d "atsLLMapp2_env" ]; then
    echo "Removing old virtual environment..."
    rm -rf atsLLMapp2_env
fi

# Create a new virtual environment
echo "Creating new virtual environment..."
python3 -m venv atsLLMapp2_env

# Activate the virtual environment
echo "Activating virtual environment..."
source atsLLMapp2_env/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Install development dependencies
echo "Installing development dependencies..."
pip install pytest pytest-mock httpx

echo "Setup complete! To activate the environment, run:"
echo "source atsLLMapp2_env/bin/activate"
