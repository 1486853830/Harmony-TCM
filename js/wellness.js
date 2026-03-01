// ========================================
// Wellness Page JavaScript
// ========================================

document.addEventListener('componentsLoaded', function() {
    if (typeof initParticles === 'function') {
        initParticles();
    }
    if (typeof initNavigation === 'function') {
        initNavigation();
    }
    initScrollAnimations();
    initBodyTypeQuiz();
});

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe principle cards
    document.querySelectorAll('.principle-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe type cards
    document.querySelectorAll('.type-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe routine items
    document.querySelectorAll('.routine-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe season cards
    document.querySelectorAll('.season-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe tip cards
    document.querySelectorAll('.tip-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Initialize body type quiz (simple interactive element)
function initBodyTypeQuiz() {
    const typeCards = document.querySelectorAll('.type-card');
    
    typeCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            typeCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Scroll to recommendations
            const recommendations = this.querySelector('.type-recommendations');
            if (recommendations) {
                recommendations.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
}

// Add CSS for animations and active state
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .routine-item.animate-in {
        transform: translateX(0) !important;
    }
    
    .type-card {
        cursor: pointer;
    }
    
    .type-card.active {
        border-color: var(--color-accent) !important;
        box-shadow: 0 20px 40px rgba(212, 175, 55, 0.3) !important;
        transform: translateY(-10px) !important;
    }
    
    .type-card.active .type-header {
        background: rgba(212, 175, 55, 0.15);
    }
    
    .type-card.active .type-icon {
        animation: pulse 1s ease-in-out;
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
`;
document.head.appendChild(style);
