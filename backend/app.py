from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from datetime import datetime, timedelta
import logging
import cv2
import numpy as np
import base64
from emotion_detector import EmotionDetector

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='../frontend')
CORS(app)  # Enable CORS for all routes

# Initialize the emotion detector
emotion_detector = EmotionDetector()

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'database': 'wellsync_db',
    'user': 'root',
    'password': '',  # Set your password here
}

# Flag to determine if we're running in demo mode
DEMO_MODE = True

# Create database connection
def create_db_connection():
    global DEMO_MODE
    
    if DEMO_MODE:
        logger.info("Running in demo mode without database connection")
        return None
        
    try:
        import mysql.connector
        from mysql.connector import Error
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        logger.error(f"Database connection error: {e}")
        DEMO_MODE = True
        logger.info("Switching to demo mode due to database connection error")
    except ImportError:
        logger.error("MySQL connector module not available")
        DEMO_MODE = True
        logger.info("Switching to demo mode due to missing MySQL module")
    return None

# Initialize database
def init_database():
    global DEMO_MODE
    
    if DEMO_MODE:
        logger.info("Skipping database initialization in demo mode")
        return
        
    try:
        import mysql.connector
        from mysql.connector import Error
        connection = create_db_connection()
        if connection:
            cursor = connection.cursor()
            
            # Create tables if they don't exist
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            ''')
            
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS period_data (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                last_period_date DATE NOT NULL,
                cycle_length INT DEFAULT 28,
                period_length INT DEFAULT 5,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
            ''')
            
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS emotional_data (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                emotion VARCHAR(50) NOT NULL,
                detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
            ''')
            
            connection.commit()
            logger.info("Database initialized successfully")
            
            cursor.close()
            connection.close()
    except Error as e:
        logger.error(f"Database initialization error: {e}")
        DEMO_MODE = True
        logger.info("Switching to demo mode due to database initialization error")
    except ImportError:
        logger.error("MySQL connector module not available")
        DEMO_MODE = True
        logger.info("Switching to demo mode due to missing MySQL module")

# Serve frontend files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path == "" or not os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, 'index.html')
    return send_from_directory(app.static_folder, path)

# API Routes
@app.route('/api/period-data', methods=['POST'])
def save_period_data():
    data = request.json
    
    if DEMO_MODE:
        logger.info(f"Demo Mode: Simulating saving period data: {data}")
        return jsonify({"success": True, "demo": True})
    
    try:
        connection = create_db_connection()
        if connection:
            cursor = connection.cursor()
            
            # For simplicity, we're using user_id = 1 (demo purposes)
            # In a real app, you would authenticate users
            user_id = 1
            
            # Check if record exists for this user
            cursor.execute("SELECT id FROM period_data WHERE user_id = %s", (user_id,))
            result = cursor.fetchone()
            
            if result:
                # Update existing record
                cursor.execute("""
                UPDATE period_data 
                SET last_period_date = %s, cycle_length = %s, period_length = %s 
                WHERE user_id = %s
                """, (
                    data['lastPeriodDate'], 
                    data['cycleLength'], 
                    data['periodLength'], 
                    user_id
                ))
            else:
                # Create new record
                cursor.execute("""
                INSERT INTO period_data (user_id, last_period_date, cycle_length, period_length) 
                VALUES (%s, %s, %s, %s)
                """, (
                    user_id, 
                    data['lastPeriodDate'], 
                    data['cycleLength'], 
                    data['periodLength']
                ))
            
            connection.commit()
            cursor.close()
            connection.close()
            
            return jsonify({"success": True})
    except Exception as e:
        logger.error(f"Database error: {e}")
        return jsonify({"success": False, "error": str(e)})
    
    return jsonify({"success": False, "error": "Unknown error"})

@app.route('/api/period-data', methods=['GET'])
def get_period_data():
    if DEMO_MODE:
        logger.info("Demo Mode: Returning demo period data")
        # Return demo data
        return jsonify({
            "last_period_date": (datetime.now() - timedelta(days=14)).strftime('%Y-%m-%d'),
            "cycle_length": 28,
            "period_length": 5
        })
    
    try:
        connection = create_db_connection()
        if connection:
            cursor = connection.cursor(dictionary=True)
            
            # For simplicity, using user_id = 1 (demo purposes)
            user_id = 1
            
            cursor.execute("""
            SELECT last_period_date, cycle_length, period_length 
            FROM period_data 
            WHERE user_id = %s
            """, (user_id,))
            
            result = cursor.fetchone()
            cursor.close()
            connection.close()
            
            if result:
                # Format date for JSON
                result['last_period_date'] = result['last_period_date'].strftime('%Y-%m-%d')
                return jsonify(result)
            else:
                return jsonify({})
    except Exception as e:
        logger.error(f"Database error: {e}")
        return jsonify({"error": str(e)})
    
    return jsonify({"error": "Unknown error"})

@app.route('/api/emotion-data', methods=['POST'])
def save_emotion_data():
    data = request.json
    
    if DEMO_MODE:
        logger.info(f"Demo Mode: Simulating saving emotion data: {data}")
        return jsonify({"success": True, "demo": True})
    
    try:
        connection = create_db_connection()
        if connection:
            cursor = connection.cursor()
            
            # For simplicity, using user_id = 1 (demo purposes)
            user_id = 1
            
            cursor.execute("""
            INSERT INTO emotional_data (user_id, emotion) 
            VALUES (%s, %s)
            """, (user_id, data['emotion']))
            
            connection.commit()
            cursor.close()
            connection.close()
            
            return jsonify({"success": True})
    except Exception as e:
        logger.error(f"Database error: {e}")
        return jsonify({"success": False, "error": str(e)})
    
    return jsonify({"success": False, "error": "Unknown error"})

@app.route('/api/detect-emotion', methods=['POST'])
def detect_emotion():
    try:
        data = request.json
        
        # Get the base64 encoded image from the request
        image_data = data.get('image')
        if not image_data:
            return jsonify({"success": False, "error": "No image data provided"})
        
        # Remove the "data:image/jpeg;base64," part if present
        if "," in image_data:
            image_data = image_data.split(",")[1]
        
        # Decode the base64 string to image
        image_bytes = base64.b64decode(image_data)
        np_array = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        
        if image is None:
            return jsonify({"success": False, "error": "Failed to decode image"})
        
        # Process the image with the emotion detector
        processed_image, detected_emotion = emotion_detector.process_video_frame(image)
        
        if detected_emotion:
            # Convert the processed image back to base64 for response
            _, buffer = cv2.imencode('.jpg', processed_image)
            processed_image_base64 = base64.b64encode(buffer).decode('utf-8')
            
            # Save the detected emotion to the database if not in demo mode
            if not DEMO_MODE:
                save_emotion_result(detected_emotion)
            else:
                logger.info(f"Demo Mode: Detected emotion: {detected_emotion}")
            
            # Return the result
            return jsonify({
                "success": True,
                "emotion": detected_emotion,
                "processedImage": f"data:image/jpeg;base64,{processed_image_base64}"
            })
        else:
            return jsonify({"success": False, "error": "No emotion detected"})
    
    except Exception as e:
        logger.error(f"Error in emotion detection: {e}")
        return jsonify({"success": False, "error": str(e)})

def save_emotion_result(emotion):
    if DEMO_MODE:
        logger.info(f"Demo Mode: Simulating saving emotion: {emotion}")
        return
        
    try:
        connection = create_db_connection()
        if connection:
            cursor = connection.cursor()
            
            # For simplicity, using user_id = 1 (demo purposes)
            user_id = 1
            
            cursor.execute("""
            INSERT INTO emotional_data (user_id, emotion) 
            VALUES (%s, %s)
            """, (user_id, emotion))
            
            connection.commit()
            cursor.close()
            connection.close()
            logger.info(f"Emotion data saved: {emotion}")
    except Exception as e:
        logger.error(f"Database error when saving emotion: {e}")

@app.route('/api/calculate-cycle', methods=['POST'])
def calculate_cycle():
    data = request.json
    
    try:
        last_period_date = datetime.strptime(data['lastPeriodDate'], '%Y-%m-%d')
        cycle_length = int(data['cycleLength'])
        period_length = int(data['periodLength'])
        
        # Calculate next period
        next_period = last_period_date + timedelta(days=cycle_length)
        
        # Calculate ovulation day (typically 14 days before next period)
        ovulation_day = next_period - timedelta(days=14)
        
        # Calculate fertile window (5 days before ovulation + day of ovulation)
        fertile_start = ovulation_day - timedelta(days=5)
        fertile_end = ovulation_day
        
        # Calculate period end
        period_end = last_period_date + timedelta(days=period_length - 1)
        
        # Format dates for response
        result = {
            "nextPeriod": next_period.strftime('%Y-%m-%d'),
            "ovulationDay": ovulation_day.strftime('%Y-%m-%d'),
            "fertileWindow": {
                "start": fertile_start.strftime('%Y-%m-%d'),
                "end": fertile_end.strftime('%Y-%m-%d')
            },
            "periodEnd": period_end.strftime('%Y-%m-%d')
        }
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Calculation error: {e}")
        return jsonify({"error": str(e)})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "mode": "demo" if DEMO_MODE else "database"})

if __name__ == '__main__':
    # Initialize database on startup
    init_database()
    # Run app
    app.run(debug=True, host='0.0.0.0', port=8080) 