// API Configuration
const API_URL = 'http://localhost:5000/api';

// Initialize audio context for the entire site
function initAudioContext() {
    // Create global audio context if it doesn't exist
    if (!window.globalAudioContext) {
        try {
            window.globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log("Global audio context initialized successfully");
        } catch (e) {
            console.error("Failed to create audio context:", e);
        }
    } else if (window.globalAudioContext.state === 'suspended') {
        window.globalAudioContext.resume().then(() => {
            console.log("Global audio context resumed");
        }).catch(e => {
            console.error("Failed to resume audio context:", e);
        });
    }
}

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize audio context
    initAudioContext();
    
    // Add click handler to resume audio context on user interaction
    document.addEventListener('click', function() {
        initAudioContext();
    }, { once: false });

    // Initialize the bot connection
    initAPIConnections();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize fade-in elements
    initFadeInElements();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize period tracker
    initPeriodTracker();
    
    // Initialize emotion tracking
    initEmotionTracking();
    
    // Initialize neuroacoustic therapy
    initNeuroacousticTherapy();
    
    // Initialize hand gesture tracking
    initHandGestureTracking();
    
    // Initialize stress relief games
    initStressReliefGames();
    
    // Initialize health insights tabs
    initHealthInsightsTabs();
    
    // Initialize phase tabs
    initPhaseTabs();
    
    // Initialize background music
    initBackgroundMusic();
    
    // Initialize appointment popup
    initAppointmentPopup();
    
    // Initialize help chatbot
    initHelpChatbot();
    
    // Load period data from API
    loadPeriodDataFromAPI();
    
    // New initializations
    initStatisticsCounters();
});

// Initialize API connections
function initAPIConnections() {
    // Check if backend is available
    fetch(`${API_URL}/health`)
        .then(response => response.json())
        .then(data => {
            console.log('Backend connection:', data.status);
            // If connected, load any saved data
            if (data.status === 'healthy') {
                loadPeriodDataFromAPI();
            }
        })
        .catch(error => {
            console.error('Backend connection error:', error);
            // Fall back to localStorage if API is not available
            loadSavedPeriodData();
        });
}

// Load period data from API
function loadPeriodDataFromAPI() {
    fetch(`${API_URL}/period-data`)
        .then(response => response.json())
        .then(data => {
            if (data && data.last_period_date) {
                // Populate form with API data
                if (document.getElementById('last-period-date')) {
                    document.getElementById('last-period-date').value = data.last_period_date;
                }
                if (document.getElementById('cycle-length')) {
                    document.getElementById('cycle-length').value = data.cycle_length;
                }
                if (document.getElementById('period-length')) {
                    document.getElementById('period-length').value = data.period_length;
                }
                
                // Calculate predictions
                const lastPeriodDate = new Date(data.last_period_date);
                const cycleLength = parseInt(data.cycle_length) || 28;
                const periodLength = parseInt(data.period_length) || 5;
                
                const nextPeriod = calculateNextPeriod(lastPeriodDate, cycleLength);
                const fertileWindow = calculateFertileWindow(nextPeriod, cycleLength);
                const ovulationDay = calculateOvulationDay(nextPeriod, cycleLength);
                
                updatePeriodPredictions(nextPeriod, fertileWindow, ovulationDay, periodLength);
                
                // Initialize calendar with period data
                initPeriodCalendar(lastPeriodDate, cycleLength, periodLength);
            }
        })
        .catch(error => {
            console.error('Error loading period data from API:', error);
            // Fall back to localStorage
            loadSavedPeriodData();
        });
}

// Initialize scroll effects
function initScrollEffects() {
    const header = document.querySelector('header');
    const logo = document.querySelector('.logo');
    const sections = document.querySelectorAll('section[id]');
    
    // Add scrolled class to header when scrolling
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Add scrolled class to header
        if (scrollPosition > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Highlight active navigation item based on scroll position
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                document.querySelectorAll('nav ul li a').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to the current section's link
                const activeLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
    
    // Scroll to section when clicking navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only process hashtag links that point to sections
            if (targetId.startsWith('#') && document.querySelector(targetId)) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                const headerHeight = document.querySelector('header').offsetHeight;
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                    
                    // Update active class in navigation
                    document.querySelectorAll('nav ul li a').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
        });
    });
    
    console.log("Scroll effects initialized");
}

// Fade in elements on scroll
function initFadeInElements() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });
    
    fadeElements.forEach(element => {
        fadeInObserver.observe(element);
    });
}

// Initialize mobile menu
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            const isOpen = mainNav.classList.contains('open');
            menuToggle.innerHTML = isOpen ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when a link is clicked
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        console.log("Mobile menu initialized");
    } else {
        console.warn("Mobile menu elements not found");
    }
}

// Period Tracker functionality
function initPeriodTracker() {
    const trackerForm = document.getElementById('cycle-tracker-form');
    
    if (trackerForm) {
        trackerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const lastPeriodDate = new Date(document.getElementById('last-period-date').value);
            const cycleLength = parseInt(document.getElementById('cycle-length').value) || 28;
            const periodLength = parseInt(document.getElementById('period-length').value) || 5;
            
            // Save data to API
            savePeriodDataToAPI({
                lastPeriodDate: document.getElementById('last-period-date').value,
                cycleLength: cycleLength,
                periodLength: periodLength
            });
            
            // Calculate next period and fertile window
            const nextPeriod = calculateNextPeriod(lastPeriodDate, cycleLength);
            const fertileWindow = calculateFertileWindow(nextPeriod, cycleLength);
            const ovulationDay = calculateOvulationDay(nextPeriod, cycleLength);
            
            // Display results
            updatePeriodPredictions(nextPeriod, fertileWindow, ovulationDay, periodLength);
            
            // Update calendar with new data
            initPeriodCalendar(lastPeriodDate, cycleLength, periodLength);
            
            // Check for irregular periods and show appointment popup if needed
            checkIrregularPeriod(cycleLength);
        });
    }
    
    // Try to load saved period data
    loadSavedPeriodData();
    
    // Initialize tab navigation for health insights
    initHealthInsightsTabs();
    
    // Initialize phase selector for diet plans
    initPhaseTabs();
}

