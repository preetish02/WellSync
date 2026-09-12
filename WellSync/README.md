# WellSync - AI-Powered Health & Wellness Platform

WellSync is a comprehensive AI-powered health and wellness web platform that integrates mental health support, menstrual cycle tracking, emotion-based monitoring, and neuroacoustic therapy.

## Features

- **AI Mental Health Support**: Personalized stress-relief suggestions from emotion tracking and wellness tools
- **SHE SYNC**: Accurate menstrual cycle tracking with doctor consultation options
- **Emotion Detection**: Facial recognition technology to detect emotions and suggest personalized wellness solutions
- **Neuroacoustic Therapy**: Sound-based therapy with vagus nerve stimulation for mental wellness

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript with modern UI/UX design
- **Backend**: Python with Flask framework
- **Database**: MySQL for data storage
- **AI Components**: 
  - OpenCV and TensorFlow for emotion detection

## Setup Instructions

### Prerequisites

- Python 3.8+
- MySQL Server
- Node.js (optional for development)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd wellsync/backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Configure the database:
   - Open `app.py` and update the database configuration
   - Create a database in MySQL named `wellsync_db`

6. Run the backend server:
   ```
   python app.py
   ```
   The server will be available at http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd wellsync/frontend
   ```

2. The frontend is built with static HTML, CSS, and JavaScript, so you can simply open `index.html` in a browser.

3. For development, you can use any local server such as Python's built-in HTTP server:
   ```
   python -m http.server
   ```
   The frontend will be available at http://localhost:8000

### Connecting Frontend to Backend

- The frontend is configured to connect to the backend at `http://localhost:5000`
- If you change the backend URL or port, update the API URLs in `app.js`

## Usage

1. Open the WellSync application in your browser
2. Use the navigation to explore different features:
   - **SHE SYNC**: Enter your last period date and cycle details to get predictions
   - **Emotional Wellness**: Use the face tracking to detect your emotions
   - **Neuroacoustic Therapy**: Listen to different frequency therapies based on your emotional state

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenCV and TensorFlow communities for computer vision capabilities
- Scientific research on neuroacoustic therapy and vagus nerve stimulation
