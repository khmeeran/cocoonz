/* ========================================
   COCOONZ — Premium Early Childhood
   Development Centre — JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // === HEADER SCROLL EFFECT ===
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleHeaderScroll() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // === MOBILE MENU ===
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');

    function openMobileMenu() {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    // === SMOOTH SCROLL FOR ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === SCROLL ANIMATIONS (Intersection Observer) ===
    const animateElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation for sibling elements
                const parent = entry.target.parentElement;
                const siblings = parent ? Array.from(parent.querySelectorAll('[data-animate]')) : [entry.target];
                const elementIndex = siblings.indexOf(entry.target);
                const delay = elementIndex >= 0 ? elementIndex * 100 : 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, Math.min(delay, 500));

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // === GALLERY LIGHTBOX ===
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <img src="" alt="Gallery image enlarged">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || 'Gallery image';
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // === CONTACT FORM HANDLING ===
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Simple validation
            if (!data.parentName || !data.phone || !data.childAge || !data.branch) {
                showFormNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Phone validation
            const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/;
            if (!phoneRegex.test(data.phone)) {
                showFormNotification('Please enter a valid phone number.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Show success message
                this.innerHTML = `
                    <div class="form-success">
                        <div class="form-success-icon">🎉</div>
                        <h3>Visit Booked Successfully!</h3>
                        <p>Thank you, ${data.parentName}! We'll contact you shortly to confirm your campus visit at our ${data.branch} branch.</p>
                    </div>
                `;
                showFormNotification('Your visit request has been submitted!', 'success');
            }, 1500);
        });
    }

    // === FORM NOTIFICATION ===
    function showFormNotification(message, type) {
        // Remove existing notification
        const existing = document.querySelector('.form-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `form-notification form-notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 24px;
            padding: 16px 24px;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 3000;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 350px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
        `;

        document.body.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }

    // === ACTIVE NAV LINK HIGHLIGHTING ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a:not(.nav-cta)');

    function highlightNavLink() {
        const scrollPos = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.style.color = 'var(--primary)';
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // === COUNTER ANIMATION FOR HERO STATS ===
    function animateCounters() {
        const counters = document.querySelectorAll('.hero-stat-number');

        counters.forEach(counter => {
            const text = counter.textContent;
            const hasPlus = text.includes('+');
            const target = parseInt(text.replace(/[^0-9]/g, ''));

            if (isNaN(target) || target === 0) return;

            let current = 0;
            const increment = Math.ceil(target / 60);
            const suffix = hasPlus ? '+' : '';

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = current + suffix;
            }, 30);
        });
    }

    // Run counter animation when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 500);
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const heroSection = document.getElementById('hero');
    if (heroSection) heroObserver.observe(heroSection);

    // === PARALLAX-LIKE EFFECT ON HERO (SUBTLE) ===
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset < window.innerHeight) {
            const scroll = window.pageYOffset;
            if (heroContent) {
                heroContent.style.transform = `translateY(${scroll * 0.15}px)`;
                heroContent.style.opacity = 1 - (scroll / (window.innerHeight * 0.8));
            }
        }
    }, { passive: true });

    // === LAZY LOAD IMAGES WITH FADE-IN ===
    const images = document.querySelectorAll('img[loading="lazy"]');

    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';

                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });

                // If already cached
                if (img.complete) {
                    img.style.opacity = '1';
                }

                imgObserver.unobserve(img);
            }
        });
    }, { rootMargin: '100px' });

    images.forEach(img => imgObserver.observe(img));

    // === KEYBOARD ACCESSIBILITY FOR GALLERY ===
    galleryItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'View image enlarged');

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });

    // === FAQ ACCORDION ===
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });

        // Keyboard accessibility
        question.setAttribute('tabindex', '0');
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });

    // === PARENTS FEEDBACK SYSTEM ===
    const feedbackFormToggle = document.getElementById('feedbackFormToggle');
    const feedbackFormWrapper = document.getElementById('feedbackFormWrapper');
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackFormCancel = document.getElementById('feedbackFormCancel');
    const ratingStars = document.querySelectorAll('.rating-star');
    const ratingLabel = document.getElementById('ratingLabel');
    const feedbackRating = document.getElementById('feedbackRating');
    const feedbackDisplayGrid = document.getElementById('feedbackDisplayGrid');
    const loadMoreFeedbackBtn = document.getElementById('loadMoreFeedbackBtn');
    const feedbackLoadMore = document.getElementById('feedbackLoadMore');

    const ratingLabels = [
        '',
        'Poor - Needs improvement',
        'Fair - Below expectations',
        'Good - Meets expectations',
        'Very Good - Above expectations',
        'Excellent - Outstanding!'
    ];

    // Toggle feedback form visibility
    if (feedbackFormToggle && feedbackFormWrapper) {
        feedbackFormToggle.addEventListener('click', () => {
            feedbackFormWrapper.classList.toggle('active');
            if (feedbackFormWrapper.classList.contains('active')) {
                feedbackFormWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Cancel button
    if (feedbackFormCancel && feedbackFormWrapper) {
        feedbackFormCancel.addEventListener('click', () => {
            feedbackFormWrapper.classList.remove('active');
            feedbackForm.reset();
            resetRatingStars();
        });
    }

    // Rating stars interaction
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            setActiveRating(rating);
        });

        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            highlightStars(rating);
            ratingLabel.textContent = ratingLabels[rating];
        });

        star.addEventListener('mouseleave', () => {
            const currentRating = parseInt(feedbackRating.value) || 0;
            if (currentRating > 0) {
                highlightStars(currentRating);
                ratingLabel.textContent = ratingLabels[currentRating];
            } else {
                resetStarsHighlight();
                ratingLabel.textContent = 'Select your rating';
            }
        });
    });

    function setActiveRating(rating) {
        feedbackRating.value = rating;
        highlightStars(rating);
        ratingStars.forEach(s => s.classList.add('active'));
        ratingLabel.textContent = ratingLabels[rating];
    }

    function highlightStars(count) {
        ratingStars.forEach((star, index) => {
            if (index < count) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    function resetStarsHighlight() {
        ratingStars.forEach(star => star.classList.remove('active'));
    }

    function resetRatingStars() {
        feedbackRating.value = '';
        resetStarsHighlight();
        ratingLabel.textContent = 'Select your rating';
    }

    // Feedback form submission - Save to Firebase Firestore
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Validation
            if (!data.parentName || !data.childName || !data.branch || !data.program || !data.rating || !data.category || !data.feedbackTitle || !data.feedbackText) {
                showFormNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (parseInt(data.rating) === 0) {
                showFormNotification('Please select a rating.', 'error');
                return;
            }

            // Create feedback object
            const feedback = {
                parentName: data.parentName.trim(),
                childName: data.childName.trim(),
                branch: data.branch,
                program: data.program,
                rating: parseInt(data.rating),
                category: data.category,
                feedbackTitle: data.feedbackTitle.trim(),
                feedbackText: data.feedbackText.trim(),
                date: new Date().toISOString(),
                approved: true // Auto-approve for now, can add moderation later
            };

            try {
                // Submit to Firebase Firestore
                if (typeof db !== 'undefined') {
                    await db.collection('parent_feedback').add(feedback);
                    showFormNotification('Thank you for your feedback! Your voice matters to us. 🦋', 'success');
                } else {
                    // Fallback to localStorage if Firebase not configured
                    const feedbacks = getStoredFeedbacks();
                    feedbacks.unshift({ ...feedback, id: Date.now() });
                    localStorage.setItem('cocoonz_parent_feedbacks', JSON.stringify(feedbacks));
                    showFormNotification('Thank you for your feedback!', 'success');
                }

                // Reset form
                this.reset();
                resetRatingStars();
                feedbackFormWrapper.classList.remove('active');

                // Refresh feedback display
                displayFeedbacks();
            } catch (error) {
                console.error('Error submitting feedback:', error);
                showFormNotification('Oops! Something went wrong. Please try again.', 'error');
            }
        });
    }

    function getStoredFeedbacks() {
        const stored = localStorage.getItem('cocoonz_parent_feedbacks');
        return stored ? JSON.parse(stored) : [];
    }

    async function displayFeedbacks() {
        const feedbacks = await getFeedbacks();

        if (!feedbackDisplayGrid) return;

        if (feedbacks.length === 0) {
            feedbackDisplayGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-mid);">
                    <div style="font-size: 3rem; margin-bottom: 16px;">💬</div>
                    <h3 style="font-family: var(--h-font); font-size: 1.3rem; font-weight: 700; margin-bottom: 8px; color: var(--text-dark);">No feedback yet</h3>
                    <p style="font-size: 0.95rem;">Be the first to share your experience with Cocoonz!</p>
                </div>
            `;
            if (feedbackLoadMore) feedbackLoadMore.style.display = 'none';
            return;
        }

        // Display first 6 feedbacks
        const displayCount = Math.min(6, feedbacks.length);
        renderFeedbackCards(feedbacks.slice(0, displayCount));

        // Show/hide load more button
        if (feedbackLoadMore) {
            if (feedbacks.length > 6) {
                feedbackLoadMore.style.display = 'block';
            } else {
                feedbackLoadMore.style.display = 'none';
            }
        }
    }

    async function getFeedbacks() {
        // Try Firebase first
        if (typeof db !== 'undefined') {
            try {
                const snapshot = await db.collection('parent_feedback')
                    .where('approved', '==', true)
                    .orderBy('date', 'desc')
                    .get();

                const feedbacks = [];
                snapshot.forEach(doc => {
                    feedbacks.push({ id: doc.id, ...doc.data() });
                });
                return feedbacks;
            } catch (error) {
                console.error('Error loading feedback from Firebase:', error);
            }
        }
        
        // Fallback to localStorage
        return getStoredFeedbacks();
    }

    function renderFeedbackCards(feedbacks) {
        if (!feedbackDisplayGrid) return;

        const cardsHTML = feedbacks.map(feedback => {
            const initials = feedback.parentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            const stars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);
            const date = new Date(feedback.date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            const branchLabels = {
                akshaya: 'Branch I – Akshaya',
                spkovil: 'Branch II – SP Kovil',
                maraimalai: 'Branch III – Maraimalai Nagar',
                siruseri: 'Branch L&T – Siruseri',
                singaperumalkoil: 'Branch V – Singaperumal Koil'
            };

            const categoryLabels = {
                teachers: 'Teachers & Staff',
                curriculum: 'Curriculum & Learning',
                facilities: 'Facilities & Environment',
                communication: 'Communication & Updates',
                overall: 'Overall Experience',
                improvement: 'Suggestions'
            };

            return `
                <div class="feedback-card" data-animate>
                    <div class="feedback-card-header">
                        <div class="feedback-avatar">${initials}</div>
                        <div class="feedback-author-info">
                            <div class="feedback-author-name">${escapeHtml(feedback.parentName)}</div>
                            <div class="feedback-child-info">Parent of ${escapeHtml(feedback.childName)}</div>
                        </div>
                    </div>
                    <div class="feedback-stars">${stars}</div>
                    <span class="feedback-category-badge">${categoryLabels[feedback.category] || feedback.category}</span>
                    <h4 class="feedback-title">${escapeHtml(feedback.feedbackTitle)}</h4>
                    <p class="feedback-text">${escapeHtml(feedback.feedbackText).substring(0, 200)}${feedback.feedbackText.length > 200 ? '...' : ''}</p>
                    <div class="feedback-footer">
                        <span class="feedback-branch">📍 ${branchLabels[feedback.branch] || feedback.branch}</span>
                        <span class="feedback-date">${date}</span>
                    </div>
                </div>
            `;
        }).join('');

        feedbackDisplayGrid.innerHTML = cardsHTML;

        // Re-observe new elements
        const animateElements = feedbackDisplayGrid.querySelectorAll('[data-animate]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

        animateElements.forEach(el => observer.observe(el));
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Load more feedbacks
    if (loadMoreFeedbackBtn) {
        loadMoreFeedbackBtn.addEventListener('click', async () => {
            const feedbacks = await getFeedbacks();
            const currentCount = feedbackDisplayGrid.querySelectorAll('.feedback-card').length;
            const nextCount = Math.min(currentCount + 6, feedbacks.length);

            renderFeedbackCards(feedbacks.slice(0, nextCount));

            if (nextCount >= feedbacks.length) {
                feedbackLoadMore.style.display = 'none';
            }
        });
    }

    // Initialize feedback display on page load
    displayFeedbacks();

    // === VIDEO LIGHTBOX ===
    const videoPlayBtn = document.getElementById('videoPlayBtn');
    const videoLightbox = document.getElementById('videoLightbox');
    const videoLightboxClose = document.getElementById('videoLightboxClose');
    const videoLightboxVideo = document.getElementById('videoLightboxVideo');

    if (videoPlayBtn) {
        videoPlayBtn.addEventListener('click', () => {
            videoLightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            videoLightboxVideo.play();
        });

        // Also allow clicking the entire showcase
        const videoShowcase = document.querySelector('.video-showcase');
        if (videoShowcase) {
            videoShowcase.addEventListener('click', () => {
                videoLightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                videoLightboxVideo.play();
            });
        }
    }

    function closeVideoLightbox() {
        videoLightbox.classList.remove('active');
        document.body.style.overflow = '';
        videoLightboxVideo.pause();
        videoLightboxVideo.currentTime = 0;
    }

    if (videoLightboxClose) {
        videoLightboxClose.addEventListener('click', closeVideoLightbox);
    }

    if (videoLightbox) {
        videoLightbox.addEventListener('click', (e) => {
            if (e.target === videoLightbox) {
                closeVideoLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeVideoLightbox();
    });

    // === PERFORMANCE: DEBOUNCE UTILITY ===
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

    // === PRELOAD CRITICAL IMAGES ===
    const criticalImages = [
        'images/1b7d0c11-d09f-4694-b3b4-3836959df83f.jpg',
        'images/43e9635f-a0e6-48cf-9adc-93765c4d7c3e.jpg'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // === CONSOLE BRANDING MESSAGE ===
    console.log(
        '%c🦋 Cocoonz — Premium Early Childhood Development Centre %c\nDesigned & developed by KR Neospark | https://krneospark.com\nTransforming visions into digital excellence ⚡',
        'background: linear-gradient(135deg, #5DADE2, #3498DB); color: white; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: bold;',
        'color: #5D6D7E; font-size: 11px; padding: 4px 0;'
    );
    console.log(
        '%c⚡ KR Neospark — Where ideas become reality. %c\nNeed a stunning website? Visit https://krneospark.com',
        'background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 10px 16px; border-radius: 6px; font-size: 12px; font-weight: bold;',
        'color: #667eea; font-size: 11px; padding: 4px 0;'
    );

});
