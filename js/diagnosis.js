// ========================================
// AI Medical Diagnosis - Interactive Script
// ========================================

// API Configuration
const API_CONFIG = {
    baseURL: 'https://api.moark.com/v1',
    apiKey: 'QAJPCTPY0BHWLNHY4UZVB8UKC1ZHPME6BSGWFSUA',
    model: 'medgemma-4b-it',
    maxTokens: 512,
    temperature: 0.7
};

// State Management
let currentImage = null;
let isAnalyzing = false;

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeImageBtn = document.getElementById('removeImage');
const symptomInput = document.getElementById('symptomInput');
const diagnoseBtn = document.getElementById('diagnoseBtn');
const clearBtn = document.getElementById('clearBtn');
const resultSection = document.getElementById('resultSection');
const statusBadge = document.getElementById('statusBadge');
const thinkingProcess = document.getElementById('thinkingProcess');
const thinkingContent = document.getElementById('thinkingContent');
const diagnosisResult = document.getElementById('diagnosisResult');
const resultActions = document.getElementById('resultActions');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');

// Initialize
document.addEventListener('componentsLoaded', function() {
    initEventListeners();
    // initParticles and initNavigation are defined in script.js
    // They will be called if the script is loaded
    if (typeof initParticles === 'function') {
        initParticles();
    }
    if (typeof initNavigation === 'function') {
        initNavigation();
    }
});

// Event Listeners
function initEventListeners() {
    // Upload area events
    uploadArea.addEventListener('click', () => imageInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Image input
    imageInput.addEventListener('change', handleImageSelect);
    
    // Remove image
    removeImageBtn.addEventListener('click', removeImage);
    
    // Buttons
    diagnoseBtn.addEventListener('click', startDiagnosis);
    clearBtn.addEventListener('click', clearAll);
    downloadBtn.addEventListener('click', downloadReport);
    shareBtn.addEventListener('click', shareReport);
}

// Drag and Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImageFile(files[0]);
    }
}

// Image Selection
function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleImageFile(file);
    }
}

function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result;
        previewImg.src = currentImage;
        
        // Hide upload area and show preview
        uploadArea.style.display = 'none';
        imagePreview.style.display = 'block';
        
        // Add animation class
        imagePreview.classList.add('fade-in');
        setTimeout(() => {
            imagePreview.classList.remove('fade-in');
        }, 500);
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    currentImage = null;
    imageInput.value = '';
    previewImg.src = '';
    uploadArea.style.display = 'block';
    imagePreview.style.display = 'none';
}

// Clear All
function clearAll() {
    removeImage();
    symptomInput.value = '';
    resultSection.style.display = 'none';
}

// Start Diagnosis
async function startDiagnosis() {
    if (isAnalyzing) return;
    
    const symptoms = symptomInput.value.trim();
    
    if (!currentImage && !symptoms) {
        alert('Please upload an image or describe your symptoms');
        return;
    }
    
    isAnalyzing = true;
    updateUIState('analyzing');
    
    try {
        await callAIModel();
    } catch (error) {
        console.error('Diagnosis error:', error);
        updateUIState('error');
        alert('An error occurred during diagnosis. Please try again.');
    } finally {
        isAnalyzing = false;
    }
}

// Call AI Model
async function callAIModel() {
    const messages = [
        {
            role: 'system',
            content: 'You are a helpful and harmless medical AI assistant specializing in Traditional Chinese Medicine and modern healthcare. You should think step-by-step and provide detailed, accurate medical analysis. Always include appropriate disclaimers about consulting professional healthcare providers.'
        }
    ];
    
    // Build user message content
    const symptoms = symptomInput.value.trim();
    let userContent = [];
    
    // Add image if present
    if (currentImage) {
        userContent.push({
            type: 'image_url',
            image_url: {
                url: currentImage
            }
        });
    }
    
    // Build text prompt
    let textPrompt = '';
    if (currentImage && symptoms) {
        textPrompt = 'Please analyze this medical image and provide a detailed diagnosis. Additionally, the patient has these symptoms: ' + symptoms + '. Include possible conditions, recommended treatments, and when to seek professional medical help.';
    } else if (currentImage) {
        textPrompt = 'Please analyze this medical image and provide a detailed diagnosis including possible conditions, recommended treatments, and when to seek professional medical help.';
    } else if (symptoms) {
        textPrompt = 'Please analyze these symptoms and provide a detailed diagnosis including possible conditions, recommended treatments, and when to seek professional medical help: ' + symptoms;
    }
    
    userContent.push({
        type: 'text',
        text: textPrompt
    });
    
    // Add single user message
    messages.push({
        role: 'user',
        content: userContent
    });
    
    const response = await fetch(`${API_CONFIG.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_CONFIG.apiKey}`
        },
        body: JSON.stringify({
            messages: messages,
            model: API_CONFIG.model,
            stream: false,
            max_tokens: API_CONFIG.maxTokens,
            temperature: API_CONFIG.temperature
        })
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Handle non-streaming response
    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
        const message = data.choices[0].message;
        const content = message.content || '';
        
        // Display the result
        displayDiagnosisResult(content);
        
        // Show thinking process if available
        if (message.reasoning_content) {
            thinkingProcess.style.display = 'block';
            thinkingContent.textContent = message.reasoning_content;
        }
    }
    
    updateUIState('completed');
}

// Display Diagnosis Result
function displayDiagnosisResult(content) {
    diagnosisResult.innerHTML = `<div class="result-content-text">${formatMarkdown(content)}</div>`;
}

// Format Markdown-like content
function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}

// Update UI State
function updateUIState(state) {
    const btnText = diagnoseBtn.querySelector('.btn-text');
    const btnLoader = diagnoseBtn.querySelector('.btn-loader');
    
    switch (state) {
        case 'analyzing':
            resultSection.style.display = 'block';
            statusBadge.innerHTML = '<span class="status-icon">⚡</span><span class="status-text">Analyzing...</span>';
            statusBadge.className = 'status-badge';
            btnText.style.display = 'none';
            btnLoader.style.display = 'flex';
            diagnoseBtn.disabled = true;
            thinkingProcess.style.display = 'none';
            thinkingContent.textContent = '';
            break;
            
        case 'completed':
            statusBadge.innerHTML = '<span class="status-icon">✓</span><span class="status-text">Completed</span>';
            statusBadge.className = 'status-badge';
            statusBadge.style.background = 'rgba(76, 175, 80, 0.1)';
            statusBadge.style.borderColor = 'rgba(76, 175, 80, 0.3)';
            btnText.style.display = 'flex';
            btnLoader.style.display = 'none';
            diagnoseBtn.disabled = false;
            resultActions.style.display = 'flex';
            break;
            
        case 'error':
            statusBadge.innerHTML = '<span class="status-icon">✗</span><span class="status-text">Error</span>';
            statusBadge.className = 'status-badge';
            statusBadge.style.background = 'rgba(196, 30, 58, 0.1)';
            statusBadge.style.borderColor = 'rgba(196, 30, 58, 0.3)';
            btnText.style.display = 'flex';
            btnLoader.style.display = 'none';
            diagnoseBtn.disabled = false;
            break;
    }
}

// Download Report
function downloadReport() {
    const content = thinkingContent.textContent + '\n\n' + diagnosisResult.textContent;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-diagnosis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Share Report
async function shareReport() {
    const content = thinkingContent.textContent + '\n\n' + diagnosisResult.textContent;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Medical Diagnosis Report',
                text: content
            });
        } catch (err) {
            console.log('Share failed:', err);
            copyToClipboard(content);
        }
    } else {
        copyToClipboard(content);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Report copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy report');
    });
}
