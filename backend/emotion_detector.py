import cv2
import numpy as np
import tensorflow as tf
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EmotionDetector:
    def __init__(self):
        self.emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
        
        # Load face cascade for face detection
        try:
            self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            logger.info("Face detection model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load face detection model: {e}")
            self.face_cascade = None
        
        # In a production scenario, we would load a pre-trained emotion detection model
        # For this example, we'll create a dummy model
        self.model = self._create_dummy_model()
        logger.info("Emotion detection model initialized")

    def _create_dummy_model(self):
        """Create a simple CNN model for demonstration purposes"""
        try:
            model = tf.keras.Sequential([
                tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(48, 48, 1)),
                tf.keras.layers.MaxPooling2D((2, 2)),
                tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
                tf.keras.layers.MaxPooling2D((2, 2)),
                tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
                tf.keras.layers.MaxPooling2D((2, 2)),
                tf.keras.layers.Flatten(),
                tf.keras.layers.Dense(128, activation='relu'),
                tf.keras.layers.Dropout(0.5),
                tf.keras.layers.Dense(7, activation='softmax')  # 7 emotions
            ])
            
            # In a real scenario, we would load pre-trained weights
            # model.load_weights('path_to_weights.h5')
            
            return model
        except Exception as e:
            logger.error(f"Failed to create dummy model: {e}")
            return None

    def preprocess_image(self, image):
        """Preprocess the image for the model"""
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Detect faces
            faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
            
            if len(faces) > 0:
                # Get the largest face
                face = max(faces, key=lambda x: x[2] * x[3])
                x, y, w, h = face
                
                # Extract face ROI
                face_roi = gray[y:y+h, x:x+w]
                
                # Resize to 48x48 pixels (standard for emotion detection models)
                face_roi = cv2.resize(face_roi, (48, 48))
                
                # Normalize
                face_roi = face_roi / 255.0
                
                # Reshape for model input
                face_roi = np.reshape(face_roi, (1, 48, 48, 1))
                
                return face_roi, (x, y, w, h)
            else:
                logger.warning("No face detected in the image")
                return None, None
        except Exception as e:
            logger.error(f"Error preprocessing image: {e}")
            return None, None

    def detect_emotion(self, image):
        """Detect emotion in the given image"""
        try:
            if self.face_cascade is None or self.model is None:
                return None, None
            
            # Preprocess the image
            preprocessed_face, face_coords = self.preprocess_image(image)
            
            if preprocessed_face is None:
                return None, None
            
            # In a real scenario, we would use the model to predict
            # pred = self.model.predict(preprocessed_face)[0]
            # emotion = self.emotions[np.argmax(pred)]
            
            # For demonstration, return a random emotion
            emotion = np.random.choice(self.emotions)
            
            return emotion, face_coords
            
        except Exception as e:
            logger.error(f"Error detecting emotion: {e}")
            return None, None
    
    def draw_emotion(self, image, emotion, face_coords):
        """Draw the detected emotion on the image"""
        try:
            if emotion is None or face_coords is None:
                return image
            
            x, y, w, h = face_coords
            
            # Draw rectangle around face
            cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)
            
            # Add text with emotion
            cv2.putText(image, emotion, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
            
            return image
        except Exception as e:
            logger.error(f"Error drawing emotion on image: {e}")
            return image
    
    def process_video_frame(self, frame):
        """Process a video frame and return emotion detection result"""
        try:
            # Detect emotion
            emotion, face_coords = self.detect_emotion(frame)
            
            # Draw on frame
            if emotion and face_coords:
                frame = self.draw_emotion(frame, emotion, face_coords)
                return frame, emotion
            else:
                return frame, None
        except Exception as e:
            logger.error(f"Error processing video frame: {e}")
            return frame, None

# For testing
if __name__ == "__main__":
    detector = EmotionDetector()
    
    # Try with a test image or webcam
    # cap = cv2.VideoCapture(0)
    # ret, frame = cap.read()
    # if ret:
    #     frame, emotion = detector.process_video_frame(frame)
    #     print(f"Detected emotion: {emotion}")
    #     cv2.imshow('Emotion Detection', frame)
    #     cv2.waitKey(0)
    # cap.release()
    # cv2.destroyAllWindows() 