#!/bin/bash

# Exit on error
set -e

echo "Installing Python dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r api/requirements.txt

echo "Creating necessary directories..."
mkdir -p src/mediaunmasked/analyzers

echo "Setting up project structure..."
touch src/mediaunmasked/__init__.py
touch src/mediaunmasked/analyzers/__init__.py

echo "Build completed" 