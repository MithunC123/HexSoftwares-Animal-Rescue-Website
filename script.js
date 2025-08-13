// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');
const amountButtons = document.querySelectorAll('.amount-btn');
const customAmountInput = document.getElementById('customAmount');
const donateBtn = document.querySelector('.donate-btn');
const contactForm = document.querySelector('.contact-form');
const statNumbers = document.querySelectorAll('.stat-number');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

// Intersection Observer for counter animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// Scroll animation for sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// Donation amount selection
let selectedAmount = 100; // Default amount

amountButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        amountButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update selected amount
        selectedAmount = parseInt(button.getAttribute('data-amount'));
        
        // Clear custom amount input
        customAmountInput.value = '';
        
        // Update donate button text
        updateDonateButtonText();
    });
});

// Custom amount input handling
customAmountInput.addEventListener('input', (e) => {
    const customAmount = parseInt(e.target.value);
    
    if (customAmount && customAmount > 0) {
        // Remove active class from all preset buttons
        amountButtons.forEach(btn => btn.classList.remove('active'));
        selectedAmount = customAmount;
    } else {
        // Reset to default if invalid
        selectedAmount = 100;
        amountButtons[2].classList.add('active'); // $100 button
    }
    
    updateDonateButtonText();
});

function updateDonateButtonText() {
    donateBtn.textContent = `Donate $${selectedAmount}`;
}

// Initialize donate button text
updateDonateButtonText();

// Donation button click handler
donateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Add loading state
    donateBtn.classList.add('loading');
    donateBtn.textContent = 'Processing...';
    
    // Simulate donation processing
    setTimeout(() => {
        donateBtn.classList.remove('loading');
        updateDonateButtonText();
        
        // Show success message
        showMessage('success', `Thank you for your generous donation of $${selectedAmount}! Your contribution will make a real difference in the lives of animals in need.`);
        
        // Optional: Reset form
        resetDonationForm();
    }, 2000);
});

function resetDonationForm() {
    selectedAmount = 100;
    customAmountInput.value = '';
    amountButtons.forEach(btn => btn.classList.remove('active'));
    amountButtons[2].classList.add('active'); // $100 button
    updateDonateButtonText();
}

// Contact form handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formObject = {};
    
    // Convert FormData to object
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Validate form
    if (validateContactForm(formObject)) {
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Sending...';
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Send Message';
            
            // Show success message
            showMessage('success', 'Thank you for your message! We\'ll get back to you within 24 hours.');
            
            // Reset form
            contactForm.reset();
        }, 2000);
    }
});

function validateContactForm(data) {
    const errors = [];
    
    if (!data.firstName.trim()) errors.push('First name is required');
    if (!data.lastName.trim()) errors.push('Last name is required');
    if (!data.email.trim()) errors.push('Email is required');
    if (!isValidEmail(data.email)) errors.push('Please enter a valid email address');
    if (!data.subject) errors.push('Please select a subject');
    if (!data.message.trim()) errors.push('Message is required');
    
    if (errors.length > 0) {
        showMessage('error', errors.join('<br>'));
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(type, message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = message;
    
    // Insert message after the form or donation section
    const targetSection = type === 'success' && message.includes('donation') 
        ? document.querySelector('.donation-card')
        : document.querySelector('.contact-form');
    
    if (targetSection) {
        targetSection.parentNode.insertBefore(messageElement, targetSection.nextSibling);
        
        // Scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.opacity = '0';
                messageElement.style.transition = 'opacity 0.5s ease';
                setTimeout(() => messageElement.remove(), 500);
            }
        }, 5000);
    }
}

// Gallery image loading optimization
const galleryImages = document.querySelectorAll('.gallery-item img');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.hasAttribute('data-src')) {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            }
            img.parentElement.style.opacity = '1';
            imageObserver.unobserve(img);
        }
    });
});

galleryImages.forEach(img => {
    img.parentElement.style.opacity = '0';
    img.parentElement.style.transition = 'opacity 0.5s ease';
    imageObserver.observe(img);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Smooth reveal animation for program cards
const programCards = document.querySelectorAll('.program-card');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 150);
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

programCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    cardObserver.observe(card);
});

// Interactive hover effects for gallery items
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery-overlay');
    
    item.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1)';
        overlay.style.background = 'linear-gradient(transparent, rgba(0, 0, 0, 0.9))';
    });
    
    item.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        overlay.style.background = 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))';
    });
});

// Dynamic footer year update
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-bottom p');
if (footerText) {
    footerText.innerHTML = footerText.innerHTML.replace('2024', currentYear);
}

// Add active navigation indicator based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            // Remove active class from all nav links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to current section nav link
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Navigate with arrow keys when donation amounts are focused
    if (document.activeElement.classList.contains('amount-btn')) {
        const currentIndex = Array.from(amountButtons).indexOf(document.activeElement);
        let nextIndex;
        
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                nextIndex = (currentIndex + 1) % amountButtons.length;
                amountButtons[nextIndex].focus();
                amountButtons[nextIndex].click();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                nextIndex = (currentIndex - 1 + amountButtons.length) % amountButtons.length;
                amountButtons[nextIndex].focus();
                amountButtons[nextIndex].click();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                document.activeElement.click();
                break;
        }
    }
});

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll-heavy functions
const debouncedScrollHandler = debounce(() => {
    // Any heavy scroll operations can go here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add initial classes for animations
    document.body.classList.add('loaded');
    
    // Set initial donation button state
    updateDonateButtonText();
    
    // Initialize any tooltips or other interactive elements
    console.log('Paws & Hearts website loaded successfully!');
});

// Error handling for images
galleryImages.forEach(img => {
    img.addEventListener('error', () => {
        img.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.innerHTML = '<i class="fas fa-image"></i><p>Image not available</p>';
        img.parentNode.appendChild(placeholder);
    });
});

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Social media share functionality
function shareOnSocialMedia(platform, url = window.location.href, text = 'Check out Paws & Hearts Animal Charity!') {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    let shareUrl;
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            break;
        default:
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// Add share functionality to social links if needed
const socialLinks = document.querySelectorAll('.social-links a');
socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href === '#') {
            // Extract platform from icon class
            const iconClass = link.querySelector('i').className;
            if (iconClass.includes('facebook')) {
                shareOnSocialMedia('facebook');
            } else if (iconClass.includes('twitter')) {
                shareOnSocialMedia('twitter');
            } else if (iconClass.includes('linkedin')) {
                shareOnSocialMedia('linkedin');
            }
        } else {
            window.open(href, '_blank');
        }
    });
});