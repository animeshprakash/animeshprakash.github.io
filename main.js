// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// ==========================================
// PRELOADER & HERO ANIMATION TIMELINE
// ==========================================
window.addEventListener('load', () => {
    
    // Prevent scrolling while loading
    lenis.stop();
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
        onComplete: () => {
            lenis.start();
            document.body.style.overflow = '';
            setTimeout(() => ScrollTrigger.refresh(), 100);
        }
    });

    // 1. Initial State for Logo (Ensures it starts invisible, though CSS should handle but good practice)
    gsap.set('.letter-a', { y: 50, opacity: 0 });
    gsap.set('.letter-p', { y: -50, opacity: 0 });

    // 2. Logo Entrance Animation (Slide together and fade in)
    tl.to('.letter-a', { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "logo_in")
      .to('.letter-p', { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "logo_in+=0.2");

    // Hold logo momentarily
    tl.to('.loader-logo', { scale: 1.05, duration: 1.5, ease: "sine.inOut" });

    // 3. Slide loader up to reveal site
    tl.to('.loader', {
        yPercent: -100,
        duration: 1.2,
        ease: "expo.inOut",
        delay: 0.2
    }, "loader_out");

    // 4. Hero Section Entry (Triggers as loader moves up)
    // Animate Navbar
    tl.to('.navbar', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    }, "loader_out+=0.5");

    // Animate Hero Top Text
    tl.to('.hero-top-text', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    }, "loader_out+=0.5");

    // Animate Massive Typography (Staggered words bubbling up)
    tl.to('.hero-title .word', {
        y: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out"
    }, "loader_out+=0.6");

    // Animate Bio and Scroll Button
    tl.to('.hero-bottom-text', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    }, "loader_out+=1.2");

});

// ==========================================
// SCROLLTRIGGER ANIMATIONS
// ==========================================
// Select all elements that should animate in on scroll
const animateItems = gsap.utils.toArray('.item-animate');

animateItems.forEach((item) => {
    let anim = gsap.to(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 85%", // Trigger when top of element hits 85% of viewport
            toggleActions: "play none none reverse" // Play on scroll down, reverse on scroll back up
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
    });

    item.addEventListener('click', () => {
        anim.restart();
        const innerElements = item.querySelectorAll('*');
        if (innerElements.length) {
            gsap.getTweensOf(innerElements).forEach(t => t.restart());
        }
        const amdocsGif = item.querySelector('#amdocsGif');
        if (amdocsGif) {
            const src = amdocsGif.getAttribute('data-src');
            amdocsGif.src = `${src}?t=${new Date().getTime()}`;
        }
    });
});

// Title Reveals (Slightly softer effect for titles)
const revealTitles = gsap.utils.toArray('.reveal-title');

revealTitles.forEach((title) => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: "top 85%",
        },
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out"
    });
});

// ==========================================
// EXPERIENCE LOGO ANIMATIONS
// ==========================================

// EY Logo internal path animation (staggered pop-in)
const eyAnim = gsap.from('.ey-path', {
    scrollTrigger: {
        trigger: '.ey-svg',
        start: "top 85%",
        toggleActions: "play none none reverse"
    },
    opacity: 0,
    y: 30,
    scale: 0.8,
    transformOrigin: "center center",
    stagger: 0.03,
    duration: 0.8,
    ease: "back.out(1.5)",
    delay: 0.1
});

const eySvg = document.querySelector('.ey-svg');
if (eySvg) {
    eySvg.addEventListener('mouseenter', () => eyAnim.restart());
}

// Layered QCRI Logo animation (staggered pop-in)
const qcriAnim = gsap.from('.anim-layer', {
    scrollTrigger: {
        trigger: '.qcri-svg',
        start: "top 85%",
        toggleActions: "play none none reverse"
    },
    opacity: 0,
    y: 30,
    scale: 0.8,
    transformOrigin: "center center",
    stagger: 0.15,
    duration: 0.8,
    ease: "back.out(1.5)",
    delay: 0.1
});

const qcriSvg = document.querySelector('.qcri-svg');
if (qcriSvg) {
    qcriSvg.addEventListener('mouseenter', () => qcriAnim.restart());
}


