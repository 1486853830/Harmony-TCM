// ========================================
// Harmony TCM Wellness - Interactive Script
// ========================================

document.addEventListener('componentsLoaded', function() {
    // Initialize all components after they are loaded
    initParticles();
    initNavigation();
    initScrollAnimations();
    initTestimonials();
    initElementInteractions();
    initParallax();
});

// ========================================
// Particle System
// ========================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let isActive = true;
    
    // Check for touch device - reduce particles on mobile
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const particleCount = isTouchDevice ? 15 : 30;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize, { passive: true });
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.growing = Math.random() > 0.5;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
            
            // Pulse size
            if (this.growing) {
                this.size += 0.01;
                if (this.size > 3) this.growing = false;
            } else {
                this.size -= 0.01;
                if (this.size < 0.5) this.growing = true;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Draw connections between nearby particles
    function drawConnections() {
        const maxDistance = 100;
        const maxConnections = 3;
        
        for (let i = 0; i < particles.length; i++) {
            let connections = 0;
            
            for (let j = i + 1; j < particles.length; j++) {
                if (connections >= maxConnections) break;
                
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    connections++;
                }
            }
        }
    }
    
    let frameCount = 0;
    function animate() {
        if (!isActive) return;
        
        frameCount++;
        // Render every 2nd frame for performance (30fps)
        if (frameCount % 2 === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            drawConnections();
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Visibility check - pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isActive = false;
            cancelAnimationFrame(animationId);
        } else {
            isActive = true;
            animate();
        }
    });
    
    animate();
}

// ========================================
// Navigation
// ========================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navToggle = document.querySelector('.nav-toggle');
    
    // Scroll effect for navbar
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Check if it's a hash link on the same page
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
            // For external page links, let default behavior work
        });
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }
    
    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

// ========================================
// Scroll Animations
// ========================================
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
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.product-card, .element-item, .feature-block, .section-header, .philosophy-content'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Add CSS for animate-in class
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// Testimonials Slider
// ========================================
function initTestimonials() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentIndex = 0;
    let intervalId;
    
    function showTestimonial(index) {
        cards.forEach((card, i) => {
            card.classList.remove('active');
            dots[i].classList.remove('active');
        });
        
        cards[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }
    
    function nextTestimonial() {
        const nextIndex = (currentIndex + 1) % cards.length;
        showTestimonial(nextIndex);
    }
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            resetInterval();
        });
    });
    
    // Auto-advance
    function startInterval() {
        intervalId = setInterval(nextTestimonial, 5000);
    }
    
    function resetInterval() {
        clearInterval(intervalId);
        startInterval();
    }
    
    startInterval();
    
    // Pause on hover
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(intervalId));
        slider.addEventListener('mouseleave', startInterval);
    }
}

// ========================================
// Five Elements Interactions
// ========================================
function initElementInteractions() {
    const elementItems = document.querySelectorAll('.element-item');
    const elementNodes = document.querySelectorAll('.element-node');
    
    const elementData = {
        wood: { color: '#4CAF50', name: 'Wood' },
        fire: { color: '#F44336', name: 'Fire' },
        earth: { color: '#795548', name: 'Earth' },
        metal: { color: '#9E9E9E', name: 'Metal' },
        water: { color: '#2196F3', name: 'Water' }
    };
    
    elementItems.forEach(item => {
        const element = item.dataset.element;
        
        item.addEventListener('mouseenter', () => {
            // Highlight corresponding node in diagram
            elementNodes.forEach(node => {
                if (node.classList.contains(`${element}-node`)) {
                    node.style.background = elementData[element].color;
                    node.style.color = '#fff';
                    node.style.transform = 'scale(1.2)';
                    node.style.boxShadow = `0 0 30px ${elementData[element].color}`;
                }
            });
        });
        
        item.addEventListener('mouseleave', () => {
            elementNodes.forEach(node => {
                node.style.background = '';
                node.style.color = '';
                node.style.transform = '';
                node.style.boxShadow = '';
            });
        });
    });
}

// ========================================
// Parallax Effects
// ========================================
function initParallax() {
    const heroVisual = document.querySelector('.hero-visual');
    const yinYang = document.querySelector('.yin-yang');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.3;
                
                if (heroVisual) {
                    heroVisual.style.transform = `translateY(calc(-50% + ${rate}px))`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
    
    // Mouse parallax for product cards
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ========================================
// Utility Functions
// ========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add smooth reveal for page load
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle button clicks with smooth feedback
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation keyframes
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);
