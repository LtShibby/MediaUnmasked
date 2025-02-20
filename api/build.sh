#!/bin/bash

# Upgrade pip
python -m pip install --upgrade pip

# Install minimal dependencies first
python -m pip install --no-cache-dir -r requirements.txt

# Install torch CPU only version
python -m pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# Ensure NLTK downloads are stored in /tmp
mkdir -p /tmp/nltk_data
python -c "import nltk; nltk.data.path.append('/tmp/nltk_data'); nltk.download('punkt', download_dir='/tmp/nltk_data')"
