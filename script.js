/* ============================================================
   Hà Thị Quỳnh — CV Landing Page
   JavaScript: Particles, Cursor Glow, Scroll Animations, 
   Navbar, Counters, Skill Bars
   ============================================================ */

// ===================== PARTICLES SYSTEM =====================
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const count = Math.min(80, Math.floor(window.innerWidth / 15));
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.5 + 0.1,
                // Pink / Purple / Blue palette
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(244,114,182,',  // pink
            'rgba(192,132,252,',  // purple
            'rgba(96,165,250,',   // blue
            'rgba(251,191,36,',   // gold
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap around edges
            if (p.x > this.canvas.width) p.x = 0;
            if (p.x < 0) p.x = this.canvas.width;
            if (p.y > this.canvas.height) p.y = 0;
            if (p.y < 0) p.y = this.canvas.height;

            // Mouse interaction
            if (this.mouse.x !== null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    p.x -= dx * force * 0.01;
                    p.y -= dy * force * 0.01;
                }
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + p.opacity + ')';
            this.ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    const lineOpacity = (1 - dist / 120) * 0.08;
                    this.ctx.strokeStyle = `rgba(244,114,182,${lineOpacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ===================== CURSOR GLOW =====================
class CursorGlow {
    constructor() {
        this.glow = document.getElementById('cursor-glow');
        if (!this.glow) return;
        
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        
        window.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });
        
        this.animate();
    }

    animate() {
        this.x += (this.targetX - this.x) * 0.08;
        this.y += (this.targetY - this.y) * 0.08;
        
        if (this.glow) {
            this.glow.style.left = this.x + 'px';
            this.glow.style.top = this.y + 'px';
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===================== NAVBAR =====================
class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.toggle = document.getElementById('nav-toggle');
        this.links = document.getElementById('nav-links');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Scroll handler
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        // Mobile toggle
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Update active link
        this.updateActiveLink();
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    toggleMenu() {
        this.toggle.classList.toggle('active');
        this.links.classList.toggle('active');
        this.toggle.setAttribute('aria-expanded', 
            this.toggle.classList.contains('active'));
    }

    closeMenu() {
        this.toggle.classList.remove('active');
        this.links.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
    }
}

// ===================== SCROLL REVEAL =====================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal');
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersect(entries),
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        
        this.elements.forEach(el => this.observer.observe(el));
    }

    handleIntersect(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation
                const delay = Array.from(this.elements).indexOf(entry.target) % 4;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 100);
                
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ===================== COUNTER ANIMATION =====================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number[data-count]');
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersect(entries),
            { threshold: 0.5 }
        );
        
        this.counters.forEach(counter => this.observer.observe(counter));
    }

    handleIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateCounter(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(update);
    }
}

// ===================== SKILL BARS =====================
class SkillBars {
    constructor() {
        this.bars = document.querySelectorAll('.skill-bar[data-level]');
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersect(entries),
            { threshold: 0.3 }
        );
        
        this.bars.forEach(bar => this.observer.observe(bar));
    }

    handleIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.getAttribute('data-level');
                const fill = entry.target.querySelector('.skill-bar-fill');
                if (fill) {
                    setTimeout(() => {
                        fill.style.width = level + '%';
                    }, 200);
                }
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ===================== BUTTON RIPPLE EFFECT =====================
class ButtonRipple {
    constructor() {
        document.querySelectorAll('.btn--primary').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                btn.style.setProperty('--x', x + '%');
                btn.style.setProperty('--y', y + '%');
            });
        });
    }
}

// ===================== SMOOTH SCROLL =====================
class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const offset = 80;
                    const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPos,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===================== TYPING EFFECT =====================
class TypingEffect {
    constructor(element, texts, speed = 100, deleteSpeed = 50, pauseTime = 2000) {
        if (!element) return;
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===================== INITIALIZE =====================
document.addEventListener('DOMContentLoaded', () => {
    // Particles
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        new ParticleSystem(canvas);
    }

    // Cursor Glow (only on non-touch devices)
    if (window.matchMedia('(hover: hover)').matches) {
        new CursorGlow();
    }

    // Navigation
    new Navbar();

    // Scroll Reveal
    new ScrollReveal();

    // Counter Animation
    new CounterAnimation();

    // Skill Bars
    new SkillBars();

    // Button Ripple
    new ButtonRipple();

    // Smooth Scroll
    new SmoothScroll();

    // Optional: Typing effect on tagline
    const taglineMain = document.querySelector('.tagline-main');
    if (taglineMain) {
        new TypingEffect(taglineMain, [
            'Khát Vọng Dẫn Đầu — Kiến Tạo Tương Lai',
            'Dream Big — Lead with Passion',
            'Business Administration — Future Leader'
        ], 80, 40, 3000);
    }

    // Preload complete
    document.body.classList.add('loaded');
});
