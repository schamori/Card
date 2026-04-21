/* ========================================
   CardTap — Interactive JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // Ambient Particle Background
    // ============================
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.hue = Math.random() > 0.5 ? 190 : 270; // blue or purple
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width ||
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles (fewer on mobile)
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections between close particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        animationId = requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // ============================
    // Navbar Scroll Effect
    // ============================
    const navbar = document.getElementById('navbar');

    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ============================
    // Mobile Menu
    // ============================
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============================
    // 3D Card Interaction
    // ============================
    const cardScene = document.getElementById('cardScene');
    const card3d = document.getElementById('card3d');
    const cardShine = document.getElementById('cardShine');
    const cardShineBack = document.getElementById('cardShineBack');
    let isFlipped = false;
    let isInteracting = false;
    let isDragging = false;
    let startX, startY;
    let currentRotateX = 5;
    let currentRotateY = -5;

    // Mouse-follow tilt
    cardScene.addEventListener('mouseenter', () => {
        isInteracting = true;
        card3d.classList.add('interacting');
    });

    cardScene.addEventListener('mousemove', (e) => {
        if (isFlipped) return;

        const rect = cardScene.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateY = (mouseX / (rect.width / 2)) * 20;
        const rotateX = -(mouseY / (rect.height / 2)) * 15;

        currentRotateX = rotateX;
        currentRotateY = rotateY;

        card3d.style.transform = `translateY(0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // Move shine
        const shineX = ((e.clientX - rect.left) / rect.width) * 100;
        const shineY = ((e.clientY - rect.top) / rect.height) * 100;
        cardShine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`;
    });

    cardScene.addEventListener('mouseleave', () => {
        isInteracting = false;
        if (!isFlipped) {
            card3d.classList.remove('interacting');
            card3d.style.transform = '';
            cardShine.style.background = '';
        }
    });

    // Touch support for 3D tilt
    cardScene.addEventListener('touchstart', (e) => {
        isDragging = true;
        isInteracting = true;
        card3d.classList.add('interacting');
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    }, { passive: true });

    cardScene.addEventListener('touchmove', (e) => {
        if (!isDragging || isFlipped) return;

        const touch = e.touches[0];
        const rect = cardScene.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = touch.clientX - centerX;
        const mouseY = touch.clientY - centerY;

        const rotateY = (mouseX / (rect.width / 2)) * 25;
        const rotateX = -(mouseY / (rect.height / 2)) * 20;

        card3d.style.transform = `translateY(0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        const shineX = ((touch.clientX - rect.left) / rect.width) * 100;
        const shineY = ((touch.clientY - rect.top) / rect.height) * 100;
        cardShine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`;
    }, { passive: true });

    cardScene.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Click to flip
    cardScene.addEventListener('click', (e) => {
        isFlipped = !isFlipped;
        card3d.classList.add('interacting');
        card3d.classList.toggle('flipped');

        if (isFlipped) {
            card3d.style.transform = `rotateY(180deg)`;
            card3d.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            card3d.style.transform = `rotateY(0deg) rotateX(${currentRotateX}deg)`;
            card3d.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        }

        // Reset transition after flip completes
        setTimeout(() => {
            if (!isFlipped) {
                card3d.style.transition = 'transform 0.1s ease-out';
                if (!isInteracting) {
                    card3d.classList.remove('interacting');
                    card3d.style.transform = '';
                }
            }
        }, 700);
    });

    // ============================
    // Scroll Reveal Animations
    // ============================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger siblings
                const parent = entry.target.parentElement;
                const siblings = Array.from(parent.querySelectorAll('.reveal'));
                const siblingIndex = siblings.indexOf(entry.target);
                const delay = siblingIndex * 80;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============================
    // Counter Animations
    // ============================
    const counters = document.querySelectorAll('.counter, .mini-stat-number');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // ============================
    // Smooth Scroll for Nav Links
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================
    // Tilt on Feature/Step Cards
    // ============================
    const tiltCards = document.querySelectorAll('.feature-card, .stat-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ============================
    // Active Nav Link Highlight
    // ============================
    const sections = document.querySelectorAll('.section, .hero');

    function updateActiveNav() {
        let current = '';
        const scrollPos = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ============================
    // Page Load Animation
    // ============================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // Trigger hero reveals
        const heroReveals = document.querySelectorAll('.hero .reveal');
        heroReveals.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, 200 + i * 120);
        });
    });

});
