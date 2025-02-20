#!/bin/bash

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies with specific extra index for PyTorch
python -m pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Ensure transformers is installed
python -m pip install --no-cache-dir transformers

# Ensure NLTK downloads are stored in /tmp
mkdir -p /tmp/nltk_data
python -c "import nltk; nltk.data.path.append('/tmp/nltk_data'); nltk.download('punkt', download_dir='/tmp/nltk_data'); nltk.download('averaged_perceptron_tagger', download_dir='/tmp/nltk_data')"