// ==========================================
// AMDOCS GIF PLAY ON VIEW & HOVER
// ==========================================
const amdocsGif = document.getElementById('amdocsGif');
if (amdocsGif) {
    const playGif = () => {
        const src = amdocsGif.getAttribute('data-src');
        amdocsGif.src = `${src}?t=${new Date().getTime()}`;
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                playGif();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(amdocsGif);

    amdocsGif.addEventListener('mouseenter', playGif);
}

// ==========================================
// MOBILE MENU
// ==========================================
(function () {
    const hamburger = document.getElementById('navHamburger');
    const menu = document.getElementById('mobileMenu');
    const closeBtn = document.getElementById('mobileMenuClose');
    const navItems = menu ? menu.querySelectorAll('.mobile-nav-label') : [];
    const navLinks = menu ? menu.querySelectorAll('.mobile-nav-item') : [];

    if (!hamburger || !menu || !closeBtn) return;

    let menuOpen = false;
    let openTl = null;

    function buildOpenTimeline() {
        const tl = gsap.timeline({ paused: true });

        // Slide menu in from the right
        tl.to(menu, {
            x: '0%',
            duration: 0.55,
            ease: 'power3.inOut'
        }, 0);

        // Stagger nav labels up from below
        tl.fromTo(navItems,
            { y: '110%', opacity: 0 },
            {
                y: '0%',
                opacity: 1,
                duration: 0.55,
                stagger: 0.075,
                ease: 'power3.out'
            },
            0.15
        );

        return tl;
    }

    function openMenu() {
        menu.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        menuOpen = true;
        lenis.stop();

        // Reset nav items before animating
        gsap.set(navItems, { y: '110%', opacity: 0 });
        gsap.set(menu, { x: '100%' });

        if (openTl) openTl.kill();
        openTl = buildOpenTimeline();
        openTl.play();
    }

    function closeMenu() {
        hamburger.setAttribute('aria-expanded', 'false');
        menuOpen = false;

        // Reverse: slide menu out to the right
        gsap.to(menu, {
            x: '100%',
            duration: 0.45,
            ease: 'power3.inOut',
            onComplete: () => {
                menu.classList.remove('is-open');
                lenis.start();
            }
        });

        // Quickly fade out labels simultaneously
        gsap.to(navItems, {
            y: '110%',
            opacity: 0,
            duration: 0.3,
            stagger: 0.04,
            ease: 'power2.in'
        });
    }

    hamburger.addEventListener('click', () => {
        if (!menuOpen) openMenu();
    });

    closeBtn.addEventListener('click', () => {
        if (menuOpen) closeMenu();
    });

    // Close menu on nav link click and scroll to section
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            closeMenu();
            // After close animation, scroll to target
            setTimeout(() => {
                const target = document.querySelector(href);
                if (target) {
                    lenis.scrollTo(target, { duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                }
            }, 480);
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen) closeMenu();
    });
}());


// ==========================================
// ACTIVE NAV LINK — SCROLL-BASED HIGHLIGHT (Desktop only)
// ==========================================
(function () {
    const navLinks = document.querySelectorAll('.nav-links .nav-link[data-section]');
    if (!navLinks.length) return;

    // Map section id -> nav link element
    const sectionMap = {};
    navLinks.forEach(link => {
        sectionMap[link.dataset.section] = link;
    });

    // Sections to observe: experience, qualifications, projects, contact (footer)
    const sectionIds = ['experience', 'qualifications', 'projects', 'contact'];
    const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

    // Track which sections are currently intersecting
    const visible = new Set();

    function updateActiveLink() {
        // Only apply on desktop
        if (window.innerWidth < 769) {
            navLinks.forEach(l => l.classList.remove('nav-link--active'));
            return;
        }

        // Find the LAST section (in DOM order) that is currently visible
        // This ensures that when scrolling down, the newly entered section takes precedence
        let activeSection = null;
        for (let i = sectionIds.length - 1; i >= 0; i--) {
            const id = sectionIds[i];
            if (visible.has(id)) {
                activeSection = id;
                break;
            }
        }

        navLinks.forEach(link => {
            if (link.dataset.section === activeSection) {
                link.classList.add('nav-link--active');
            } else {
                link.classList.remove('nav-link--active');
            }
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                visible.add(entry.target.id);
            } else {
                visible.delete(entry.target.id);
            }
        });
        updateActiveLink();
    }, {
        // Trigger when at least 20% of the section is visible
        threshold: 0.2
    });

    sections.forEach(sec => observer.observe(sec));

    // Re-evaluate on resize (handles switching between mobile/desktop)
    window.addEventListener('resize', updateActiveLink);
}());
