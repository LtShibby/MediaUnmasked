#!/bin/bash

# Ensure we are using the correct Python version
python3 -m pip install --upgrade pip setuptools wheel

# Remove all cached dependencies to force a clean install
rm -rf /vercel/.cache/pip

# Uninstall conflicting packages to ensure fresh installation
pip uninstall -y fastapi pydantic uvicorn pydantic-core || true

# Force install dependencies without cache
pip install --no-cache-dir -r requirements.txt

# Ensure spaCy model is installed
python -m spacy download en_core_web_sm
