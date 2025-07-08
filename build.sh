#!/bin/bash
set -e

# Install dependencies with pip
pip install --upgrade pip
pip install wheel
pip install --no-build-isolation -r requirements.txt
