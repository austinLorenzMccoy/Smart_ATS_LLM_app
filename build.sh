#!/bin/bash
set -e

# Install dependencies with pip
pip install --upgrade pip
pip install wheel setuptools

# Force use of binary packages only, no source builds
pip install --only-binary=:all: -r requirements.txt
