#!/bin/bash

# Create cache directories
mkdir -p /tmp/transformers_cache
mkdir -p /tmp/huggingface

# Upgrade pip
python -m pip install --upgrade pip

# Install torch CPU only version
python -m pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# Install other dependencies after torch
python -m pip install --no-cache-dir -r requirements.txt

# Set environment variables for model caching
export TRANSFORMERS_CACHE="/tmp/transformers_cache"
export HF_HOME="/tmp/huggingface"

# Ensure NLTK downloads are stored in /tmp
mkdir -p /tmp/nltk_data
python -c "import nltk; nltk.data.path.append('/tmp/nltk_data'); nltk.download('punkt', download_dir='/tmp/nltk_data')"
