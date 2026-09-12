# WellSync

**Your intelligent partner for better health.**

WellSync is a web platform that brings menstrual cycle tracking, emotion detection, neuroacoustic sound therapy, gesture controls, and stress-relief games into one place. A built-in help chatbot answers questions about how to use each feature.

The Flask backend serves the frontend and optional APIs. By default the app runs in **demo mode**, so you can try everything without MySQL.

---

## Features

| Feature | What it does |
| --- | --- |
| **SHE SYNC** | Track last period date, cycle length, and period length. Get phase predictions, calendar view, diet ideas, symptoms, and self-care tips. Irregular cycles can prompt a consultation from Contact. |
| **Emotion Tracker** | Use the camera to estimate mood and get matching wellness suggestions. |
| **Sound Therapy** | Play neuroacoustic frequency sessions (396–852 Hz) with a timer and volume controls. |
| **Hand Gestures** | Control playback and navigation with camera-based hand poses (TensorFlow.js HandPose). |
| **Stress Relief** | Short gesture games (shooter, balloon pop, ninja slice) for a quick mental break. |
| **Help Chatbot** | Floating helper in the bottom-right. Ask about trackers, therapy, games, or how to contact the team. |
| **Contact** | Send a message to the WellSync team. |

This is a wellness toolkit, not a medical device. It does not diagnose or treat conditions.

---

## Tech stack

- **Frontend:** HTML, CSS, JavaScript (Poppins, Font Awesome)
- **Frontend ML:** TensorFlow.js + `@tensorflow-models/handpose` (CDN)
- **Backend:** Python, Flask, Flask-CORS
- **Vision (server):** OpenCV, NumPy, TensorFlow
- **Database (optional):** MySQL — skipped when `DEMO_MODE` is `True`

---

## Project layout

```text
WellSync/
├── frontend/
│   ├── index.html          # App UI
│   ├── styles.css
│   ├── app.js              # UI logic, games, chatbot, API calls
│   └── chatbot-logo.svg    # Help chatbot logo
├── backend/
│   ├── app.py              # Flask server + API routes
│   ├── emotion_detector.py
│   └── requirements.txt
├── package.json
└── README.md
```

---

## Quick start (demo mode)

You do **not** need MySQL or Node.js to run a local demo.

**Requirements:** Python 3.8+

```bash
cd WellSync/backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open [http://localhost:8080](http://localhost:8080). Flask serves `frontend/` from this process.

If TensorFlow is heavy to install, you can still open `frontend/index.html` in a browser. Camera, sound, games, and the help chatbot work client-side. Period/emotion **API** calls need the Flask server.

### Frontend-only (static)

```bash
cd WellSync/frontend
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

API calls in `frontend/app.js` use `http://localhost:5000/api`. The Flask app listens on **8080**. If you run the backend, either:

- change `API_URL` in `app.js` to `http://localhost:8080/api`, or
- proxy/run Flask on port 5000.

Using the Flask-served page at port 8080 is the simplest path: same origin for static files; update `API_URL` so saves and emotion detection hit the same host.

---

## Optional: MySQL

Demo mode is on by default (`DEMO_MODE = True` in `backend/app.py`). Period and emotion records are logged, not persisted.

To persist data:

1. Install and start MySQL.
2. Create a database named `wellsync_db`.
3. Set `DB_CONFIG` in `app.py` (`host`, `user`, `password`).
4. Set `DEMO_MODE = False`.
5. Restart `python app.py`. Tables are created on startup if the connection succeeds. If MySQL is missing or fails, the app falls back to demo mode.

---

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Health check (`healthy` / `demo` vs `database`) |
| `POST` | `/api/period-data` | Save cycle data |
| `GET` | `/api/period-data` | Load cycle data |
| `POST` | `/api/calculate-cycle` | Compute next period / phase |
| `POST` | `/api/detect-emotion` | Detect emotion from an image |
| `POST` | `/api/emotion-data` | Save an emotion result |

Static pages are also served from `/` (files in `frontend/`).

---

## Using the app

1. Start Flask and open the site.
2. **Period Tracker** — enter last period start, cycle length, and period length, then Calculate.
3. **Emotion Tracker** — allow the camera and start tracking.
4. **Sound Therapy** — pick a frequency and play; use headphones if you can.
5. **Help** — click the teal helper in the bottom-right for how-to answers.

---

## Scripts

From the project root, `package.json` defines:

```bash
npm start    # python backend/app.py
npm run dev  # same
```

Node is not required for the app itself.

---

## License

MIT License (see `package.json`).

## Credits

- OpenCV and TensorFlow for vision and on-device hand tracking
- Research on sound frequency and vagus-nerve–oriented wellness practices (educational, not clinical claims)
