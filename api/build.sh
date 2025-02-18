#!/bin/bash
set -e  # Exit on error

python -m pip install --no-cache-dir -r requirements.txt
# Ensure NLTK downloads are stored in /tmp
mkdir -p /tmp/nltk_data
python3 -c "import nltk; nltk.data.path.append('/tmp/nltk_data'); nltk.download('punkt', download_dir='/tmp/nltk_data'); nltk.download('averaged_perceptron_tagger', download_dir='/tmp/nltk_data')"
