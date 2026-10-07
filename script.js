// --- Self-contained Antigravity Portfolio Script ---

function initPortfolio() {
    // --- Global Elements ---
    const mainHeader = document.querySelector('.main-header');
    const currentYearSpan = document.getElementById('current-year');
    const progressBar = document.getElementById('scroll-progress-bar');
    const backToTopBtn = document.getElementById('back-to-top');
    const progressCircle = document.querySelector('.progress-ring-circle');

    // Current Year for Footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Interactive Ambient Canvas ---
    initAmbientCanvas('orb-canvas-container');

    // --- Gooey Nav Indicator ---
    const navLinksContainer = document.querySelector('.nav-links');
    const navIndicator = document.querySelector('.nav-indicator');
    const navItems = document.querySelectorAll('.nav-links li a');

    function moveIndicator(el) {
        if (!navLinksContainer || !navIndicator || !el) return;
        const containerRect = navLinksContainer.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const left = elRect.left - containerRect.left;
        navIndicator.style.transform = `translateX(${left}px)`;
        navIndicator.style.width = `${elRect.width}px`;
    }

    if (navLinksContainer && navIndicator) {
        const activeLink = document.querySelector('.nav-links a.active') || navItems[0];
        if (activeLink) {
            setTimeout(() => moveIndicator(activeLink.parentElement), 150);
        }

        navItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                moveIndicator(e.target.parentElement);
            });
        });

        navLinksContainer.addEventListener('mouseleave', () => {
            const currentActive = document.querySelector('.nav-links a.active') || navItems[0];
            if (currentActive) moveIndicator(currentActive.parentElement);
        });
    }

    // --- Smooth Scrolling for Navigation ---
    document.querySelectorAll('.nav-links a, .hero-ctas a, .site-logo, .get-in-touch-btn').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;
            
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;

            const headerOffset = mainHeader ? mainHeader.offsetHeight + 10 : 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
            const matchingLink = document.querySelector(`.nav-links a[href="${targetId}"]`);
            if (matchingLink) {
                matchingLink.classList.add('active');
                moveIndicator(matchingLink.parentElement);
            }
        });
    });

    // --- ScrollSpy & Scroll Progress Calculation ---
    const sections = document.querySelectorAll('section[id]');
    const circleRadius = 21;
    const circumference = 2 * Math.PI * circleRadius; // ~131.95
    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${circumference}`;
        progressCircle.style.strokeDashoffset = `${circumference}`;
    }

    const nav = document.querySelector('.glassmorphic-nav');

    function handleScrollEffects() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // 1. Top progress bar
        if (progressBar) {
            progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
        }

        // 2. Back to top button & progress ring
        if (progressCircle) {
            const offset = circumference - (scrollPercent / 100) * circumference;
            progressCircle.style.strokeDashoffset = `${offset}`;
        }

        if (backToTopBtn) {
            if (scrollTop > 350) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // 3. Navbar scroll state - Hide header after scrolling starts
        if (scrollTop > 50) {
            if (mainHeader) mainHeader.classList.add('header-hidden');
            if (nav) nav.classList.add('scrolled');
        } else {
            if (mainHeader) mainHeader.classList.remove('header-hidden');
            if (nav) nav.classList.remove('scrolled');
        }

        // 4. ScrollSpy: active section tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 180;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navItems.forEach(link => {
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    if (!link.classList.contains('active')) {
                        navItems.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                        moveIndicator(link.parentElement);
                    }
                }
            });
        }
    }

    window.addEventListener('scroll', handleScrollEffects, { passive: true });
    handleScrollEffects();

    // Back to top click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Contact Form Submission ---
    const contactForm = document.querySelector('.contact-form') || document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const name = formData.get('name') || 'Friend';
            const email = formData.get('email') || 'your email';
            alert(`Thanks for reaching out, ${name}!\nI'll get back to you at ${email} as soon as possible.`);
            contactForm.reset();
        });
    }

    // --- Magic Bento Spotlight Glare Effect for Cards ---
    const cards = document.querySelectorAll('.skill-card, .project-card, .project-showcase-card, .code-editor-section');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- GSAP Scroll-driven animations ---
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!reduceMotion) {
            // Hero entrance
            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            heroTl
                .from('.hero-name', { y: 50, opacity: 0, duration: 1 })
                .from('.hero-title', { y: 35, opacity: 0, duration: 0.8 }, '-=0.6')
                .from('.hero-tagline', { y: 25, opacity: 0, duration: 0.8 }, '-=0.5')
                .from('.hero-ctas', { y: 20, opacity: 0, duration: 0.7 }, '-=0.4')
                .from('.code-editor-section', {
                    y: 70,
                    opacity: 0,
                    rotateX: 12,
                    transformPerspective: 1000,
                    duration: 1.1
                }, '-=0.8');

            // About section
            gsap.from('.reveal-left', {
                x: -50,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.about-section', start: 'top 75%' }
            });
            gsap.from('.about-3d-stage', {
                x: 50,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.about-section', start: 'top 75%' }
            });

            // 3D Spatial Video Profile Card in About Section
            const aboutCard = document.getElementById('about-3d-card');
            const videoFill = document.querySelector('.video-progress-fill');
            const floatingBadges = document.querySelectorAll('.floating-badge');

            if (aboutCard) {
                // Parallax 3D Scroll Scrub - card pivots dynamically in 3D while scrolling through About
                gsap.fromTo(aboutCard,
                    {
                        rotateY: -16,
                        rotateX: 10,
                        y: 35,
                        scale: 0.95
                    },
                    {
                        rotateY: 16,
                        rotateX: -8,
                        y: -30,
                        scale: 1.02,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '.about-section',
                            start: 'top 85%',
                            end: 'bottom 15%',
                            scrub: 1.2,
                            onUpdate: (self) => {
                                if (videoFill) {
                                    videoFill.style.width = `${Math.min(100, Math.max(5, Math.round(self.progress * 100)))}%`;
                                }
                            }
                        }
                    }
                );

                // Multi-layered parallax depth on floating badges during scroll
                floatingBadges.forEach((badge, idx) => {
                    const depthSpeed = (idx + 1) * 15;
                    gsap.fromTo(badge,
                        { y: depthSpeed },
                        {
                            y: -depthSpeed,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: '.about-section',
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: true
                            }
                        }
                    );
                });

                // Real-time 3D cursor gyro tilt on mousemove
                const aboutStage = document.querySelector('.about-3d-stage');
                if (aboutStage) {
                    aboutStage.addEventListener('mousemove', (e) => {
                        const rect = aboutStage.getBoundingClientRect();
                        const x = e.clientX - rect.left - rect.width / 2;
                        const y = e.clientY - rect.top - rect.height / 2;
                        const tiltX = -(y / (rect.height / 2)) * 14;
                        const tiltY = (x / (rect.width / 2)) * 18;
                        gsap.to(aboutCard, {
                            rotateX: tiltX,
                            rotateY: tiltY,
                            duration: 0.3,
                            ease: 'power1.out',
                            transformPerspective: 1000
                        });
                    });

                    aboutStage.addEventListener('mouseleave', () => {
                        gsap.to(aboutCard, {
                            rotateX: 0,
                            rotateY: 0,
                            duration: 0.8,
                            ease: 'power2.out'
                        });
                    });
                }
            }

            // Skills cards: staggered 3D rise
            gsap.utils.toArray('.skill-category-group').forEach(group => {
                gsap.from(group.querySelectorAll('.reveal-card'), {
                    y: 45,
                    opacity: 0,
                    scale: 0.92,
                    rotateX: 10,
                    transformPerspective: 800,
                    duration: 0.75,
                    stagger: 0.08,
                    ease: 'power3.out',
                    scrollTrigger: { 
                        trigger: group, 
                        start: 'top 92%',
                        toggleActions: 'play none none none'
                    }
                });
            });

            // Projects Header
            gsap.from('.projects-header-block', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.projects-header-block', start: 'top 85%' }
            });

            // Projects cards: smooth entrance & perspective lift
            gsap.from('.projects-grid .project-showcase-card', {
                y: 60,
                opacity: 0,
                scale: 0.94,
                duration: 0.9,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' }
            });

            // Section headings: subtle gradient glow reveal
            gsap.utils.toArray('.section-heading').forEach(heading => {
                gsap.from(heading, {
                    y: 30,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: heading, start: 'top 90%' }
                });
            });
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}

// Helper for interactive ambient glowing canvas
function initAmbientCanvas(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const orbs = [
        { x: width * 0.25, y: height * 0.35, vx: 0.25, vy: 0.2, r: 260, color: 'rgba(0, 210, 255, 0.16)' },
        { x: width * 0.75, y: height * 0.45, vx: -0.2, vy: 0.25, r: 320, color: 'rgba(121, 40, 202, 0.18)' },
        { x: width * 0.5, y: height * 0.65, vx: 0.15, vy: -0.2, r: 240, color: 'rgba(255, 0, 128, 0.12)' }
    ];

    function animate() {
        ctx.clearRect(0, 0, width, height);
        orbs.forEach(orb => {
            orb.x += orb.vx;
            orb.y += orb.vy;

            if (orb.x < -orb.r) orb.x = width + orb.r;
            if (orb.x > width + orb.r) orb.x = -orb.r;
            if (orb.y < -orb.r) orb.y = height + orb.r;
            if (orb.y > height + orb.r) orb.y = -orb.r;

            const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
            grad.addColorStop(0, orb.color);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}
