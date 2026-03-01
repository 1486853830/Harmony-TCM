// ========================================
// Products Page JavaScript
// ========================================

document.addEventListener('componentsLoaded', function() {
    if (typeof initParticles === 'function') {
        initParticles();
    }
    if (typeof initNavigation === 'function') {
        initNavigation();
    }
    initScrollAnimations();
    initProductInteractions();
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

    // Observe product cards
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe feature items
    document.querySelectorAll('.feature-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe testimonial cards
    document.querySelectorAll('.testimonial-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`;
        observer.observe(card);
    });
}

// Initialize product interactions
function initProductInteractions() {
    const addToCartButtons = document.querySelectorAll('.product-footer .btn-primary');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Add to cart animation
            this.textContent = 'Added!';
            this.style.background = 'var(--gradient-gold)';
            this.style.color = 'var(--color-bg-primary)';
            
            // Show notification
            showNotification(`${productName} added to cart!`);
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.background = '';
                this.style.color = '';
            }, 2000);
        });
    });
}

// Show notification
function showNotification(message) {
    // Create notification element
    let notification = document.getElementById('cart-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cart-notification';
        notification.className = 'cart-notification';
        document.body.appendChild(notification);
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✓</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    notification.style.display = 'flex';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Add CSS for notification
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .cart-notification {
        position: fixed;
        top: 100px;
        right: 30px;
        background: var(--gradient-gold);
        color: var(--color-bg-primary);
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        display: none;
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-icon {
        font-size: 1.2rem;
        font-weight: bold;
    }
    
    .notification-text {
        font-weight: 500;
    }
`;
document.head.appendChild(style);
