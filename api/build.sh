#!/bin/bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# Ensure transformers is installed
python -m pip install transformers

# Ensure NLTK downloads are stored in /tmp
mkdir -p /tmp/nltk_data
python3 -c "import nltk; nltk.data.path.append('/tmp/nltk_data'); nltk.download('punkt', download_dir='/tmp/nltk_data'); nltk.download('averaged_perceptron_tagger', download_dir='/tmp/nltk_data')"
