import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    // Floating Badge Follower untuk Box Kanan
    const rightBox = document.getElementById('right-box');
    const badge = document.getElementById('floating-badge');
    if (rightBox && badge) {
        rightBox.addEventListener('mouseenter', () => {
            badge.style.opacity = '1';
        });
        rightBox.addEventListener('mouseleave', () => {
            badge.style.opacity = '0';
        });
        rightBox.addEventListener('mousemove', (e) => {
            const rect = rightBox.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            badge.style.transform = `translate(${x + 15}px, ${y + 15}px)`;
        });

    }

    // Sembunyikan Watermark/Logo Spline secara otomatis untuk SEMUA objek 3D (querySelectorAll)
    const hideSplineLogo = () => {
        const applyStyle = () => {
            const splineViewers = document.querySelectorAll('spline-viewer');
            splineViewers.forEach((viewer) => {
                if (viewer.shadowRoot && !viewer.shadowRoot.querySelector('#spline-custom-hide')) {
                    const style = document.createElement('style');
                    style.id = 'spline-custom-hide';
                    style.textContent = '#logo, #logo-link, a[href*="spline.design"], div[class*="logo"] { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }';
                    viewer.shadowRoot.appendChild(style);
                }
            });
        };

        const interval = setInterval(applyStyle, 50);
        setTimeout(() => clearInterval(interval), 5000);
    };
    hideSplineLogo();
});


/*
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9, // Mencegah hentakan berlebih di mouse wheel Chrome
});
// Integrasi GSAP
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
*/

// Logika untuk mengubah posisi Navbar saat di-scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    // Jika layar di-scroll ke bawah lebih dari 50px
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        // Jika kembali ke paling atas
        navbar.classList.remove('navbar-scrolled');
    }
});




// Register ScrollTrigger GSAP
gsap.registerPlugin(ScrollTrigger);

// Animasi SplitType Line Reveal
document.fonts.ready.then(() => {
    document.querySelectorAll(".split").forEach((element) => {
        // Bersihkan instance lama jika ada
        if (element.splitInstance) {
            element.splitInstance.revert();
        }

        // 1. Pecah teks menjadi baris (.line) & kata (.word) secara otomatis
        const splitText = new SplitType(element, { tagName: 'span', types: 'lines, words' });
        element.splitInstance = splitText;

        // 2. Animasi meluncur naik dari balik masking (.line) saat di-scroll
        gsap.from(splitText.lines, {
            duration: 1,
            yPercent: 100,
            opacity: 0,
            stagger: 0.12,
            ease: "power4.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse",
            }
        });
    });
});


// Animasi About Section: Zoom Out + Naik dari Bawah + Fade In
gsap.fromTo('#about-section',
    {
        scale: 1.08,
        y: 60,
    },
    {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.4,
        scrollTrigger: {
            trigger: '#about-section',
            start: 'top 85%',
            end: 'top 20%',
            scrub: 3,
        }
    }
);




// Animasi Parallax & Spin 3D Spline saat web di-scroll
gsap.to("spline-viewer", {
    y: -100,          // Bergeser ke atas 100px
    rotate: 10,       // Miring 10 derajat
    scrollTrigger: {
        trigger: ".sticky",
        start: "top top",
        end: "bottom top",
        scrub: 1      // Mengikuti scroll mouse secara halus
    }
});


// Slider untuk Project Cards
document.querySelectorAll('.what-i-do-card').forEach((card) => {
    const track = card.querySelector('.slider-track');
    const dots = card.querySelectorAll('.dot');
    const total = dots.length;
    let current = 0;
    let interval;

    const goTo = (index) => {
        current = index;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('bg-white', i === current);
            dot.classList.toggle('bg-white/30', i !== current);
        });
    };

    const startAuto = (speed = 3000) => {
        clearInterval(interval);
        interval = setInterval(() => goTo((current + 1) % total), speed);
    };

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goTo(i);
            startAuto();
        });
    });

    // Hover: percepat slide
    card.addEventListener('mouseenter', () => startAuto(900));
    card.addEventListener('mouseleave', () => startAuto(3000));

    goTo(0);
    startAuto();
});

// 1. Pin What I Do saat bagian bawahnya tersentuh -> About Section meluncur menimpa
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
    trigger: "#what-i-do-section",
    start: "bottom bottom",
    end: "+=100%",
    pin: true,
    pinSpacing: false,
    anticipatePin: 1
});

ScrollTrigger.create({
    trigger: "#about-section",
    start: "bottom bottom",
    end: "+=100%",
    pin: true,
    pinSpacing: false,  // ✅ WAJIB false agar Exploration Section meluncur menimpa di depannya!
    anticipatePin: 1
});

// ================= LOGIC MOBILE BURGER MENU =================
const burgerBtn = document.getElementById('burger-btn');
const burgerIconOpen = document.getElementById('burger-icon-open');
const burgerIconClose = document.getElementById('burger-icon-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('opacity-100');
    
    if (!isOpen) {
      // Buka Menu Overlay
      mobileMenu.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      mobileMenu.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      burgerIconOpen.classList.add('hidden');
      burgerIconClose.classList.remove('hidden');
    } else {
      // Tutup Menu Overlay
      mobileMenu.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      mobileMenu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      burgerIconOpen.classList.remove('hidden');
      burgerIconClose.classList.add('hidden');
    }
  });

  // Otomatis Tutup Menu jika salah satu link diklik
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      mobileMenu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      burgerIconOpen.classList.remove('hidden');
      burgerIconClose.classList.add('hidden');
    });
  });
}