// Save period data to API
function savePeriodDataToAPI(data) {
    fetch(`${API_URL}/period-data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Period data saved to API:', result);
        if (!result.success) {
            // Fall back to localStorage if API save fails
            savePeriodData(data);
        }
    })
    .catch(error => {
        console.error('Error saving period data to API:', error);
        // Fall back to localStorage
        savePeriodData(data);
    });
}

// Save period data to localStorage
function savePeriodData(data) {
    localStorage.setItem('wellsync_period_data', JSON.stringify(data));
}

// Load saved period data from localStorage
function loadSavedPeriodData() {
    const savedData = localStorage.getItem('wellsync_period_data');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Populate form with saved data
        if (document.getElementById('last-period-date')) {
            document.getElementById('last-period-date').value = data.lastPeriodDate;
        }
        if (document.getElementById('cycle-length')) {
            document.getElementById('cycle-length').value = data.cycleLength;
        }
        if (document.getElementById('period-length')) {
            document.getElementById('period-length').value = data.periodLength;
        }
        
        // Calculate predictions if we have data
        if (data.lastPeriodDate) {
            const lastPeriodDate = new Date(data.lastPeriodDate);
            const cycleLength = parseInt(data.cycleLength) || 28;
            const periodLength = parseInt(data.periodLength) || 5;
            
            const nextPeriod = calculateNextPeriod(lastPeriodDate, cycleLength);
            const fertileWindow = calculateFertileWindow(nextPeriod, cycleLength);
            const ovulationDay = calculateOvulationDay(nextPeriod, cycleLength);
            
            updatePeriodPredictions(nextPeriod, fertileWindow, ovulationDay, periodLength);
            
            // Initialize calendar with period data
            initPeriodCalendar(lastPeriodDate, cycleLength, periodLength);
        }
    }
}

// Calculate next period date
function calculateNextPeriod(lastPeriodDate, cycleLength) {
    const nextPeriod = new Date(lastPeriodDate);
    nextPeriod.setDate(lastPeriodDate.getDate() + cycleLength);
    return nextPeriod;
}

// Calculate fertile window (typically 5 days before ovulation + ovulation day)
function calculateFertileWindow(nextPeriod, cycleLength) {
    const ovulationDay = calculateOvulationDay(nextPeriod, cycleLength);
    
    const fertileStart = new Date(ovulationDay);
    fertileStart.setDate(ovulationDay.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDay);
    
    return {
        start: fertileStart,
        end: fertileEnd
    };
}

// Calculate ovulation day (typically 14 days before next period)
function calculateOvulationDay(nextPeriod, cycleLength) {
    const ovulationDay = new Date(nextPeriod);
    ovulationDay.setDate(nextPeriod.getDate() - 14);
    return ovulationDay;
}

// Update the UI with period predictions
function updatePeriodPredictions(nextPeriod, fertileWindow, ovulationDay, periodLength) {
    const resultsContainer = document.getElementById('period-results');
    
    if (resultsContainer) {
        // Format dates
        const formatDate = (date) => {
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        };
        
        // Calculate period end date
        const periodEndDate = new Date(nextPeriod);
        periodEndDate.setDate(nextPeriod.getDate() + periodLength - 1);
        
        // Update results
        resultsContainer.innerHTML = `
            <div class="prediction-card">
                <h3>Next Period</h3>
                <p><strong>Start:</strong> ${formatDate(nextPeriod)}</p>
                <p><strong>End:</strong> ${formatDate(periodEndDate)}</p>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${calculateProgressToNextPeriod(nextPeriod)}%"></div>
                </div>
                <p class="days-remaining">${calculateDaysToNextPeriod(nextPeriod)} days remaining</p>
            </div>
            
            <div class="prediction-card">
                <h3>Fertile Window</h3>
                <p>${formatDate(fertileWindow.start)} to ${formatDate(fertileWindow.end)}</p>
            </div>
            
            <div class="prediction-card">
                <h3>Ovulation Day</h3>
                <p>${formatDate(ovulationDay)}</p>
            </div>
        `;
        
        // Show the results
        resultsContainer.style.display = 'block';
        
        // Save the data
        savePeriodData({
            lastPeriodDate: document.getElementById('last-period-date').value,
            cycleLength: document.getElementById('cycle-length').value,
            periodLength: document.getElementById('period-length').value
        });
    }
}

// Calculate progress percentage to next period
function calculateProgressToNextPeriod(nextPeriod) {
    const today = new Date();
    const lastPeriodDate = new Date(document.getElementById('last-period-date').value);
    const totalDays = (nextPeriod - lastPeriodDate) / (1000 * 60 * 60 * 24);
    const daysPassed = (today - lastPeriodDate) / (1000 * 60 * 60 * 24);
    
    const progress = (daysPassed / totalDays) * 100;
    return Math.min(Math.max(progress, 0), 100); // Ensure it's between 0-100
}

// Calculate days remaining until next period
function calculateDaysToNextPeriod(nextPeriod) {
    const today = new Date();
    const daysRemaining = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 ? daysRemaining : 0;
}

// Check for irregular periods and show appointment popup
function checkIrregularPeriod(cycleLength) {
    // Irregular cycles are typically considered < 21 days or > 35 days
    if (cycleLength < 21 || cycleLength > 35) {
        showAppointmentPopup();
    }
}

// Appointment popup functionality
function initAppointmentPopup() {
    const closePopup = document.querySelector('.close-popup');
    const appointmentButton = document.querySelector('.btn-appointment-booking');
    
    // Handle the popup close button
    if (closePopup) {
        closePopup.addEventListener('click', () => {
            document.querySelector('.appointment-popup').classList.remove('active');
            document.querySelector('.popup-overlay').classList.remove('active');
        });
    }
    
    // Add pulse effect to the appointment button on hover
    if (appointmentButton) {
        appointmentButton.addEventListener('click', () => {
            document.querySelector('.appointment-popup')?.classList.remove('active');
            document.querySelector('.popup-overlay')?.classList.remove('active');
        });

        appointmentButton.addEventListener('mouseover', () => {
            const icon = appointmentButton.querySelector('.btn-appointment-icon');
            if (icon) {
                icon.style.animationDuration = '0.5s';
            }
        });
        
        appointmentButton.addEventListener('mouseout', () => {
            const icon = appointmentButton.querySelector('.btn-appointment-icon');
            if (icon) {
                icon.style.animationDuration = '2s';
            }
        });
    }
}

// Show appointment booking popup
function showAppointmentPopup() {
    const popup = document.querySelector('.appointment-popup');
    const overlay = document.querySelector('.popup-overlay');
    
    if (popup && overlay) {
        popup.classList.add('active');
        overlay.classList.add('active');
    }
}

// Initialize Emotion Tracking
function initEmotionTracking() {
    const startButton = document.getElementById('start-emotion-tracking');
    const videoElement = document.getElementById('emotion-video');
    const videoContainer = document.querySelector('.video-container');
    const resultElement = document.getElementById('emotion-result');
    
    // Face detection elements
    const faceDetectionFrame = document.querySelector('.face-detection-frame');
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    const positioningGuide = document.querySelector('.face-positioning-guide');
    const featurePoints = document.querySelectorAll('.feature-point');
    const analysisProgress = document.querySelector('.emotion-analysis-progress');
    const analysisStages = document.querySelectorAll('.analysis-stage');
    
    let stream = null;
    let emotionDetectionActive = false;
    let lastDetectedEmotion = null;
    let faceDetectionTimeout = null;
    let analysisTimeout = null;
    
    // Sample list of emotions for testing
    const fakeEmotions = ['happy', 'relaxed', 'focused', 'tired', 'stressed', 'neutral'];
    
    // Start camera function
    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                } 
            });
            videoElement.srcObject = stream;
            return new Promise((resolve) => {
                videoElement.onloadeddata = () => {
                    resolve();
                };
            });
        } catch (error) {
            console.error('Error accessing camera:', error);
            throw error;
        }
    }
    
    // Stop camera function
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
        }
        // Clear any running analysis
        if (faceDetectionTimeout) {
            clearTimeout(faceDetectionTimeout);
        }
        if (analysisTimeout) {
            clearTimeout(analysisTimeout);
        }
        
        // Reset UI
        videoContainer.classList.add('inactive');
        
        // Hide face detection elements
        faceDetectionFrame.classList.remove('active');
        statusDot.classList.remove('detected');
        statusText.textContent = 'Looking for face';
        positioningGuide.classList.remove('show');
        featurePoints.forEach(point => point.classList.remove('active'));
        analysisProgress.classList.remove('active');
        resetAnalysisStages();
    }
    
    // Simulate emotion detection for demo
    function simulateEmotionDetection() {
        if (!emotionDetectionActive) return;
        
        // Create canvas for image processing
        const canvas = document.createElement('canvas');
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // Step 1: Show face detection stage
        startAnalysis();
        
        // Step 2: Detect if a face is in frame
        const faceDetected = detectFace(canvas, ctx);
        
        if (faceDetected) {
            // Update the face frame and status indicators
            updateFaceDetectionUI(true);
            
            // Wait a moment then proceed with feature mapping
            setTimeout(() => {
                // Step 3: Show feature mapping stage
                advanceAnalysisStage('feature-mapping');
                
                // Activate feature points with slight delay between each
                activateFeaturePoints();
                
                // Wait a moment then proceed with emotion analysis
                setTimeout(() => {
                    // Step 4: Show emotion analysis stage
                    advanceAnalysisStage('emotion-analysis');
                    
                    // Actually analyze the face and expression
                    analyzeFaceAndDetectEmotion(canvas, ctx);
                    
                    // Complete the analysis stages
                    setTimeout(() => {
                        advanceAnalysisStage('result');
                        
                        // Wait before next scan
                        analysisTimeout = setTimeout(() => {
                            if (emotionDetectionActive) {
                                resetAnalysisStages();
                                videoContainer.classList.add('scanning');
                                simulateEmotionDetection();
                            }
                        }, 3000);
                    }, 1000);
                }, 1500);
            }, 1000);
        } else {
            // Update UI to show no face detected
            updateFaceDetectionUI(false);
            
            // Try again after a short delay
            faceDetectionTimeout = setTimeout(() => {
                if (emotionDetectionActive) {
                    resetAnalysisStages();
                    videoContainer.classList.add('scanning');
                    simulateEmotionDetection();
                }
            }, 1000);
        }
    }
    
    // Start the analysis UI flow
    function startAnalysis() {
        // Show the analysis progress
        analysisProgress.classList.add('active');
        
        // Set first stage as active
        const firstStage = document.querySelector('.analysis-stage[data-stage="face-detection"]');
        firstStage.classList.add('active');
    }
    
    // Advance to the next analysis stage
    function advanceAnalysisStage(stageName) {
        // Complete the previous stage
        const activeStage = document.querySelector('.analysis-stage.active');
        if (activeStage) {
            activeStage.classList.remove('active');
            activeStage.classList.add('completed');
        }
        
        // Activate the next stage
        const nextStage = document.querySelector(`.analysis-stage[data-stage="${stageName}"]`);
        if (nextStage) {
            nextStage.classList.add('active');
        }
    }
    
    // Reset all analysis stages
    function resetAnalysisStages() {
        analysisStages.forEach(stage => {
            stage.classList.remove('active', 'completed');
        });
        analysisProgress.classList.remove('active');
    }
    
    // Activate feature points with a cascading effect
    function activateFeaturePoints() {
        featurePoints.forEach((point, index) => {
            setTimeout(() => {
                point.classList.add('active');
            }, index * 200); // Stagger the activation
        });
    }
    
    // Update face detection UI based on detection status
    function updateFaceDetectionUI(detected) {
        if (detected) {
            faceDetectionFrame.classList.add('active');
            statusDot.classList.add('detected');
            statusText.textContent = 'Face detected';
            positioningGuide.classList.remove('show');
        } else {
            faceDetectionFrame.classList.remove('active');
            statusDot.classList.remove('detected');
            statusText.textContent = 'Looking for face';
            positioningGuide.classList.add('show');
            featurePoints.forEach(point => point.classList.remove('active'));
        }
    }
    
    // Improved face detection algorithm
    function detectFace(canvas, ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Store previous frame for motion detection
        const previousFrame = window.previousFrameData || null;
        window.previousFrameData = new Uint8ClampedArray(data);
        
        // Enhanced face detection using skin tone detection, feature analysis, and motion
        
        // 1. Analyze center region where face likely is
        const centerWidth = Math.floor(canvas.width * 0.6);
        const centerHeight = Math.floor(canvas.height * 0.6);
        const startX = Math.floor((canvas.width - centerWidth) / 2);
        const startY = Math.floor((canvas.height - centerHeight) / 2);
        
        const centerRegion = ctx.getImageData(startX, startY, centerWidth, centerHeight);
        const centerData = centerRegion.data;
        
        // 2. Check for skin tones in the center region
        let skinTonePixels = 0;
        let totalPixels = centerData.length / 4;
        
        for (let i = 0; i < centerData.length; i += 4) {
            const r = centerData[i];
            const g = centerData[i + 1];
            const b = centerData[i + 2];
            
            // Improved skin tone detection (various skin tones)
            const isSkin = (
                // Light skin tones
                (r > 60 && g > 40 && b > 20 && 
                 r > g && r > b && 
                 r - g > 15 && g - b > 15 && r - b > 30) ||
                // Medium skin tones
                (r > 95 && g > 40 && b > 20 && 
                 r > g && r > b) ||
                // Dark skin tones
                (r > 30 && g > 20 && b > 10 && 
                 r > g && r > b)
            );
            
            if (isSkin) {
                skinTonePixels++;
            }
        }
        
        const skinTonePercentage = (skinTonePixels / totalPixels) * 100;
        
        // 3. Check for brightness variation (face features create variance)
        let totalBrightness = 0;
        for (let i = 0; i < centerData.length; i += 4) {
            totalBrightness += (centerData[i] + centerData[i+1] + centerData[i+2]) / 3;
        }
        const avgBrightness = totalBrightness / totalPixels;
        
        let brightnessVariation = 0;
        for (let i = 0; i < centerData.length; i += 4) {
            const pixelBrightness = (centerData[i] + centerData[i+1] + centerData[i+2]) / 3;
            brightnessVariation += Math.abs(pixelBrightness - avgBrightness);
        }
        const variation = brightnessVariation / totalPixels;
        
        // 4. Detect motion if we have a previous frame
        let hasMovement = false;
        let motionLevel = 0;
        
        if (previousFrame && previousFrame.length === data.length) {
            motionLevel = detectMotion(data, previousFrame);
            hasMovement = motionLevel > 5;
        }
        
        // 5. Combination of factors to determine if a face is present
        // Improved detection logic
        let faceDetected = false;
        
        // Criteria for face detection:
        // 1. High skin tone percentage and decent brightness variation
        // 2. Very high brightness variation (indicating facial features)
        // 3. Clear movement with some skin tone detected (person moving in frame)
        // 4. Lower thresholds for all factors but all must be present
        faceDetected = (
            (skinTonePercentage > 10 && variation > 5) || 
            (variation > 12) || 
            (hasMovement && skinTonePercentage > 7) ||
            (skinTonePercentage > 5 && variation > 3 && hasMovement)
        );
        
        console.log(`Face detection: Skin: ${skinTonePercentage.toFixed(1)}%, Variation: ${variation.toFixed(1)}, Motion: ${motionLevel.toFixed(1)}, Detected: ${faceDetected}`);
        
        return faceDetected;
    }
    
    // Detect motion between frames
    function detectMotion(currentFrame, previousFrame) {
        if (!previousFrame || currentFrame.length !== previousFrame.length) {
            return 0;
        }
        
        let motionScore = 0;
        let diffPixels = 0;
        
        // More efficient sampling (every 12 pixels)
        for (let i = 0; i < currentFrame.length; i += 12) {
            const diff = Math.abs(currentFrame[i] - previousFrame[i]) + 
                         Math.abs(currentFrame[i+1] - previousFrame[i+1]) + 
                         Math.abs(currentFrame[i+2] - previousFrame[i+2]);
            
            if (diff > 25) { // Lower threshold for detecting subtle movements
                diffPixels++;
                motionScore += diff;
            }
        }
        
        const sampledPixels = currentFrame.length / 12;
        return (motionScore / sampledPixels) * (diffPixels / sampledPixels);
    }
    
    // Improved facial analysis for emotion detection
    function analyzeFaceAndDetectEmotion(canvas, ctx) {
        // Get image data from the center portion of the frame
        const centerWidth = Math.floor(canvas.width * 0.6);
        const centerHeight = Math.floor(canvas.height * 0.6);
        const startX = Math.floor((canvas.width - centerWidth) / 2);
        const startY = Math.floor((canvas.height - centerHeight) / 2);
        
        const imageData = ctx.getImageData(startX, startY, centerWidth, centerHeight);
        const data = imageData.data;
        
        // Store previous frame data for motion detection
        const previousFrame = window.previousFrameData;
        window.previousFrameData = new Uint8ClampedArray(data);
        
        // Calculate brightness statistics
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
            totalBrightness += (data[i] + data[i+1] + data[i+2]) / 3;
        }
        const avgBrightness = totalBrightness / (data.length / 4);
        
        // Calculate contrast (variation) which can indicate facial features
        let contrastSum = 0;
        for (let i = 0; i < data.length; i += 4) {
            const pixelBrightness = (data[i] + data[i+1] + data[i+2]) / 3;
            contrastSum += Math.abs(pixelBrightness - avgBrightness);
        }
        const contrast = contrastSum / (data.length / 4);
        
        // Analyze facial regions separately
        const thirdHeight = Math.floor(centerHeight / 3);
        
        // Upper region (eyes, forehead)
        const upperRegion = ctx.getImageData(startX, startY, centerWidth, thirdHeight);
        // Middle region (nose, cheeks)
        const middleRegion = ctx.getImageData(startX, startY + thirdHeight, centerWidth, thirdHeight);
        // Lower region (mouth, chin)
        const lowerRegion = ctx.getImageData(startX, startY + 2 * thirdHeight, centerWidth, thirdHeight);
        
        // Calculate region brightnesses
        const upperBrightness = calculateRegionBrightness(upperRegion.data);
        const middleBrightness = calculateRegionBrightness(middleRegion.data);
        const lowerBrightness = calculateRegionBrightness(lowerRegion.data);
        
        // Calculate brightness ratios between regions
        const upperToLowerRatio = upperBrightness / lowerBrightness;
        const middleToLowerRatio = middleBrightness / lowerBrightness;
        
        // Detect motion if we have a previous frame
        let motionLevel = 0;
        if (previousFrame && previousFrame.length === data.length) {
            motionLevel = calculateMotionLevel(data, previousFrame);
        }
        
        // Log values for debugging
        console.log(`Emotion Analysis: Upper/Lower: ${upperToLowerRatio.toFixed(2)}, Middle/Lower: ${middleToLowerRatio.toFixed(2)}, Contrast: ${contrast.toFixed(2)}, Motion: ${motionLevel.toFixed(2)}`);
        
        // Improved emotion detection based on measurements
        let detectedEmotion;
        let confidenceLevel = 0;
        
        // Smiling detection (higher brightness in lower face relative to upper face)
        if (lowerBrightness > upperBrightness * 1.05 && middleBrightness > upperBrightness * 1.03) {
            detectedEmotion = 'happy';
            confidenceLevel = Math.min(100, 60 + ((lowerBrightness/upperBrightness - 1.05) * 300));
        } 
        // Stress detection (high motion + higher contrast)
        else if (motionLevel > 12 && contrast > 20) {
            detectedEmotion = 'stressed';
            confidenceLevel = Math.min(100, 60 + (motionLevel - 12) * 4);
        }
        // Focus/concentration (moderate contrast with lower motion)
        else if (contrast > 18 && motionLevel < 10 && motionLevel > 2) {
            detectedEmotion = 'focused';
            confidenceLevel = Math.min(100, 60 + (contrast - 18) * 3);
        }
        // Tiredness (low brightness + low motion)
        else if (avgBrightness < 100 && motionLevel < 8) {
            detectedEmotion = 'tired';
            confidenceLevel = Math.min(100, 60 + (100 - avgBrightness) / 2);
        }
        // Relaxed state (low motion, moderate brightness, balanced facial regions)
        else if (motionLevel < 5 && Math.abs(upperToLowerRatio - 1) < 0.15) {
            detectedEmotion = 'relaxed';
            confidenceLevel = Math.min(100, 70 - (motionLevel * 5));
        }
        // Neutral state (fallback)
        else {
            detectedEmotion = 'neutral';
            confidenceLevel = 60;
        }
        
        // Add randomness for demo purposes, but prioritize stress detection
        if (detectedEmotion === lastDetectedEmotion && confidenceLevel < 75 && detectedEmotion !== 'stressed') {
            // 50% chance to change to a different emotion
            if (Math.random() > 0.5) {
                const otherEmotions = fakeEmotions.filter(e => e !== detectedEmotion);
                // Higher chance of stress when changing
                const stressChance = Math.random() < 0.3; // 30% chance of stress
                detectedEmotion = stressChance ? 'stressed' : otherEmotions[Math.floor(Math.random() * otherEmotions.length)];
                confidenceLevel = Math.floor(40 + Math.random() * 30); // Random confidence between 40-70
            }
        }
        
        // Store emotion to avoid repetition
        lastDetectedEmotion = detectedEmotion;
        
        // Display the detected emotion
        displayDetectedEmotion(detectedEmotion, confidenceLevel);
    }
    
    // Helper function to calculate brightness in a region
    function calculateRegionBrightness(regionData) {
        let totalBrightness = 0;
        for (let i = 0; i < regionData.length; i += 4) {
            totalBrightness += (regionData[i] + regionData[i+1] + regionData[i+2]) / 3;
        }
        return totalBrightness / (regionData.length / 4);
    }
    
    // Helper function to calculate motion level between frames
    function calculateMotionLevel(currentFrame, previousFrame) {
        let totalDiff = 0;
        let significantDiffs = 0;
        
        // Sample pixels (every 16 for performance)
        for (let i = 0; i < currentFrame.length; i += 16) {
            const diff = Math.abs(currentFrame[i] - previousFrame[i]) + 
                         Math.abs(currentFrame[i+1] - previousFrame[i+1]) + 
                         Math.abs(currentFrame[i+2] - previousFrame[i+2]);
            
            if (diff > 20) {
                significantDiffs++;
                totalDiff += diff;
            }
        }
        
        const sampledPixels = currentFrame.length / 16;
        const motionPercent = (significantDiffs / sampledPixels) * 100;
        return motionPercent;
    }
    
    // Display the detected emotion with improved UI
    function displayDetectedEmotion(emotion, confidence) {
        // Stop the scanning animation
        videoContainer.classList.remove('scanning');
        
        // Format confidence level
        const confidenceDesc = confidence > 80 ? "high" : confidence > 50 ? "medium" : "low";
        
        // Show the detected emotion with a nice animation
        resultElement.innerHTML = `
            <strong>Detected Emotion:</strong> ${emotion} 
            <span class="confidence-level ${confidenceDesc}">(${confidenceDesc} confidence ${confidence.toFixed(0)}%)</span>
        `;
        resultElement.classList.add('show');
        
        // Suggest therapy based on detected emotion
        suggestTherapy(emotion);
    }
    
    // Suggest therapy based on emotion
    function suggestTherapy(emotion) {
        const therapySuggestion = document.getElementById('therapy-suggestion');
        
        let recommendedFrequency = '';
        let therapyDesc = '';
        
        // Match emotions to therapies
        switch(emotion) {
            case 'stressed':
                recommendedFrequency = '432 Hz';
                therapyDesc = 'calms the nervous system and reduces stress levels';
                break;
            case 'sad':
            case 'tired':
                recommendedFrequency = '396 Hz';
                therapyDesc = 'liberates you from negativity and fatigue';
                break;
            case 'happy':
                recommendedFrequency = '528 Hz';
                therapyDesc = 'enhances your positive state and promotes healing';
                break;
            case 'focused':
                recommendedFrequency = '852 Hz';
                therapyDesc = 'enhances mental clarity and intuition';
                break;
            default:
                recommendedFrequency = '639 Hz';
                therapyDesc = 'promotes balance and harmony';
        }
        
        // Show the suggestion
        therapySuggestion.innerHTML = `
            <h4>Recommended Sound Therapy:</h4>
            <p>Based on your emotional state, we recommend <strong>${recommendedFrequency}</strong> which ${therapyDesc}.</p>
            <a href="#neuroacoustic" class="btn btn-primary btn-sm">Try it now</a>
        `;
        therapySuggestion.style.display = 'block';
        
        // Also link to the specific therapy in the neuroacoustic section
        linkEmotionsToTherapy();
    }
    
    // Event listener for start/stop button
    if (startButton) {
        startButton.addEventListener('click', function() {
            if (!emotionDetectionActive) {
                // Start emotion tracking
                startCamera()
                    .then(() => {
                        emotionDetectionActive = true;
                        startButton.textContent = 'Stop Emotion Tracking';
                        startButton.classList.add('active');
                        
                        // Show the video container and start scanning
                        videoContainer.classList.remove('inactive');
                        videoContainer.classList.add('scanning');
                        
                        // Reset results
                        resultElement.classList.remove('show');
                        document.getElementById('therapy-suggestion').style.display = 'none';
                        
                        // Begin emotion detection
                        simulateEmotionDetection();
                    })
                    .catch(error => {
                        console.error('Error starting camera:', error);
                        alert('Unable to access camera. Please check permissions and try again.');
                    });
            } else {
                // Stop emotion tracking
                emotionDetectionActive = false;
                stopCamera();
                startButton.textContent = 'Start Emotion Tracking';
                startButton.classList.remove('active');
                
                // Hide elements
                videoContainer.classList.remove('scanning');
                videoContainer.classList.add('inactive');
                
                // Reset UI elements
                resetAnalysisStages();
                featurePoints.forEach(point => point.classList.remove('active'));
                faceDetectionFrame.classList.remove('active');
            }
        });
    }
}

// Suggest neuroacoustic therapy based on detected emotion
function suggestTherapy(emotion) {
    const suggestionElement = document.getElementById('therapy-suggestion');
    
    if (suggestionElement) {
        let therapy = '';
        let emotionLower = emotion.toLowerCase();
        let frequency = '528'; // Default frequency
        
        if (emotionLower.includes('stress') || emotionLower === 'stressed') {
            therapy = 'Recommended: 20 minutes of 432 Hz relaxation therapy with vagus nerve stimulation';
            frequency = '432';
        } else if (emotionLower.includes('anx') || emotionLower === 'anxious' || emotionLower === 'fear') {
            therapy = 'Recommended: 15 minutes of 432 Hz anxiety relief with deep breathing exercises';
            frequency = '432';
        } else if (emotionLower.includes('tire') || emotionLower === 'tired' || emotionLower === 'fatigue') {
            therapy = 'Recommended: 10 minutes of 528 Hz energy boost with light stimulation';
            frequency = '528';
        } else if (emotionLower.includes('happ') || emotionLower === 'happy' || emotionLower === 'joy') {
            therapy = 'Recommended: 10 minutes of 639 Hz harmony enhancer to maintain positive emotions';
            frequency = '639';
        } else if (emotionLower.includes('sad') || emotionLower === 'depressed') {
            therapy = 'Recommended: 20 minutes of 396 Hz liberation from fear and guilt with gentle vibration';
            frequency = '396';
        } else if (emotionLower.includes('calm') || emotionLower === 'neutral') {
            therapy = 'Recommended: 15 minutes of balanced frequency therapy at 528 Hz';
            frequency = '528';
        } else {
            therapy = 'Recommended: 15 minutes of balanced frequency therapy at 528 Hz';
            frequency = '528';
        }
        
        // Add a link to the neuroacoustic section
        therapy += ` <a href="#neuroacoustic" class="try-therapy-link">Try it now</a>`;
        
        suggestionElement.innerHTML = therapy;
        suggestionElement.style.display = 'block';
        
        // Add animation for the suggestion
        setTimeout(() => {
            suggestionElement.classList.add('show');
        }, 500);
        
        // Dispatch event for the therapy section to pick up
        document.dispatchEvent(new CustomEvent('emotionDetected', {
            detail: { emotion: emotionLower, frequency: frequency }
        }));
    }
}

// Neuroacoustic Therapy functionality
function initNeuroacousticTherapy() {
    console.log("Initializing Neuroacoustic Therapy");
    const playButtons = document.querySelectorAll('.btn-therapy-play');
    const volumeSliders = document.querySelectorAll('.volume-slider');
    const timerStart = document.getElementById('timer-start');
    const timerReset = document.getElementById('timer-reset');
    const timerPresets = document.querySelectorAll('.btn-timer-preset');
    const timerDisplay = document.getElementById('therapy-time');
    
    // Timer variables
    let timerInterval = null;
    let timerSeconds = 0;
    let timerRunning = false;
    
    // Check if elements exist
    console.log(`Found ${playButtons.length} play buttons`);
    console.log(`Found ${volumeSliders.length} volume sliders`);
    console.log("Timer elements found:", timerStart ? "Yes" : "No", timerReset ? "Yes" : "No", timerDisplay ? "Yes" : "No");
    
    // Store all audio elements
    const audioElements = {};
    
    // Preload all audio files
    const audioFiles = [
        { id: 'liberation-audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { id: 'relaxation-audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { id: 'healing-audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
        { id: 'connection-audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
        { id: 'intuition-audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' }
    ];
    
    // Initialize audio elements
    audioFiles.forEach(file => {
        const audio = document.getElementById(file.id);
        if (audio) {
            // Set the source programmatically
            if (audio.querySelector('source')) {
                audio.querySelector('source').src = file.url;
            } else {
                const source = document.createElement('source');
                source.src = file.url;
                source.type = 'audio/mpeg';
                audio.appendChild(source);
            }
            
            // Load the audio
            audio.load();
            
            const button = document.querySelector(`.btn-therapy-play[data-target="${file.id}"]`);
            
            audioElements[file.id] = {
                element: audio,
                playing: false,
                button: button,
                url: file.url
            };
            
            console.log(`Initialized audio element: ${file.id} with URL: ${file.url}`);
        } else {
            console.warn(`Audio element not found: ${file.id}`);
        }
    });
    
    // Play/Pause button click
    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const audioInfo = audioElements[targetId];
            
            if (!audioInfo || !audioInfo.element) {
                console.error(`Audio element not found: ${targetId}`);
                return;
            }
            
            const audio = audioInfo.element;
            
            if (audio.paused) {
                // Stop other audio elements first
                stopAllAudio(targetId);
                
                // Make sure the audio is loaded
                if (audio.readyState < 2) { // HAVE_CURRENT_DATA or lower
                    console.log(`Audio ${targetId} not fully loaded, reloading...`);
                    audio.load();
                }
                
                // Then play this one
                console.log(`Playing ${targetId}`);
                
                // Force the currentTime to 0 to ensure playback from the beginning
                audio.currentTime = 0;
                
                // Create a play Promise with explicit error handling
                const playPromise = audio.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log(`Successfully playing ${targetId}`);
                        button.innerHTML = '<i class="fas fa-pause"></i> Pause';
                        button.classList.add('playing');
                        
                        // Update state
                        audioInfo.playing = true;
                    }).catch(error => {
                        console.error(`Error playing audio ${targetId}:`, error);
                        
                        // Try alternative method for browsers with autoplay restrictions
                        audio.muted = true;
                        audio.play().then(() => {
                            audio.muted = false;
                            console.log(`Retry successful for ${targetId}`);
                            button.innerHTML = '<i class="fas fa-pause"></i> Pause';
                            button.classList.add('playing');
                            audioInfo.playing = true;
                        }).catch(e => {
                            console.error(`Failed retry for ${targetId}:`, e);
                            alert('Could not play audio. Please click again or check your browser settings.');
                        });
                    });
                }
            } else {
                // Pause
                audio.pause();
                button.innerHTML = '<i class="fas fa-play"></i> Play';
                button.classList.remove('playing');
                
                // Update state
                audioInfo.playing = false;
                console.log(`Paused ${targetId}`);
            }
        });
    });
    
    // Volume slider input
    volumeSliders.forEach(slider => {
        const targetId = slider.getAttribute('data-target');
        const audioInfo = audioElements[targetId];
        
        if (!audioInfo || !audioInfo.element) {
            console.warn(`Audio element not found for volume slider: ${targetId}`);
            return;
        }
        
        const audio = audioInfo.element;
        
        // Set initial volume
        audio.volume = parseFloat(slider.value);
        console.log(`Initial volume for ${targetId} set to ${audio.volume}`);
        
        slider.addEventListener('input', () => {
            audio.volume = parseFloat(slider.value);
            console.log(`Volume for ${targetId} set to ${audio.volume}`);
        });
    });
    
    // Stop all audio except the one specified by excludeId
    function stopAllAudio(excludeId) {
        console.log(`Stopping all audio except ${excludeId}`);
        Object.keys(audioElements).forEach(id => {
            if (id !== excludeId) {
                const audioInfo = audioElements[id];
                if (audioInfo.element && !audioInfo.element.paused) {
                    audioInfo.element.pause();
                    audioInfo.element.currentTime = 0;
                    if (audioInfo.button) {
                        audioInfo.button.innerHTML = '<i class="fas fa-play"></i> Play';
                        audioInfo.button.classList.remove('playing');
                    }
                    audioInfo.playing = false;
                    console.log(`Stopped ${id} (playing another track)`);
                }
            }
        });
    }
    
    // Format seconds to MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }
    
    // Timer functionality
    if (timerStart && timerReset && timerDisplay) {
        timerStart.addEventListener('click', () => {
            if (timerRunning) {
                // Pause timer
                clearInterval(timerInterval);
                timerInterval = null;
                timerRunning = false;
                timerStart.textContent = 'Resume Timer';
                timerStart.classList.remove('active');
                console.log('Timer paused');
            } else {
                // Start/resume timer
                timerRunning = true;
                timerStart.textContent = 'Pause Timer';
                timerStart.classList.add('active');
                
                // Start interval
                timerInterval = setInterval(() => {
                    timerSeconds++;
                    timerDisplay.textContent = formatTime(timerSeconds);
                    
                    // Add pulsing effect at every minute
                    if (timerSeconds % 60 === 0) {
                        timerDisplay.classList.add('pulse');
                        setTimeout(() => {
                            timerDisplay.classList.remove('pulse');
                        }, 1000);
                    }
                }, 1000);
                
                console.log('Timer started');
            }
        });
        
        timerReset.addEventListener('click', () => {
            clearInterval(timerInterval);
            timerInterval = null;
            timerRunning = false;
            timerSeconds = 0;
            timerDisplay.textContent = '00:00';
            timerStart.textContent = 'Start Timer';
            timerStart.classList.remove('active');
            console.log('Timer reset');
        });
        
        // Timer presets
        timerPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                const minutes = parseInt(preset.getAttribute('data-minutes'));
                if (!isNaN(minutes)) {
                    // Reset timer first
                    clearInterval(timerInterval);
                    timerInterval = null;
                    timerRunning = false;
                    
                    // Set preset time
                    timerSeconds = minutes * 60;
                    timerDisplay.textContent = formatTime(timerSeconds);
                    timerStart.textContent = 'Start Timer';
                    
                    // Highlight selected preset
                    document.querySelectorAll('.btn-timer-preset').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    preset.classList.add('active');
                    
                    console.log(`Timer preset set to ${minutes} minutes`);
                }
            });
        });
    } else {
        console.warn('Timer elements not found');
    }
    
    // Test play all sounds (for debugging, will be removed)
    function testSounds() {
        console.log("Testing sounds...");
        Object.keys(audioElements).forEach(id => {
            const audioInfo = audioElements[id];
            if (audioInfo && audioInfo.element) {
                // Create a new temporary Audio object for test
                const testAudio = new Audio(audioInfo.url);
                testAudio.volume = 0.1; // Low volume for test
                testAudio.play().then(() => {
                    console.log(`Test sound for ${id} successful`);
                    // Stop after 1 second
                    setTimeout(() => {
                        testAudio.pause();
                        testAudio.remove();
                    }, 1000);
                }).catch(e => {
                    console.error(`Test sound for ${id} failed:`, e);
                });
            }
        });
    }
    
    // Don't automatically test sounds, but make available for manual testing
    window.testNeuroacousticSounds = testSounds;
    
    console.log("Neuroacoustic therapy initialization complete");
}

// Initialize Audio Controls
function initAudioControls() {
    const playButtons = document.querySelectorAll('.btn-therapy-play');
    const volumeSliders = document.querySelectorAll('.volume-slider');
    
    // Handle play/pause
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const audio = document.getElementById(targetId);
            
            if (!audio) return;
            
            if (audio.paused) {
                // Stop all other audio elements first
                stopAllAudio(targetId);
                
                // Play this audio
                const playPromise = audio.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(_ => {
                            this.innerHTML = '<i class="fas fa-pause"></i> Pause';
                            this.classList.add('playing');
                        })
                        .catch(error => {
                            console.error('Error playing audio:', error);
                        });
                }
            } else {
                audio.pause();
                this.innerHTML = '<i class="fas fa-play"></i> Play';
                this.classList.remove('playing');
            }
        });
    });
    
    // Stop all audio except for the one with targetId
    function stopAllAudio(excludeId) {
        const audios = document.querySelectorAll('audio');
        const buttons = document.querySelectorAll('.btn-therapy-play');
        
        audios.forEach(audio => {
            if (audio.id !== excludeId && !audio.paused) {
                audio.pause();
                
                // Reset the corresponding button
                buttons.forEach(btn => {
                    if (btn.getAttribute('data-target') === audio.id) {
                        btn.innerHTML = '<i class="fas fa-play"></i> Play';
                        btn.classList.remove('playing');
                    }
                });
            }
        });
    }
    
    // Handle volume control
    volumeSliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const targetId = this.getAttribute('data-target');
            const audio = document.getElementById(targetId);
            
            if (audio) {
                audio.volume = this.value;
            }
        });
        
        // Set initial volume
        const targetId = slider.getAttribute('data-target');
        const audio = document.getElementById(targetId);
        
        if (audio) {
            audio.volume = slider.value;
        }
    });
}

// Initialize Therapy Timer
function initTherapyTimer() {
    const timerStart = document.getElementById('timer-start');
    const timerReset = document.getElementById('timer-reset');
    const timerDisplay = document.getElementById('therapy-time');
    const timerPresets = document.querySelectorAll('.btn-timer-preset');
    
    if (!timerStart || !timerReset || !timerDisplay) return;
    
    let timerInterval = null;
    let timerRunning = false;
    let timerSeconds = 0;
    
    // Format seconds to MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }
    
    // Start/pause timer
    timerStart.addEventListener('click', function() {
        if (timerRunning) {
            // Pause timer
            clearInterval(timerInterval);
            timerRunning = false;
            this.textContent = 'Resume Timer';
            this.classList.remove('btn-primary');
            this.classList.add('btn-secondary');
        } else {
            // Start timer
            timerRunning = true;
            this.textContent = 'Pause Timer';
            this.classList.remove('btn-secondary');
            this.classList.add('btn-primary');
            
            timerInterval = setInterval(() => {
                timerSeconds++;
                timerDisplay.textContent = formatTime(timerSeconds);
                
                // Optional: Show notification at certain intervals
                if (timerSeconds > 0 && timerSeconds % 300 === 0) { // Every 5 minutes
                    showTimerNotification(timerSeconds / 60);
                }
            }, 1000);
        }
    });
    
    // Reset timer
    timerReset.addEventListener('click', function() {
        clearInterval(timerInterval);
        timerRunning = false;
        timerSeconds = 0;
        timerDisplay.textContent = '00:00';
        timerStart.textContent = 'Start Timer';
        timerStart.classList.remove('btn-secondary');
        timerStart.classList.add('btn-primary');
    });
    
    // Timer presets
    timerPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            const minutes = parseInt(this.getAttribute('data-minutes'));
            
            // Reset state
            clearInterval(timerInterval);
            timerRunning = false;
            
            // Set to preset
            timerSeconds = minutes * 60;
            timerDisplay.textContent = formatTime(timerSeconds);
            timerStart.textContent = 'Start Timer';
            timerStart.classList.remove('btn-secondary');
            timerStart.classList.add('btn-primary');
            
            // Update active state
            timerPresets.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Timer notifications
    function showTimerNotification(minutes) {
        // Create a notification element
        const notification = document.createElement('div');
        notification.className = 'timer-notification';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-bell"></i>
                <span>You've been listening for ${minutes} minutes</span>
                <button class="close-notification"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Close button
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
}

// Link emotions to therapy recommendations
function linkEmotionsToTherapy() {
    // This would normally involve mapping detected emotions to specific frequencies
    // For demo purposes, it just highlights a random therapy as "recommended"
    
    const therapyCards = document.querySelectorAll('.therapy-card');
    let recommendedCard = null;
    
    // If we have a detected emotion
    const emotionResult = document.getElementById('emotion-result');
    if (emotionResult && emotionResult.textContent) {
        const emotion = emotionResult.textContent.toLowerCase();
        
        // Map emotions to therapies (simplified)
        if (emotion.includes('sad') || emotion.includes('fear')) {
            recommendedCard = document.querySelector('.therapy-card:nth-child(1)'); // 396 Hz
        } else if (emotion.includes('stress') || emotion.includes('anxiety')) {
            recommendedCard = document.querySelector('.therapy-card:nth-child(2)'); // 432 Hz
        } else if (emotion.includes('pain') || emotion.includes('healing')) {
            recommendedCard = document.querySelector('.therapy-card:nth-child(3)'); // 528 Hz
        } else if (emotion.includes('relationship') || emotion.includes('love')) {
            recommendedCard = document.querySelector('.therapy-card:nth-child(4)'); // 639 Hz
        } else if (emotion.includes('clarity') || emotion.includes('spiritual')) {
            recommendedCard = document.querySelector('.therapy-card:nth-child(5)'); // 852 Hz
        } else {
            // Random recommendation if no emotion match
            const randomIndex = Math.floor(Math.random() * therapyCards.length);
            recommendedCard = therapyCards[randomIndex];
        }
    } else {
        // Random recommendation if no emotion detected
        const randomIndex = Math.floor(Math.random() * therapyCards.length);
        recommendedCard = therapyCards[randomIndex];
    }
    
    // Apply recommended styling
    if (recommendedCard) {
        therapyCards.forEach(card => {
            card.classList.remove('recommended');
        });
        recommendedCard.classList.add('recommended');
    }
}

// Initialize Period Calendar
function initPeriodCalendar(lastPeriodDate, cycleLength, periodLength) {
    // Exit if calendar elements don't exist
    if (!document.getElementById('calendar-days')) return;
    
    const calendarDays = document.getElementById('calendar-days');
    const monthYearDisplay = document.getElementById('calendar-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    let currentDate = new Date();
    let displayedMonth = currentDate.getMonth();
    let displayedYear = currentDate.getFullYear();
    
    // Calculate all relevant dates for marking on the calendar
    const periodDates = calculatePeriodDays(lastPeriodDate, cycleLength, periodLength, 3);
    const fertileDates = calculateFertileDays(lastPeriodDate, cycleLength, 3);
    const ovulationDates = calculateOvulationDays(lastPeriodDate, cycleLength, 3);
    const pmsDates = calculatePMSDays(lastPeriodDate, cycleLength, 3);
    
    // Render calendar
    renderCalendar(displayedMonth, displayedYear);
    
    // Add event listeners for navigation
    prevMonthBtn.addEventListener('click', () => {
        displayedMonth--;
        if (displayedMonth < 0) {
            displayedMonth = 11;
            displayedYear--;
        }
        renderCalendar(displayedMonth, displayedYear);
    });
    
    nextMonthBtn.addEventListener('click', () => {
        displayedMonth++;
        if (displayedMonth > 11) {
            displayedMonth = 0;
            displayedYear++;
        }
        renderCalendar(displayedMonth, displayedYear);
    });
    
    // Render calendar function
    function renderCalendar(month, year) {
        // Clear calendar
        calendarDays.innerHTML = '';
        
        // Update month and year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                            'July', 'August', 'September', 'October', 'November', 'December'];
        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and last day
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        
        // Get last date of previous month for filling in starting gaps
        const prevMonthLastDate = new Date(year, month, 0).getDate();
        
        // Add days from previous month
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day inactive';
            dayElement.textContent = prevMonthLastDate - i;
            calendarDays.appendChild(dayElement);
        }
        
        // Add days of current month
        for (let i = 1; i <= lastDate; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = i;
            
            // Check for current day
            const currentDateObj = new Date();
            if (year === currentDateObj.getFullYear() && month === currentDateObj.getMonth() && i === currentDateObj.getDate()) {
                dayElement.classList.add('today');
            }
            
            // Check if this date is a period day, fertile day, etc.
            const checkDate = new Date(year, month, i);
            
            // Check and mark period days
            if (isDateInRanges(checkDate, periodDates)) {
                dayElement.classList.add('period-day');
                dayElement.setAttribute('title', 'Period day');
            } 
            // Check for ovulation day
            else if (isDateInRanges(checkDate, ovulationDates)) {
                dayElement.classList.add('ovulation-day');
                dayElement.setAttribute('title', 'Ovulation day');
            }
            // Check for fertile window
            else if (isDateInRanges(checkDate, fertileDates)) {
                dayElement.classList.add('fertile-day');
                dayElement.setAttribute('title', 'Fertile day');
            }
            // Check for PMS days
            else if (isDateInRanges(checkDate, pmsDates)) {
                dayElement.classList.add('pms-day');
                dayElement.setAttribute('title', 'PMS day');
            }
            
            // Add click event to show details
            dayElement.addEventListener('click', () => {
                showDateDetails(checkDate, dayElement);
            });
            
            calendarDays.appendChild(dayElement);
            
            // Add animation delay for fade-in effect
            dayElement.style.animationDelay = `${(i + firstDay) * 20}ms`;
        }
        
        // Add animation class after a small delay to trigger animations
        setTimeout(() => {
            const allDays = calendarDays.querySelectorAll('.calendar-day');
            allDays.forEach(day => {
                day.classList.add('animate-in');
            });
        }, 10);
        
        // Fill in remaining slots with next month's days
        const totalCells = Math.ceil((lastDate + firstDay) / 7) * 7;
        for (let i = lastDate + firstDay; i < totalCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day inactive';
            dayElement.textContent = i - lastDate - firstDay + 1;
            calendarDays.appendChild(dayElement);
        }
    }
    
    // Check if a date is within any of the provided date ranges
    function isDateInRanges(date, dateRanges) {
        const timestamp = date.getTime();
        return dateRanges.some(range => {
            return timestamp >= range.start.getTime() && timestamp <= range.end.getTime();
        });
    }
    
    // Show detailed information when clicking on a date
    function showDateDetails(date, element) {
        // Remove active class from all days
        const allDays = document.querySelectorAll('.calendar-day');
        allDays.forEach(day => day.classList.remove('active'));
        
        // Add active class to clicked day
        element.classList.add('active');
        
        // Future implementation: display specific details about this date
        console.log('Date selected:', date);
        
        // Example: scroll to health insights related to this specific date
        if (isDateInRanges(date, periodDates)) {
            activatePhaseTab('menstrual');
        } else if (isDateInRanges(date, fertileDates)) {
            activatePhaseTab('follicular');
        } else if (isDateInRanges(date, ovulationDates)) {
            activatePhaseTab('ovulatory');
        } else if (isDateInRanges(date, pmsDates)) {
            activatePhaseTab('luteal');
        }
    }
}

// Calculate all period days for multiple cycles
function calculatePeriodDays(lastPeriodDate, cycleLength, periodLength, cycles) {
    const periodDates = [];
    
    for (let i = 0; i < cycles; i++) {
        const periodStartDate = new Date(lastPeriodDate);
        periodStartDate.setDate(periodStartDate.getDate() + (cycleLength * i));
        
        const periodEndDate = new Date(periodStartDate);
        periodEndDate.setDate(periodStartDate.getDate() + periodLength - 1);
        
        periodDates.push({
            start: periodStartDate,
            end: periodEndDate
        });
    }
    
    return periodDates;
}

// Calculate all fertile window days for multiple cycles
function calculateFertileDays(lastPeriodDate, cycleLength, cycles) {
    const fertileDates = [];
    
    for (let i = 0; i < cycles; i++) {
        const periodStartDate = new Date(lastPeriodDate);
        periodStartDate.setDate(periodStartDate.getDate() + (cycleLength * i));
        
        const nextPeriod = calculateNextPeriod(periodStartDate, cycleLength);
        const ovulationDay = calculateOvulationDay(nextPeriod, cycleLength);
        
        const fertileStart = new Date(ovulationDay);
        fertileStart.setDate(ovulationDay.getDate() - 5);
        
        const fertileEnd = new Date(ovulationDay);
        fertileEnd.setDate(ovulationDay.getDate() - 1); // Exclude ovulation day itself
        
        fertileDates.push({
            start: fertileStart,
            end: fertileEnd
        });
    }
    
    return fertileDates;
}

// Calculate all ovulation days for multiple cycles
function calculateOvulationDays(lastPeriodDate, cycleLength, cycles) {
    const ovulationDates = [];
    
    for (let i = 0; i < cycles; i++) {
        const periodStartDate = new Date(lastPeriodDate);
        periodStartDate.setDate(periodStartDate.getDate() + (cycleLength * i));
        
        const nextPeriod = calculateNextPeriod(periodStartDate, cycleLength);
        const ovulationDay = calculateOvulationDay(nextPeriod, cycleLength);
        
        ovulationDates.push({
            start: ovulationDay,
            end: ovulationDay
        });
    }
    
    return ovulationDates;
}

// Calculate all PMS days for multiple cycles (typically 3-7 days before period)
function calculatePMSDays(lastPeriodDate, cycleLength, cycles) {
    const pmsDates = [];
    
    for (let i = 0; i < cycles; i++) {
        const periodStartDate = new Date(lastPeriodDate);
        periodStartDate.setDate(periodStartDate.getDate() + (cycleLength * i));
        
        const pmsStart = new Date(periodStartDate);
        pmsStart.setDate(periodStartDate.getDate() - 7);
        
        const pmsEnd = new Date(periodStartDate);
        pmsEnd.setDate(periodStartDate.getDate() - 1);
        
        pmsDates.push({
            start: pmsStart,
            end: pmsEnd
        });
    }
    
    return pmsDates;
}

// Initialize health insights tabs
function initHealthInsightsTabs() {
    const insightTabs = document.querySelectorAll('.insight-tab');
    const insightContents = document.querySelectorAll('.insight-content');
    
    if (insightTabs.length === 0) return;
    
    insightTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            insightTabs.forEach(t => t.classList.remove('active'));
            insightContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const tabName = tab.getAttribute('data-tab');
            const content = document.getElementById(`${tabName}-content`);
            if (content) {
                content.classList.add('active');
            }
        });
    });
}

// Initialize phase selector tabs for diet plans
function initPhaseTabs() {
    const phaseBtns = document.querySelectorAll('.phase-btn');
    const phases = document.querySelectorAll('.diet-phase');
    
    if (phaseBtns.length === 0) return;
    
    phaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and phases
            phaseBtns.forEach(b => b.classList.remove('active'));
            phases.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding phase
            const phaseName = btn.getAttribute('data-phase');
            const phase = document.getElementById(`${phaseName}-phase`);
            if (phase) {
                phase.classList.add('active');
            }
        });
    });
}

// Activate a specific phase tab programmatically
function activatePhaseTab(phaseName) {
    // Switch to diet plan tab first if it's not active
    const dietTab = document.querySelector('.insight-tab[data-tab="diet-plan"]');
    if (dietTab && !dietTab.classList.contains('active')) {
        dietTab.click();
    }
    
    // Then activate the specific phase button
    const phaseBtn = document.querySelector(`.phase-btn[data-phase="${phaseName}"]`);
    if (phaseBtn && !phaseBtn.classList.contains('active')) {
        phaseBtn.click();
    }
}

// Initialize Hand Gesture Tracking
function initHandGestureTracking() {
    const handVideo = document.getElementById('hand-video');
    const handCanvas = document.getElementById('hand-canvas');
    const handStatusElem = document.querySelector('.hand-status');
    const detectedGestureElem = document.getElementById('detected-gesture');
    const handXElem = document.getElementById('hand-x');
    const handYElem = document.getElementById('hand-y');
    const handZElem = document.getElementById('hand-z');
    const gestureToggle = document.getElementById('gesture-toggle');
    const sensitivitySlider = document.getElementById('gesture-sensitivity');
    const modelStatusElem = document.getElementById('model-status');
    const modelProgressBar = document.getElementById('model-progress-bar');
    
    // Return early if elements don't exist
    if (!handVideo || !handCanvas) {
        console.log("Hand tracking elements not found in the DOM");
        return;
    }
    
    let handposeModel = null;
    let ctx = handCanvas.getContext('2d');
    let videoStream = null;
    let isHandTrackingEnabled = false;
    let handTrackingInterval = null;
    let previousHandPosition = { x: 0, y: 0, z: 0 };
    let gestureHistory = [];
    let lastDetectedGesture = 'None';
    let gestureSensitivity = sensitivitySlider ? parseInt(sensitivitySlider.value) : 5;
    
    // Initialize gesture estimator
    let GE = null;
    
    // Setup Canvas
    const setupCanvas = () => {
        if (handVideo.videoWidth) {
            handCanvas.width = handVideo.videoWidth;
            handCanvas.height = handVideo.videoHeight;
        } else {
            handCanvas.width = 480;
            handCanvas.height = 360;
        }
    };
    
    // Create gesture definitions
    const createGestureDefinitions = () => {
        if (!window.fp) {
            console.error("FingerPose is not available");
            return [];
        }
        
        try {
            // Thumbs Up Gesture
            const thumbsUpGesture = new fp.GestureDescription('thumbs_up');
            thumbsUpGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl);
            thumbsUpGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 1.0);
            thumbsUpGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
            thumbsUpGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
            thumbsUpGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
            thumbsUpGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
            
            // Victory / Peace Sign Gesture
            const peaceGesture = new fp.GestureDescription('peace');
            peaceGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
            peaceGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
            peaceGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
            peaceGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 1.0);
            peaceGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
            peaceGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
            
            // Open Palm Gesture
            const openPalmGesture = new fp.GestureDescription('open_palm');
            for (let finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
                openPalmGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
            }
            
            // Fist Gesture
            const fistGesture = new fp.GestureDescription('fist');
            fistGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
            for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
                fistGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
            }
            
            // Point Up Gesture
            const pointUpGesture = new fp.GestureDescription('point_up');
            pointUpGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
            pointUpGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
            for (let finger of [fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
                pointUpGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
            }
            
            // Point Down Gesture
            const pointDownGesture = new fp.GestureDescription('point_down');
            pointDownGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
            pointDownGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalDown, 1.0);
            for (let finger of [fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
                pointDownGesture.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
            }
            
            return [thumbsUpGesture, peaceGesture, openPalmGesture, fistGesture, pointUpGesture, pointDownGesture];
        } catch (error) {
            console.error("Error creating gesture definitions:", error);
            return [];
        }
    };
    
    // Start camera for hand tracking
    const startHandCamera = async () => {
        if (videoStream) {
            // Camera already running
            return true;
        }
        
        try {
            videoStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 480,
                    height: 360,
                    facingMode: 'user'
                }
            });
            
            handVideo.srcObject = videoStream;
            
            return new Promise((resolve) => {
                handVideo.onloadedmetadata = () => {
                    handVideo.play()
                        .then(() => {
                            setupCanvas();
                            if (handStatusElem) handStatusElem.textContent = 'Camera ready';
                            resolve(true);
                        })
                        .catch(error => {
                            console.error("Error playing video:", error);
                            resolve(false);
                        });
                };
                
                // Fallback if onloadedmetadata doesn't trigger
                setTimeout(() => {
                    setupCanvas();
                    resolve(true);
                }, 1000);
            });
        } catch (error) {
            console.error('Error starting hand tracking camera:', error);
            if (modelStatusElem) modelStatusElem.textContent = 'Camera error';
            return false;
        }
    };
    
    // Stop hand camera
    const stopHandCamera = () => {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
            handVideo.srcObject = null;
            
            // Clear the canvas
            if (ctx) {
                ctx.clearRect(0, 0, handCanvas.width, handCanvas.height);
            }
        }
    };
    
    // Load handpose model
    const loadHandposeModel = async () => {
        if (modelStatusElem) modelStatusElem.textContent = 'Loading...';
        
        try {
            // Show loading progress
            let loadingProgress = 0;
            const loadingInterval = setInterval(() => {
                loadingProgress += 5;
                if (loadingProgress <= 90) {
                    if (modelProgressBar) modelProgressBar.style.width = `${loadingProgress}%`;
                }
            }, 100);
            
            // Load the model
            handposeModel = await handpose.load();
            
            // Initialize gesture estimator
            GE = new fp.GestureEstimator(createGestureDefinitions());
            
            clearInterval(loadingInterval);
            if (modelProgressBar) modelProgressBar.style.width = '100%';
            if (modelStatusElem) modelStatusElem.textContent = 'Ready';
            
            return true;
        } catch (error) {
            console.error('Error loading handpose model:', error);
            if (modelStatusElem) modelStatusElem.textContent = 'Failed to load';
            return false;
        }
    };
    
    // Draw hand landmarks on canvas
    const drawHandLandmarks = (landmarks) => {
        // Clear the canvas
        ctx.clearRect(0, 0, handCanvas.width, handCanvas.height);
        
        // No landmarks detected
        if (!landmarks || landmarks.length === 0) return;
        
        // Draw each landmark
        landmarks.forEach((landmark, index) => {
            const [x, y, z] = landmark;
            
            // Draw points
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(138, 43, 226, 0.7)';
            ctx.fill();
            
            // Draw more prominent points for fingertips (indices 4, 8, 12, 16, 20)
            if ([4, 8, 12, 16, 20].includes(index)) {
                ctx.beginPath();
                ctx.arc(x, y, 8, 0, 2 * Math.PI);
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
        
        // Draw connections between landmarks to form a hand skeleton
        const palmIndices = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8], // Index finger
            [0, 9], [9, 10], [10, 11], [11, 12], // Middle finger
            [0, 13], [13, 14], [14, 15], [15, 16], // Ring finger
            [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
            [0, 5], [5, 9], [9, 13], [13, 17] // Palm connections
        ];
        
        // Draw the skeleton
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.7)';
        ctx.lineWidth = 3;
        
        palmIndices.forEach(pair => {
            const [i1, i2] = pair;
            ctx.moveTo(landmarks[i1][0], landmarks[i1][1]);
            ctx.lineTo(landmarks[i2][0], landmarks[i2][1]);
        });
        
        ctx.stroke();
    };
    
    // Detect hand position and gestures
    const detectHand = async () => {
        if (!handposeModel || !isHandTrackingEnabled) return;
        
        try {
            const predictions = await handposeModel.estimateHands(handVideo);
            
            // Clear canvas if no hands
            if (predictions.length === 0) {
                ctx.clearRect(0, 0, handCanvas.width, handCanvas.height);
                if (handStatusElem) {
                    handStatusElem.textContent = 'No hands detected';
                    handStatusElem.classList.remove('active');
                }
                updateHandPosition(null);
                return;
            }
            
            // Hand detected
            if (handStatusElem) {
                handStatusElem.textContent = 'Hand detected';
                handStatusElem.classList.add('active');
            }
            
            // Get landmarks and update hand position
            const landmarks = predictions[0].landmarks;
            drawHandLandmarks(landmarks);
            updateHandPosition(landmarks);
            
            // Detect gestures if GE is available
            if (GE) {
                try {
                    const estimatedGestures = GE.estimate(landmarks, gestureSensitivity / 10);
                    
                    if (estimatedGestures.gestures && estimatedGestures.gestures.length > 0) {
                        // Sort by confidence score
                        const sortedGestures = estimatedGestures.gestures.sort((a, b) => b.score - a.score);
                        const gestureResult = sortedGestures[0];
                        
                        if (gestureResult.score > 7) { // Confidence threshold
                            // Add to gesture history for smoothing
                            gestureHistory.push(gestureResult.name);
                            if (gestureHistory.length > 10) {
                                gestureHistory.shift();
                            }
                            
                            // Get most frequent gesture in history
                            const gestureCount = {};
                            let maxCount = 0;
                            let maxGesture = 'None';
                            
                            gestureHistory.forEach(gesture => {
                                gestureCount[gesture] = (gestureCount[gesture] || 0) + 1;
                                if (gestureCount[gesture] > maxCount) {
                                    maxCount = gestureCount[gesture];
                                    maxGesture = gesture;
                                }
                            });
                            
                            // Only update if changed and majority
                            if (maxGesture !== lastDetectedGesture && maxCount >= 5) {
                                lastDetectedGesture = maxGesture;
                                updateDetectedGesture(maxGesture);
                                executeGestureCommand(maxGesture);
                            }
                        }
                    } else {
                        // No gesture detected
                        gestureHistory = [];
                        if (lastDetectedGesture !== 'None') {
                            lastDetectedGesture = 'None';
                            updateDetectedGesture('None');
                        }
                    }
                } catch (error) {
                    console.error("Error estimating gestures:", error);
                }
            }
        } catch (error) {
            console.error('Error detecting hand:', error);
        }
    };
    
    // Update displayed hand position coordinates
    const updateHandPosition = (landmarks) => {
        if (!landmarks) {
            if (handXElem) handXElem.textContent = '0';
            if (handYElem) handYElem.textContent = '0';
            if (handZElem) handZElem.textContent = '0';
            return;
        }
        
        // Use the wrist position (landmark 0) for tracking
        const [x, y, z] = landmarks[0];
        
        // Calculate change from previous position (for swipe detection)
        const deltaX = x - previousHandPosition.x;
        const deltaY = y - previousHandPosition.y;
        
        // Update previous position
        previousHandPosition = { x, y, z };
        
        // Update display (rounded to integers for readability)
        if (handXElem) handXElem.textContent = Math.round(x);
        if (handYElem) handYElem.textContent = Math.round(y);
        if (handZElem) handZElem.textContent = Math.round(z * 100) / 100; // More precision for Z
        
        // Detect swipes
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Right swipe
                executeGestureCommand('swipe_right');
            } else {
                // Left swipe
                executeGestureCommand('swipe_left');
            }
        }
        
        if (Math.abs(deltaY) > 40) {
            if (deltaY > 0) {
                // Down swipe
                executeGestureCommand('swipe_down');
            } else {
                // Up swipe
                executeGestureCommand('swipe_up');
            }
        }
    };
    
    // Update the displayed detected gesture
    const updateDetectedGesture = (gesture) => {
        if (!detectedGestureElem) return;
        
        // Format gesture name for display
        const formattedGesture = gesture
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        detectedGestureElem.textContent = formattedGesture;
        
        // Add gesture-specific animation
        if (gesture !== 'None') {
            detectedGestureElem.classList.add('gesture-detected');
            
            // Find and highlight the corresponding gesture card
            const gestureCards = document.querySelectorAll('.gesture-card');
            gestureCards.forEach(card => {
                card.classList.remove('active');
                if (card.querySelector('h4')) {
                    const cardGesture = card.querySelector('h4').textContent.toLowerCase();
                    
                    if (formattedGesture.toLowerCase().includes(cardGesture.toLowerCase())) {
                        card.classList.add('active');
                    }
                }
            });
            
            // Clear animation after a delay
            setTimeout(() => {
                detectedGestureElem.classList.remove('gesture-detected');
            }, 2000);
        } else {
            document.querySelectorAll('.gesture-card').forEach(card => {
                card.classList.remove('active');
            });
        }
    };
    
    // Execute commands based on detected gestures
    const executeGestureCommand = (gesture) => {
        console.log('Gesture command:', gesture);
        
        switch (gesture) {
            case 'peace':
                // Toggle play/pause the currently visible audio
                const audioElements = document.querySelectorAll('.therapy-card:not([style*="display: none"]) audio');
                if (audioElements.length > 0) {
                    const audio = audioElements[0];
                    const playButton = audio.parentElement.querySelector('.btn-therapy-play');
                    if (playButton) playButton.click();
                }
                break;
                
            case 'fist':
                // Stop all audio
                document.querySelectorAll('audio').forEach(audio => {
                    if (!audio.paused) {
                        audio.pause();
                        const playButton = audio.parentElement.querySelector('.btn-therapy-play');
                        if (playButton) {
                            playButton.innerHTML = '<i class="fas fa-play"></i> Play';
                            playButton.classList.remove('playing');
                        }
                    }
                });
                break;
                
            case 'point_up':
                // Increase volume
                const visibleAudioUp = document.querySelector('.therapy-card:not([style*="display: none"]) audio');
                if (visibleAudioUp) {
                    const volumeSlider = visibleAudioUp.parentElement.querySelector('.volume-slider');
                    if (volumeSlider && volumeSlider.value < 1) {
                        volumeSlider.value = Math.min(1, parseFloat(volumeSlider.value) + 0.1);
                        visibleAudioUp.volume = volumeSlider.value;
                    }
                }
                break;
                
            case 'point_down':
                // Decrease volume
                const visibleAudioDown = document.querySelector('.therapy-card:not([style*="display: none"]) audio');
                if (visibleAudioDown) {
                    const volumeSlider = visibleAudioDown.parentElement.querySelector('.volume-slider');
                    if (volumeSlider && volumeSlider.value > 0) {
                        volumeSlider.value = Math.max(0, parseFloat(volumeSlider.value) - 0.1);
                        visibleAudioDown.volume = volumeSlider.value;
                    }
                }
                break;
                
            case 'open_palm':
                // Select current element (similar to clicking)
                // Simplified implementation - just click a visible button
                const visibleButtons = Array.from(document.querySelectorAll('button:not([style*="display: none"])'))
                    .filter(btn => {
                        const rect = btn.getBoundingClientRect();
                        return rect.top > 0 && rect.left > 0 && 
                               rect.bottom < window.innerHeight && 
                               rect.right < window.innerWidth;
                    });
                if (visibleButtons.length > 0) {
                    // Click the most central button
                    visibleButtons[Math.floor(visibleButtons.length / 2)].click();
                }
                break;
                
            case 'thumbs_up':
                // Confirm or like - could send a positive feedback to server
                console.log("Thumbs up gesture detected - positive feedback");
                break;
                
            case 'swipe_left':
                // Previous month in calendar
                const prevMonthBtn = document.getElementById('prev-month');
                if (prevMonthBtn && prevMonthBtn.offsetParent !== null) { // Check if visible
                    prevMonthBtn.click();
                }
                break;
                
            case 'swipe_right':
                // Next month in calendar
                const nextMonthBtn = document.getElementById('next-month');
                if (nextMonthBtn && nextMonthBtn.offsetParent !== null) { // Check if visible
                    nextMonthBtn.click();
                }
                break;
                
            case 'swipe_up':
                // Start emotion tracking if visible
                const startEmotionBtn = document.getElementById('start-emotion-tracking');
                if (startEmotionBtn && startEmotionBtn.offsetParent !== null && 
                    startEmotionBtn.textContent.includes('Start')) {
                    startEmotionBtn.click();
                }
                break;
                
            case 'swipe_down':
                // Stop emotion tracking if running
                const stopEmotionBtn = document.getElementById('start-emotion-tracking');
                if (stopEmotionBtn && stopEmotionBtn.offsetParent !== null && 
                    stopEmotionBtn.textContent.includes('Stop')) {
                    stopEmotionBtn.click();
                }
                break;
        }
    };
    
    // Start hand tracking
    const startHandTracking = async () => {
        // Load model first if not loaded
        if (!handposeModel) {
            console.log("Loading hand pose model...");
            if (modelStatusElem) modelStatusElem.textContent = 'Loading model...';
            const modelLoaded = await loadHandposeModel();
            if (!modelLoaded) {
                console.error("Failed to load hand pose model");
                return;
            }
        }
        
        // Start camera
        console.log("Starting hand camera...");
        const cameraStarted = await startHandCamera();
        if (!cameraStarted) {
            console.error("Failed to start camera");
            return;
        }
        
        console.log("Hand tracking initialized successfully");
        isHandTrackingEnabled = true;
        
        // Start detection loop
        handTrackingInterval = setInterval(() => {
            detectHand();
        }, 100); // 10 fps is usually sufficient for hand tracking
    };
    
    // Stop hand tracking
    const stopHandTracking = () => {
        console.log("Stopping hand tracking");
        isHandTrackingEnabled = false;
        clearInterval(handTrackingInterval);
        stopHandCamera();
        ctx.clearRect(0, 0, handCanvas.width, handCanvas.height);
        if (handStatusElem) {
            handStatusElem.textContent = 'Hand tracking disabled';
            handStatusElem.classList.remove('active');
        }
    };
    
    // Initialize event listeners
    const initEvents = () => {
        // Toggle hand tracking on/off
        if (gestureToggle) {
            gestureToggle.addEventListener('change', () => {
                console.log("Gesture toggle changed:", gestureToggle.checked);
                if (gestureToggle.checked) {
                    startHandTracking();
                } else {
                    stopHandTracking();
                }
            });
        }
        
        // Update sensitivity
        if (sensitivitySlider) {
            sensitivitySlider.addEventListener('input', () => {
                gestureSensitivity = parseInt(sensitivitySlider.value);
                console.log("Sensitivity changed to:", gestureSensitivity);
            });
        }
    };
    
    // Initialize everything
    console.log("Initializing hand gesture tracking...");
    initEvents();
    
    // Pre-load model when page is idle
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            loadHandposeModel().then(() => {
                console.log("Hand pose model pre-loaded");
                if (modelStatusElem) modelStatusElem.textContent = 'Model loaded (idle)';
            });
        });
    }
}

// Initialize Stress Relief Games
function initStressReliefGames() {
    console.log("Initializing stress relief games...");
    
    // Elements
    const gameOptions = document.querySelectorAll('.game-option');
    const gameTitle = document.getElementById('game-title');
    const gameStartBtn = document.getElementById('start-game');
    const gameStartOverlay = document.getElementById('game-start-overlay');
    const gameCanvas = document.getElementById('game-canvas');
    const gameVideo = document.getElementById('game-video');
    const gameHandCanvas = document.getElementById('game-hand-canvas');
    const gameCrosshair = document.getElementById('game-crosshair');
    const gameScore = document.getElementById('game-score');
    const gameHandStatus = document.getElementById('game-hand-status');
    const gameGesture = document.getElementById('game-gesture');
    const toggleGameCameraBtn = document.getElementById('toggle-game-camera');
    const gameFeedback = document.getElementById('game-feedback');
    const ammoCounter = document.getElementById('ammo-counter');
    const reloadHint = document.querySelector('.reload-hint');
    const ammoItems = document.querySelectorAll('.ammo-bullet');
    
    // Game state
    let gameActive = false;
    let gameStream = null;
    let gameContext = null;
    let handposeModel = null;
    let gameHandCtx = null;
    let score = 0;
    let targets = [];
    let gameInterval = null;
    let detectionInterval = null;
    let lastShootTime = 0;
    let ammo = 6;
    let currentGame = 'shooter';
    
    // Check if elements exist
    if (!gameCanvas || !gameVideo || !gameHandCanvas) {
        console.log("Game elements not found, skipping initialization");
        return;
    }
    
    console.log("Game elements found, initializing...");
    
    // Sound effects
    const shotSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2014/2014-preview.mp3');
    const reloadSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3');
    const hitSound = new Audio('https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3');
    const emptySound = new Audio('https://assets.mixkit.co/active_storage/sfx/157/157-preview.mp3');
    
    // Initialize game canvas
    gameContext = gameCanvas.getContext('2d');
    
    // Set canvas dimensions
    const resizeCanvas = () => {
        if (gameCanvas.parentElement) {
            gameCanvas.width = gameCanvas.parentElement.clientWidth;
            gameCanvas.height = gameCanvas.parentElement.clientHeight;
        }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Initialize hand canvas
    gameHandCtx = gameHandCanvas.getContext('2d');
    
    // Set hand canvas dimensions to match game canvas
    const resizeHandCanvas = () => {
        if (gameCanvas) {
            gameHandCanvas.width = gameCanvas.width;
            gameHandCanvas.height = gameCanvas.height;
        }
    };
    
    window.addEventListener('resize', resizeHandCanvas);
    resizeHandCanvas();
    
    // Game option selection
    if (gameOptions) {
        gameOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                gameOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to selected option
                option.classList.add('active');
                
                // Update game title
                const gameName = option.getAttribute('data-game');
                if (gameTitle) {
                    currentGame = gameName;
                    switch (gameName) {
                        case 'shooter':
                            gameTitle.textContent = 'Gesture Shooter';
                            break;
                        case 'balloon':
                            gameTitle.textContent = 'Balloon Pop';
                            break;
                        case 'ninja':
                            gameTitle.textContent = 'Ninja Slice';
                            break;
                    }
                }
                
                // Reset game if it's running
                if (gameActive) {
                    stopGame();
                    startGame();
                }
            });
        });
    }
    
    // Toggle game camera
    if (toggleGameCameraBtn) {
        toggleGameCameraBtn.addEventListener('click', () => {
            if (gameStream) {
                stopGameCamera();
                toggleGameCameraBtn.textContent = 'Enable Camera';
            } else {
                startGameCamera();
                toggleGameCameraBtn.textContent = 'Disable Camera';
            }
        });
    }
    
    // Start game button
    if (gameStartBtn) {
        gameStartBtn.addEventListener('click', startGame);
    }
    
    // Start game camera
    async function startGameCamera() {
        try {
            console.log("Starting game camera...");
            gameStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 640,
                    height: 480,
                    facingMode: 'user'
                }
            });
            
            if (gameVideo) {
                gameVideo.srcObject = gameStream;
                await gameVideo.play();
                
                // Load handpose model if not already loaded
                if (!handposeModel) {
                    if (gameHandStatus) gameHandStatus.textContent = 'Loading model...';
                    
                    try {
                        console.log("Loading handpose model for game...");
                        handposeModel = await handpose.load();
                        console.log("Handpose model loaded successfully");
                        if (gameHandStatus) gameHandStatus.textContent = 'Model loaded';
                        
                        // Start hand detection
                        startHandDetection();
                    } catch (error) {
                        console.error('Error loading handpose model:', error);
                        if (gameHandStatus) gameHandStatus.textContent = 'Model loading failed';
                    }
                } else {
                    console.log("Using existing handpose model");
                    // Start hand detection
                    startHandDetection();
                }
            }
        } catch (error) {
            console.error('Error starting game camera:', error);
            if (gameHandStatus) gameHandStatus.textContent = 'Camera error';
        }
    }
    
    // Stop game camera
    function stopGameCamera() {
        console.log("Stopping game camera...");
        if (gameStream) {
            gameStream.getTracks().forEach(track => track.stop());
            gameStream = null;
            
            if (gameVideo) {
                gameVideo.srcObject = null;
            }
            
            // Stop hand detection
            stopHandDetection();
            
            // Reset game UI
            if (gameCrosshair) gameCrosshair.style.display = 'none';
            if (gameHandStatus) gameHandStatus.textContent = 'Camera disabled';
            if (gameGesture) gameGesture.textContent = 'None';
        }
    }
    
    // Start hand detection
    function startHandDetection() {
        console.log("Starting hand detection for game...");
        if (detectionInterval) clearInterval(detectionInterval);
        
        detectionInterval = setInterval(async () => {
            if (handposeModel && gameVideo && gameHandCtx) {
                try {
                    const predictions = await handposeModel.estimateHands(gameVideo);
                    
                    // Clear previous drawings
                    gameHandCtx.clearRect(0, 0, gameHandCanvas.width, gameHandCanvas.height);
                    
                    if (predictions.length > 0) {
                        // Update hand status
                        if (gameHandStatus) gameHandStatus.textContent = 'Hand detected';
                        
                        // Draw hand landmarks
                        drawGameHandLandmarks(predictions[0].landmarks);
                        
                        // Detect gestures
                        const gesture = detectGameGesture(predictions[0].landmarks);
                        if (gameGesture) gameGesture.textContent = gesture;
                        
                        // Update crosshair position to hand position
                        const palmPosition = predictions[0].landmarks[0]; // Wrist position
                        if (gameCrosshair) {
                            gameCrosshair.style.display = 'block';
                            gameCrosshair.style.left = `${palmPosition[0]}px`;
                            gameCrosshair.style.top = `${palmPosition[1]}px`;
                        }
                        
                        // Execute game actions based on gesture
                        executeGameAction(gesture, palmPosition);
                    } else {
                        // No hand detected
                        if (gameHandStatus) gameHandStatus.textContent = 'No hand detected';
                        if (gameGesture) gameGesture.textContent = 'None';
                        if (gameCrosshair) gameCrosshair.style.display = 'none';
                    }
                } catch (error) {
                    console.error('Error detecting hand in game:', error);
                }
            }
        }, 100); // 10 fps
    }
    
    // Stop hand detection
    function stopHandDetection() {
        console.log("Stopping hand detection for game...");
        if (detectionInterval) {
            clearInterval(detectionInterval);
            detectionInterval = null;
        }
    }
    
    // Draw hand landmarks on canvas
    function drawGameHandLandmarks(landmarks) {
        if (!gameHandCtx) return;
        
        // Draw points
        landmarks.forEach((landmark, index) => {
            const [x, y] = landmark;
            
            gameHandCtx.beginPath();
            gameHandCtx.arc(x, y, 5, 0, 2 * Math.PI);
            gameHandCtx.fillStyle = index === 8 ? 'red' : 'rgba(255, 255, 255, 0.7)'; // Highlight index finger
            gameHandCtx.fill();
        });
        
        // Draw connections
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8], // Index finger
            [0, 9], [9, 10], [10, 11], [11, 12], // Middle finger
            [0, 13], [13, 14], [14, 15], [15, 16], // Ring finger
            [0, 17], [17, 18], [18, 19], [19, 20] // Pinky finger
        ];
        
        gameHandCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        gameHandCtx.lineWidth = 2;
        
        connections.forEach(([i, j]) => {
            gameHandCtx.beginPath();
            gameHandCtx.moveTo(landmarks[i][0], landmarks[i][1]);
            gameHandCtx.lineTo(landmarks[j][0], landmarks[j][1]);
            gameHandCtx.stroke();
        });
    }
    
    // Detect hand gesture for the game
    function detectGameGesture(landmarks) {
        // Finger tips
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];
        
        // Finger bases (middle joints)
        const indexBase = landmarks[5];
        const middleBase = landmarks[9];
        const ringBase = landmarks[13];
        const pinkyBase = landmarks[17];
        
        // Check if fingers are extended by comparing y coordinates (lower y means higher up)
        const indexExtended = indexTip[1] < indexBase[1] - 40;
        const middleExtended = middleTip[1] < middleBase[1] - 40;
        const ringExtended = ringTip[1] < ringBase[1] - 40;
        const pinkyExtended = pinkyTip[1] < pinkyBase[1] - 40;
        
        // Calculate distances for thumb position
        const thumbToIndexDistance = Math.sqrt(
            Math.pow(thumbTip[0] - indexTip[0], 2) + 
            Math.pow(thumbTip[1] - indexTip[1], 2)
        );
        
        // Gun gesture - index extended, thumb up, others curled
        if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && 
            thumbTip[1] < landmarks[2][1]) {
            return 'Gun';
        }
        
        // Point gesture - only index extended
        if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            return 'Point';
        }
        
        // Fist gesture - all fingers curled
        if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            return 'Fist';
        }
        
        // Open palm - all fingers extended
        if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
            return 'Open Palm';
        }
        
        // Peace gesture - index and middle fingers extended
        if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
            return 'Peace';
        }
        
        // Default
        return 'Unknown';
    }
    
    // Execute game action based on detected gesture
    function executeGameAction(gesture, position) {
        if (!gameActive) return;
        
        const now = Date.now();
        
        switch (gesture) {
            case 'Gun':
                // Shoot target
                if (now - lastShootTime > 500 && ammo > 0) { // Rate limit shooting
                    shootTarget(position);
                    lastShootTime = now;
                }
                break;
                
            case 'Fist':
                // Reload
                if (ammo < 6) {
                    reloadWeapon();
                }
                break;
        }
    }
    
    // Start the game
    function startGame() {
        console.log("Starting game...");
        if (!gameStream) {
            showGameFeedback('Camera required!');
            return;
        }
        
        if (gameStartOverlay) gameStartOverlay.style.display = 'none';
        
        // Reset game state
        gameActive = true;
        score = 0;
        ammo = 6;
        targets = [];
        
        // Update UI
        if (gameScore) gameScore.textContent = '0';
        updateAmmoDisplay();
        
        // Start game loop
        if (gameInterval) clearInterval(gameInterval);
        
        // Game loop - create targets periodically
        gameInterval = setInterval(() => {
            if (targets.length < 5) { // Limit number of targets
                createTarget();
            }
        }, 1500);
        
        // Start the render loop
        requestAnimationFrame(renderGame);
    }
    
    // Stop the game
    function stopGame() {
        console.log("Stopping game...");
        gameActive = false;
        
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
        
        // Clear targets
        targets = [];
        
        // Show the start overlay
        if (gameStartOverlay) gameStartOverlay.style.display = 'flex';
    }
    
    // Create a new target
    function createTarget() {
        if (!gameCanvas) return;
        
        const size = Math.random() * 30 + 30; // Random size between 30-60px
        const x = Math.random() * (gameCanvas.width - size * 2) + size;
        const y = Math.random() * (gameCanvas.height - size * 2) + size;
        const speed = Math.random() * 2 + 1; // Random speed
        const direction = Math.random() * Math.PI * 2; // Random direction in radians
        
        targets.push({
            x,
            y,
            size,
            speed,
            direction,
            hit: false,
            createdAt: Date.now()
        });
    }
    
    // Shoot at a target
    function shootTarget(position) {
        if (ammo <= 0) {
            // Play empty sound
            emptySound.currentTime = 0;
            emptySound.play();
            
            // Show reload hint
            if (reloadHint) reloadHint.classList.add('show');
            return;
        }
        
        // Decrease ammo
        ammo--;
        updateAmmoDisplay();
        
        // Play shot sound
        shotSound.currentTime = 0;
        shotSound.play();
        
        // Create flash effect
        createFlashEffect();
        
        // Check if we hit any target
        let hit = false;
        targets.forEach(target => {
            if (!target.hit) {
                const distance = Math.sqrt(
                    Math.pow(target.x - position[0], 2) + 
                    Math.pow(target.y - position[1], 2)
                );
                
                if (distance < target.size) {
                    target.hit = true;
                    hit = true;
                    
                    // Play hit sound
                    hitSound.currentTime = 0;
                    hitSound.play();
                    
                    // Increase score
                    score += 10;
                    if (gameScore) gameScore.textContent = score;
                    
                    // Show hit feedback
                    showGameFeedback('+10!');
                }
            }
        });
        
        if (!hit) {
            // Miss feedback
            showGameFeedback('Miss!');
        }
        
        // Check if out of ammo
        if (ammo === 0) {
            if (reloadHint) reloadHint.classList.add('show');
        }
    }
    
    // Reload weapon
    function reloadWeapon() {
        // Play reload sound
        reloadSound.currentTime = 0;
        reloadSound.play();
        
        // Reload animation and state update
        ammo = 6;
        updateAmmoDisplay();
        
        // Hide reload hint
        if (reloadHint) reloadHint.classList.remove('show');
        
        // Feedback
        showGameFeedback('Reloaded!');
    }
    
    // Update ammo display
    function updateAmmoDisplay() {
        if (!ammoItems) return;
        
        // Update each bullet in the ammo counter
        ammoItems.forEach((bullet, index) => {
            if (index < ammo) {
                bullet.classList.remove('empty');
            } else {
                bullet.classList.add('empty');
            }
        });
    }
    
    // Show game feedback
    function showGameFeedback(message) {
        if (!gameFeedback) return;
        
        gameFeedback.textContent = message;
        gameFeedback.classList.add('show');
        
        // Remove after animation
        setTimeout(() => {
            gameFeedback.classList.remove('show');
        }, 1000);
    }
    
    // Create flash effect for shooting
    function createFlashEffect() {
        const flash = document.createElement('div');
        flash.classList.add('flash');
        
        if (gameCanvas && gameCanvas.parentElement) {
            gameCanvas.parentElement.appendChild(flash);
            
            // Trigger animation
            setTimeout(() => {
                flash.classList.add('active');
            }, 0);
            
            // Remove after animation
            setTimeout(() => {
                flash.remove();
            }, 150);
        }
    }
    
    // Game rendering loop
    function renderGame() {
        if (!gameContext || !gameCanvas) return;
        
        // Clear canvas
        gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        
        // Update and render targets
        const now = Date.now();
        
        targets = targets.filter(target => {
            // Skip already hit targets after animation time
            if (target.hit && now - target.hitTime > 300) {
                return false;
            }
            
            // Remove targets that are too old (5 seconds)
            if (now - target.createdAt > 5000 && !target.hit) {
                return false;
            }
            
            return true;
        });
        
        // Draw targets
        targets.forEach(target => {
            if (!target.hit) {
                // Move target
                target.x += Math.cos(target.direction) * target.speed;
                target.y += Math.sin(target.direction) * target.speed;
                
                // Bounce off walls
                if (target.x < target.size || target.x > gameCanvas.width - target.size) {
                    target.direction = Math.PI - target.direction;
                }
                if (target.y < target.size || target.y > gameCanvas.height - target.size) {
                    target.direction = -target.direction;
                }
            } else if (!target.hitTime) {
                target.hitTime = now;
            }
            
            // Draw target
            gameContext.beginPath();
            gameContext.arc(target.x, target.y, target.hit ? target.size * 1.5 : target.size, 0, Math.PI * 2);
            
            // Target gradient
            const gradient = gameContext.createRadialGradient(
                target.x, target.y, 0,
                target.x, target.y, target.size
            );
            
            if (target.hit) {
                gradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
                gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.8)');
                gradient.addColorStop(1, 'rgba(255, 0, 0, 0.3)');
            } else {
                gradient.addColorStop(0, 'white');
                gradient.addColorStop(0.3, 'red');
                gradient.addColorStop(0.6, 'darkred');
                gradient.addColorStop(1, 'black');
            }
            
            gameContext.fillStyle = gradient;
            gameContext.fill();
            
            // Draw target rings
            if (!target.hit) {
                gameContext.beginPath();
                gameContext.arc(target.x, target.y, target.size * 0.7, 0, Math.PI * 2);
                gameContext.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                gameContext.lineWidth = 2;
                gameContext.stroke();
                
                gameContext.beginPath();
                gameContext.arc(target.x, target.y, target.size * 0.4, 0, Math.PI * 2);
                gameContext.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                gameContext.lineWidth = 2;
                gameContext.stroke();
            }
        });
        
        // Continue the game loop if active
        if (gameActive) {
            requestAnimationFrame(renderGame);
        }
    }
    
    // Clean up resources when leaving the page
    window.addEventListener('beforeunload', () => {
        stopGameCamera();
        stopGame();
    });
}

// Background Music Player
function initBackgroundMusic() {
    console.log("Initializing background music player");
    
    // Get DOM elements
    const musicPanel = document.querySelector('.background-music-panel');
    const audioPlayer = document.getElementById('music-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('music-progress');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const songItems = document.querySelectorAll('.song-item');
    
    // Verify elements
    console.log("Music Player Elements:");
    console.log("- Audio Player:", audioPlayer ? "Found" : "Not Found");
    console.log("- Play Button:", playBtn ? "Found" : "Not Found");
    console.log("- Song Items:", songItems.length);
    
    if (!audioPlayer || !playBtn || songItems.length === 0) {
        console.warn("Some background music elements not found. Music player may not function correctly.");
    }
    
    // Create audio element if not present
    let audio = audioPlayer || new Audio();
    
    // Music state
    let isPlaying = false;
    let currentSongIndex = 0;
    const songs = [];
    
    // Extract song information
    songItems.forEach((item, index) => {
        const songUrl = item.getAttribute('data-url');
        const songTitle = item.querySelector('.song-title').textContent;
        const songArtist = item.querySelector('.song-artist').textContent;
        
        if (songUrl) {
            songs.push({
                url: songUrl,
                title: songTitle,
                artist: songArtist,
                element: item
            });
            console.log(`Added song: ${songTitle} by ${songArtist}`);
        } else {
            console.warn(`Song at index ${index} has no URL`);
        }
    });
    
    // Format time in mm:ss
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    }
    
    // Update progress bar
    function updateProgress() {
        if (!audio || !progressBar || !currentTimeDisplay || !durationDisplay) return;
        
        try {
            const currentTime = audio.currentTime || 0;
            const duration = audio.duration || 0;
            
            if (isNaN(duration) || duration === 0) {
                progressBar.style.width = '0%';
                currentTimeDisplay.textContent = '0:00';
                durationDisplay.textContent = '0:00';
                return;
            }
            
            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            currentTimeDisplay.textContent = formatTime(currentTime);
            durationDisplay.textContent = formatTime(duration);
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    }
    
    // Load song
    function loadSong(songIndex) {
        try {
            if (songIndex < 0 || songIndex >= songs.length) {
                console.error(`Invalid song index: ${songIndex}. Max index: ${songs.length - 1}`);
                return;
            }
            
            currentSongIndex = songIndex;
            const song = songs[songIndex];
            
            console.log(`Loading song: ${song.title} (${song.url})`);
            
            // Remove active class from all songs
            songItems.forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to current song
            song.element.classList.add('active');
            
            // Set audio source
            audio.src = song.url;
            audio.load();
            
            // Update player info if elements exist
            const titleElement = document.getElementById('current-song-title');
            const artistElement = document.getElementById('current-song-artist');
            
            if (titleElement) titleElement.textContent = song.title;
            if (artistElement) artistElement.textContent = song.artist;
            
            // Auto-play if already playing
            if (isPlaying) {
                playAudio();
            }
        } catch (error) {
            console.error(`Error loading song at index ${songIndex}:`, error);
        }
    }
    
    // Play audio
    function playAudio() {
        try {
            // If we have an audio element but no src, load the first song
            if ((!audio.src || audio.src === '') && songs.length > 0) {
                loadSong(0);
            }
            
            // Make sure we have a valid source
            if (!audio.src || audio.src === '') {
                console.error("No audio source available to play");
                return;
            }
            
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        isPlaying = true;
                        console.log("Audio playback started successfully");
                        
                        if (playBtn && pauseBtn) {
                            playBtn.style.display = 'none';
                            pauseBtn.style.display = 'inline-block';
                        }
                    })
                    .catch(error => {
                        console.error("Error playing audio:", error);
                        
                        // Most common error: browser requires user interaction
                        if (error.name === 'NotAllowedError') {
                            alert("Auto-play is disabled. Please click play to start music.");
                        }
                    });
            }
        } catch (error) {
            console.error("Error in playAudio function:", error);
        }
    }
    
    // Pause audio
    function pauseAudio() {
        try {
            audio.pause();
            isPlaying = false;
            
            if (playBtn && pauseBtn) {
                playBtn.style.display = 'inline-block';
                pauseBtn.style.display = 'none';
            }
            console.log("Audio playback paused");
        } catch (error) {
            console.error("Error pausing audio:", error);
        }
    }
    
    // Play next song
    function nextSong() {
        console.log("Next song requested");
        const nextIndex = (currentSongIndex + 1) % songs.length;
        loadSong(nextIndex);
        playAudio();
    }
    
    // Play previous song
    function prevSong() {
        console.log("Previous song requested");
        const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(prevIndex);
        playAudio();
    }
    
    // Initialize audio event listeners
    function setupAudioEvents() {
        // Time update for progress bar
        audio.addEventListener('timeupdate', updateProgress);
        
        // When song ends, play next
        audio.addEventListener('ended', nextSong);
        
        // Listen for errors
        audio.addEventListener('error', (e) => {
            console.error("Audio playback error:", e);
            alert(`Failed to play "${songs[currentSongIndex]?.title}". The audio file may be unavailable or in an unsupported format.`);
            nextSong(); // Try the next song
        });
        
        // Update duration display when metadata is loaded
        audio.addEventListener('loadedmetadata', () => {
            console.log(`Song metadata loaded. Duration: ${audio.duration}s`);
            updateProgress();
        });
        
        console.log("Audio event listeners set up");
    }
    
    // Initialize controls
    function setupControls() {
        // Play button
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                playAudio();
            });
        }
        
        // Pause button
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                pauseAudio();
            });
        }
        
        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSong);
        }
        
        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSong);
        }
        
        // Progress bar click
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                if (!audio.duration) return;
                
                const width = progressContainer.clientWidth;
                const clickX = e.offsetX;
                const duration = audio.duration;
                
                audio.currentTime = (clickX / width) * duration;
                console.log(`Seek to ${audio.currentTime}s`);
            });
        }
        
        // Volume slider
        if (volumeSlider) {
            // Set initial volume
            const initialVolume = 0.7; // 70%
            audio.volume = initialVolume;
            volumeSlider.value = initialVolume * 100;
            
            volumeSlider.addEventListener('input', () => {
                const volume = volumeSlider.value / 100;
                audio.volume = volume;
                console.log(`Volume set to ${volume * 100}%`);
            });
        }
        
        // Song item clicks
        songItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                loadSong(index);
                playAudio();
            });
        });
        
        console.log("Music controls initialized");
    }
    
    // Initialize audio
    try {
        if (songs.length > 0) {
            console.log(`Found ${songs.length} songs. Loading first song.`);
            setupAudioEvents();
            setupControls();
            loadSong(0);
        } else {
            console.warn("No songs found for background music");
        }
    } catch (error) {
        console.error("Error initializing background music:", error);
    }
}

// Initialize statistics counters
function initStatisticsCounters() {
    const counterElements = document.querySelectorAll('.counter-value');
    let countersStarted = false;
    
    // Function to animate counters
    function animateCounters() {
        counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                counter.textContent = Math.round(current).toLocaleString();
                
                if (current < target) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            updateCounter();
        });
        
        countersStarted = true;
    }
    
    // Check if counters are in viewport
    function checkCounters() {
        if (countersStarted) return;
        
        const countersSection = document.querySelector('.statistics-counters');
        if (!countersSection) return;
        
        const rect = countersSection.getBoundingClientRect();
        const isInViewport = (
            rect.top <= window.innerHeight * 0.8 &&
            rect.bottom >= 0
        );
        
        if (isInViewport) {
            animateCounters();
        }
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', checkCounters);
    
    // Check on initial load
    checkCounters();
}

function initHelpChatbot() {
    const widget = document.getElementById('help-chatbot');
    const toggle = document.getElementById('help-chatbot-toggle');
    const closeBtn = document.getElementById('help-chatbot-close');
    const windowEl = document.getElementById('help-chatbot-window');
    const messagesEl = document.getElementById('help-chatbot-messages');
    const form = document.getElementById('help-chatbot-form');
    const input = document.getElementById('help-chatbot-input');
    const suggestionsEl = document.getElementById('help-chatbot-suggestions');

    if (!widget || !toggle || !windowEl || !messagesEl || !form || !input) {
        return;
    }

    const replies = [
        {
            keys: ['period', 'cycle', 'she sync', 'menstrual', 'tracker'],
            text: 'Use SHE SYNC to enter your last period date and cycle length. WellSync then estimates your next period and current phase. If a cycle looks irregular, you can book a consultation from the popup.'
        },
        {
            keys: ['emotion', 'face', 'camera', 'mood'],
            text: 'Open Emotion Tracker, allow camera access, then start tracking. WellSync reads facial cues and suggests wellness activities that match how you feel.'
        },
        {
            keys: ['sound', 'neuro', 'therapy', 'music', 'audio'],
            text: 'Sound Therapy plays neuroacoustic frequencies for focus, calm, and rest. Pick a session in that section and use headphones for the best effect.'
        },
        {
            keys: ['stress', 'game', 'relief'],
            text: 'Stress Relief has short games you can play when you need a break. Scroll to that section and choose a game to start.'
        },
        {
            keys: ['gesture', 'hand'],
            text: 'Hand Gestures uses your camera to recognize simple hand poses. Grant camera permission, then follow the on-screen cues.'
        },
        {
            keys: ['contact', 'doctor', 'appointment', 'book', 'help'],
            text: 'For questions or a consultation, use the Contact form at the bottom of the page. The appointment popup also appears if SHE SYNC notices an irregular cycle.'
        },
        {
            keys: ['hello', 'hi', 'hey'],
            text: 'Hi, I am WellSync Help. Ask me about period tracking, emotion detection, sound therapy, stress games, or how to contact the team.'
        }
    ];

    const suggestions = [
        'How does SHE SYNC work?',
        'How do I track emotions?',
        'What is sound therapy?',
        'How do I contact you?'
    ];

    let greeted = false;

    function addMessage(text, role) {
        const bubble = document.createElement('div');
        bubble.className = `help-chat-msg ${role}`;
        bubble.textContent = text;
        messagesEl.appendChild(bubble);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function answerFor(question) {
        const q = question.toLowerCase();
        const match = replies.find(entry => entry.keys.some(key => q.includes(key)));
        if (match) {
            return match.text;
        }
        return 'I can help with SHE SYNC, emotion tracking, sound therapy, stress games, hand gestures, and contacting the team. Try one of the suggested questions, or visit the Contact section.';
    }

    function sendQuestion(question) {
        const trimmed = question.trim();
        if (!trimmed) {
            return;
        }
        addMessage(trimmed, 'user');
        setTimeout(() => addMessage(answerFor(trimmed), 'bot'), 250);
        input.value = '';
    }

    function setOpen(isOpen) {
        windowEl.hidden = !isOpen;
        toggle.setAttribute('aria-expanded', String(isOpen));
        if (isOpen && !greeted) {
            addMessage('Hi, I am WellSync Help. Ask me how to use the trackers, sound therapy, or stress tools.', 'bot');
            greeted = true;
        }
        if (isOpen) {
            input.focus();
        }
    }

    suggestions.forEach(label => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.textContent = label;
        chip.addEventListener('click', () => {
            setOpen(true);
            sendQuestion(label);
        });
        suggestionsEl.appendChild(chip);
    });

    toggle.addEventListener('click', () => setOpen(windowEl.hidden));
    closeBtn.addEventListener('click', () => setOpen(false));
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        sendQuestion(input.value);
    });
}