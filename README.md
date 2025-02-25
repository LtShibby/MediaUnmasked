# MediaUnmasked

MediaUnmasked is a web application designed to analyze and present media articles with a focus on maintaining the original formatting and providing insights into the content's bias, sentiment, and evidence-based reporting. The application leverages a React frontend with Material-UI for styling and a Python backend for data processing.

## Features

- **Article Analysis**: Analyze articles for bias, sentiment, and evidence-based reporting.
- **Content Formatting**: Preserve the original formatting of articles using markdown rendering.
- **Interactive UI**: A responsive and interactive user interface built with React and Material-UI.
- **Backend Processing**: A Python backend that processes article data and provides analysis results.

## Technologies Used

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Vite**: A build tool that provides a fast development environment.
- **Material-UI**: A popular React UI framework for building responsive and accessible web applications.
- **React Markdown**: A library for rendering markdown content in React components.

### Backend
- **Python**: A versatile programming language used for backend processing.
- **Flask**: A lightweight WSGI web application framework for Python.
- **Natural Language Processing (NLP)**: Techniques used to analyze and interpret article content.

## Installation

### Prerequisites
- Node.js and npm installed on your machine.
- Python 3.x installed on your machine.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Backend

The backend for MediaUnmasked is run through the [media-unmasked-api](https://github.com/LtShibby/media-unmasked-api) project, which is officially hosted on Hugging Face. 

For instructions on running the backend locally, please refer to the [project's README](https://github.com/LtShibby/media-unmasked-api/blob/main/README.md).


## Deployment

The project can be deployed using Vercel for the frontend and a suitable cloud provider for the backend. Ensure that environment variables and configurations are set correctly for production.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## About

MediaUnmasked is a product of [Wozwize](https://wozwize.com), dedicated to providing insightful analysis of media content.