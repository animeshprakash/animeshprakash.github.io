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
    gsap.to(item, {
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
