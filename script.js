// Navigation and Scroll Effects
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting initialization...'); // Debug log
    
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // Add animation classes to elements
    addAnimationClasses();

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });
    }

    // Active navigation link highlighting
    highlightActiveNavLink();

    // Typing animation for hero text
    typeWriter();
});

// Add animation classes to elements
function addAnimationClasses() {
    console.log('Adding animation classes...'); // Debug log
    
    // Timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    console.log('Found timeline items:', timelineItems.length); // Debug log
    timelineItems.forEach((item, index) => {
        if (index % 2 === 0) {
            item.classList.add('slide-in-left');
        } else {
            item.classList.add('slide-in-right');
        }
    });

    // Skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    console.log('Found skill categories:', skillCategories.length); // Debug log
    skillCategories.forEach(category => {
        category.classList.add('fade-in');
    });

    // Education items
    const educationItems = document.querySelectorAll('.education-item');
    console.log('Found education items:', educationItems.length); // Debug log
    educationItems.forEach(item => {
        item.classList.add('fade-in');
    });

    // About content
    const aboutText = document.querySelector('.about-text');
    const aboutContact = document.querySelector('.about-contact');
    if (aboutText) {
        aboutText.classList.add('slide-in-left');
        console.log('Added slide-in-left to about-text'); // Debug log
    }
    if (aboutContact) {
        aboutContact.classList.add('slide-in-right');
        console.log('Added slide-in-right to about-contact'); // Debug log
    }
}

// Highlight active navigation link based on scroll position
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Handle contact form submission
function handleFormSubmission() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    // Create loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual implementation)
    setTimeout(() => {
        // Show success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    // Add to document
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

// Remove notification
function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Typing animation for hero text
function typeWriter() {
    const textElement = document.querySelector('.hero-title');
    if (!textElement) return;

    const originalText = textElement.innerHTML;
    const text = textElement.textContent;
    textElement.innerHTML = '';
    
    let i = 0;
    const speed = 50;

    function type() {
        if (i < text.length) {
            textElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Restore original HTML with gradient text
            textElement.innerHTML = originalText;
        }
    }

    // Start typing animation after a short delay
    setTimeout(type, 1000);
}

// Parallax effect for hero section
function addParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 100;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Initialize counter animation
document.addEventListener('DOMContentLoaded', animateCounters);

// Lazy loading for images (if any are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Theme toggle functionality (for future implementation)
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', function() {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Search functionality (for future implementation)
function initSearch() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        // Implement search logic here
    });
}

// Print styles optimization
function optimizeForPrint() {
    window.addEventListener('beforeprint', function() {
        document.body.classList.add('printing');
    });

    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    lazyLoadImages();
    initThemeToggle();
    initSearch();
    optimizeForPrint();
});

// Performance optimization - debounce scroll events
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

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(function() {
    // Handle scroll events here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Error handling for missing elements
function safelyExecute(func) {
    try {
        func();
    } catch (error) {
        console.warn('Non-critical error:', error.message);
    }
}

// Service Worker registration (for future PWA implementation)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== 3D TILT EFFECTS =====
function init3DTiltEffects() {
    const tiltElements = document.querySelectorAll('.timeline-content, .skill-category, .education-item, .about-contact, .contact-form');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', handleTilt);
        element.addEventListener('mouseleave', resetTilt);
    });
}

function handleTilt(e) {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    element.style.transform = `
        translateY(-10px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
        scale(1.02)
    `;
    
    // Add dynamic shadow based on mouse position
    const shadowX = (x - centerX) / 10;
    const shadowY = (y - centerY) / 10;
    
    element.style.boxShadow = `
        ${shadowX}px ${shadowY}px 20px rgba(0, 0, 0, 0.1),
        0 15px 20px rgba(37, 99, 235, 0.1),
        0 0 0 1px rgba(37, 99, 235, 0.1)
    `;
}

function resetTilt(e) {
    const element = e.currentTarget;
    element.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
    element.style.boxShadow = '';
}

// ===== PARALLAX MOUSE EFFECT =====
function initParallaxMouse() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / 50;
        const moveY = (y - centerY) / 50;
        
        const heroGraphic = hero.querySelector('.hero-graphic');
        if (heroGraphic) {
            heroGraphic.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
}

// ===== MAGNETIC BUTTONS =====
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

// ===== SKILL ITEMS WAVE EFFECT =====
function initSkillWaveEffect() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            // Create wave effect for adjacent items
            const delay = index * 50;
            item.style.animation = `skillWave 0.6s ease ${delay}ms`;
        });
        
        item.addEventListener('animationend', () => {
            item.style.animation = '';
        });
    });
}

// ===== TIMELINE PROGRESS ANIMATION =====
function initTimelineProgress() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                item.style.animation = 'timelineSlideIn 0.8s ease forwards';
            }
        });
    }, { threshold: 0.5 });
    
    timelineItems.forEach(item => observer.observe(item));
}

// ===== COUNTER ANIMATION WITH BOUNCE =====
function initBouncyCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const suffix = counter.textContent.replace(/[0-9]/g, '');
                
                animateCounterWithBounce(counter, target, suffix);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounterWithBounce(counter, target, suffix) {
    let current = 0;
    const increment = target / 50;
    
    const updateCounter = () => {
        if (current < target) {
            current += increment;
            counter.textContent = Math.floor(current) + suffix;
            
            // Add bounce effect
            counter.style.transform = 'scale(1.2)';
            setTimeout(() => {
                counter.style.transform = 'scale(1)';
            }, 100);
            
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target + suffix;
            counter.style.transform = 'scale(1.1)';
            setTimeout(() => {
                counter.style.transform = 'scale(1)';
            }, 200);
        }
    };
    
    updateCounter();
}

// ===== INITIALIZE ALL 3D EFFECTS =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing features
    lazyLoadImages();
    initThemeToggle();
    initSearch();
    optimizeForPrint();
    
    // Initialize new 3D effects
    setTimeout(() => {
        init3DTiltEffects();
        initParallaxMouse();
        initMagneticButtons();
        initSkillWaveEffect();
        initTimelineProgress();
        initBouncyCounters();
    }, 1000);
});
