#!/bin/bash
set -e  # Exit on error

python -m pip install --no-cache-dir -r requirements.txt
python3 -c "import nltk; nltk.download('punkt'); nltk.download('averaged_perceptron_tagger')"
