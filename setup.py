from setuptools import setup, find_packages

setup(
    name="mediaunmasked",
    version="0.1.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    python_requires=">=3.8",
    author="Your Name",
    author_email="your.email@example.com",
    description="AI-powered media watchdog for analyzing bias and fact-checking",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://https://github.com/LtShibby/MediaUnmasked",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
    ],
) 