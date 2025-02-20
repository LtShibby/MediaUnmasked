#!/bin/bash

# Create cache directories
mkdir -p /tmp/transformers_cache
mkdir -p /tmp/huggingface

# Upgrade pip
python -m pip install --upgrade pip

# Install torch CPU only version first (minimal install)
python -m pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# Install transformers with minimal dependencies
python -m pip install --no-cache-dir transformers --no-deps

# Install other dependencies after torch
python -m pip install --no-cache-dir fastapi uvicorn pydantic beautifulsoup4 requests python-dotenv numpy

# Set environment variables for model caching
export TRANSFORMERS_CACHE="/tmp/transformers_cache"
export HF_HOME="/tmp/huggingface"
