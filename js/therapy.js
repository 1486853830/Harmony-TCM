// ========================================
// TCM Therapy Page JavaScript
// ========================================

document.addEventListener('componentsLoaded', function() {
    if (typeof initParticles === 'function') {
        initParticles();
    }
    if (typeof initNavigation === 'function') {
        initNavigation();
    }
    initScrollAnimations();
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

    // Observe treatment items
    document.querySelectorAll('.treatment-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe process steps
    document.querySelectorAll('.process-step').forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-30px)';
        step.style.transition = `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`;
        observer.observe(step);
    });

    // Observe evidence cards
    document.querySelectorAll('.evidence-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe FAQ items
    document.querySelectorAll('.faq-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

// Add CSS class for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .process-step.animate-in {
        transform: translateX(0) !important;
    }
`;
document.head.appendChild(style);
