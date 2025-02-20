#!/bin/bash

# Upgrade pip
python -m pip install --upgrade pip

# Install minimal dependencies first
python -m pip install --no-cache-dir fastapi uvicorn pydantic beautifulsoup4 requests python-dotenv numpy

# Install ML dependencies with optimizations
python -m pip install --no-cache-dir torch --extra-index-url https://download.pytorch.org/whl/cpu
python -m pip install --no-cache-dir transformers[torch] --no-deps
python -m pip install --no-cache-dir textblob

# Ensure NLTK downloads are stored in /tmp
mkdir -p /tmp/nltk_data
python -c "import nltk; nltk.data.path.append('/tmp/nltk_data'); nltk.download('punkt', download_dir='/tmp/nltk_data'); nltk.download('averaged_perceptron_tagger', download_dir='/tmp/nltk_data')"
