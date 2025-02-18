#!/bin/bash

# Install the Python package in development mode
python -m pip install -e .

# Install other dependencies
python -m pip install "fastapi[all]" uvicorn 