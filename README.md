# Project Name

This project consists of a server (Django) and a client (React) that work together to provide a full-stack web application.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (for the client-side React application)
- [Python 3.x](https://www.python.org/downloads/) (for the server-side Django application)
- [pip](https://pip.pypa.io/en/stable/) (Python package installer)
- [npm](https://www.npmjs.com/) (Node package manager)
- [virtualenv](https://virtualenv.pypa.io/en/latest/) (for creating a virtual environment for Python)

## Setup

### 1. Setup the Server (Django)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create and activate the virtual environment:
   * On Windows:
     ```bash
     venv\Scripts\activate
     ```
   * On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Django server:
   ```bash
   python manage.py runserver
   ```
   The Django server should now be running at http://127.0.0.1:8000.

### 2. Setup the Client (React)

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install the required Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The React client should now be running at http://localhost:3000.

## Running Both Servers

Once both the server and client are running, the Django API should be accessible at `http://127.0.0.1:8000` (or another port if configured differently), and the React client will be running at `http://localhost:3000`.

## Additional Notes

- Make sure you have set up the database for Django (e.g., using `python manage.py migrate`).
- You can stop the servers by pressing `Ctrl+C` in each terminal window.