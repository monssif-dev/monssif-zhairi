gsap.registerPlugin(ScrollTrigger);

// 1. Preloader Sequence
const initPreloader = () => {
    const tl = gsap.timeline({
        onComplete: () => {
            document.body.classList.remove('loading');
        }
    });

    // Animate logo slightly upward while fading in
    tl.to('.preloader-logo', {
        y: -20,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    })
    // Progress bar completes
    .to('.progress-bar', {
        width: '100%',
        duration: 1.5,
        ease: 'power2.inOut'
    }, '-=0.5')
    // Slide preloader up
    .to('.preloader', {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut'
    })
    // Reveal hero elements
    .from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.8')
    .from('.nav', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.8');
};

// 2. Custom Interactive Cursor
const initCursor = () => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    const setDotX = gsap.quickSetter(cursorDot, "x", "px");
    const setDotY = gsap.quickSetter(cursorDot, "y", "px");
    const setRingX = gsap.quickSetter(cursorRing, "x", "px");
    const setRingY = gsap.quickSetter(cursorRing, "y", "px");

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        setDotX(mouse.x);
        setDotY(mouse.y);
    });

    gsap.ticker.add(() => {
        const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
        ringPos.x += (mouse.x - ringPos.x) * dt;
        ringPos.y += (mouse.y - ringPos.y) * dt;
        
        setRingX(ringPos.x);
        setRingY(ringPos.y);
    });

    const interactives = document.querySelectorAll('.interactive-link, button, a, [data-magnetic], [data-tilt]');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.classList.add('hovered');
            gsap.to(cursorDot, { scale: 0, duration: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.classList.remove('hovered');
            gsap.to(cursorDot, { scale: 1, duration: 0.2 });
        });
    });
};

// 3. Magnetic Buttons & Icons
const initMagnetic = () => {
    const magnetics = document.querySelectorAll('[data-magnetic]');
    
    magnetics.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const px = e.clientX - rect.left - rect.width / 2;
            const py = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, {
                x: px * 0.4,
                y: py * 0.4,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 1,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
};

// 4. 3D Tilt Project Cards
const initTiltCards = () => {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
        // Dynamic spotlight injection
        const spotlight = document.createElement('div');
        spotlight.classList.add('spotlight');
        card.appendChild(spotlight);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                scale: 1.02,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000
            });

            gsap.to(spotlight, {
                background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1) 0%, transparent 60%)`,
                duration: 0.1
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 1,
                ease: 'elastic.out(1, 0.3)'
            });
            gsap.to(spotlight, {
                background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
                duration: 0.1
            });
        });
    });
};

// 5. Native Smooth Scrolling & Scroll-Skew
const initScrollSkew = () => {
    const wrapper = document.querySelector('.content');
    let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter(wrapper, "skewY", "deg"),
        clamp = gsap.utils.clamp(-5, 5);

    ScrollTrigger.create({
        onUpdate: (self) => {
            const skew = clamp(self.getVelocity() / -200);
            
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
                proxy.skew = skew;
                gsap.to(proxy, {
                    skew: 0,
                    duration: 0.8,
                    ease: "power3",
                    overwrite: true,
                    onUpdate: () => skewSetter(proxy.skew)
                });
            }
        }
    });

    gsap.set(wrapper, { transformOrigin: "center center", force3D: true });
};

// 6. Huge Parallax Background Typography
const initParallax = () => {
    const bgTexts = document.querySelectorAll('[data-parallax]');
    
    bgTexts.forEach(text => {
        gsap.to(text, {
            yPercent: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: text.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
};

// 7. Clip-Path Image Reveals
const initClipPaths = () => {
    const revealImages = document.querySelectorAll('.reveal-image');
    
    revealImages.forEach(img => {
        gsap.fromTo(img, 
            { clipPath: 'inset(100% 0% 0% 0%)' },
            {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.5,
                ease: 'power4.inOut',
                scrollTrigger: {
                    trigger: img,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
};

// 8. Infinite Marquee
const initMarquee = () => {
    const marqueeContent = document.querySelector('.marquee-content');
    
    gsap.to('.marquee', {
        xPercent: -50,
        ease: 'none',
        duration: 15,
        repeat: -1
    });
};

// Ensure all sections fade in smoothly
const initSectionFades = () => {
    const texts = document.querySelectorAll('.reveal-text');
    texts.forEach(text => {
        gsap.from(text, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: text,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        });
    });
};

// 9. Hacker Decoder Text Effect
const initScramble = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const scrambleElements = document.querySelectorAll('.nav-links li a, .btn');
    
    scrambleElements.forEach(el => {
        el.dataset.original = el.innerText;
        el.addEventListener('mouseenter', () => {
            let iterations = 0;
            clearInterval(el.scrambleInterval);
            
            el.scrambleInterval = setInterval(() => {
                el.innerText = el.innerText.split("").map((letter, index) => {
                    if (index < iterations) {
                        return el.dataset.original[index];
                    }
                    return letters[Math.floor(Math.random() * 26)];
                }).join("");
                
                if (iterations >= el.dataset.original.length) {
                    clearInterval(el.scrambleInterval);
                    el.innerText = el.dataset.original; 
                }
                iterations += 1 / 2; 
            }, 30);
        });
    });
};

// Init All
window.addEventListener('load', () => {
    window.scrollTo(0, 0); // ensure we start from top
    initPreloader();
    initCursor();
    initMagnetic();
    initTiltCards();
    initScrollSkew();
    initParallax();
    initClipPaths();
    initMarquee();
    initSectionFades();
    initScramble();
});
