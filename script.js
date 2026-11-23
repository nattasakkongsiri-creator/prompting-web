const heroVideo = document.getElementById('heroVideoSrc');
const nav = document.getElementById('mainNav');
const backToTopBtn = document.getElementById('backToTop');
const transition = document.querySelector(".page-transition");

// ✅ 1. Page Transition & Load
window.addEventListener("load", () => {
    // Fade out transition after load
    setTimeout(() => transition.classList.add("hide"), 200);
    // Show video
    if (heroVideo) heroVideo.style.opacity = "1";
});

// ✅ 2. Link Navigation Transition
document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const targetId = link.getAttribute("href");

        // กรณีปุ่ม Home (หรือลิงก์ที่เป็น # เฉยๆ)
        if (targetId === "#") {
            if (transition) transition.classList.remove("hide");
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                if (transition) transition.classList.add("hide");
            }, 500);
            return;
        }

        // กรณีปุ่มอื่นๆ
        try {
            const target = document.querySelector(targetId);
            if (target) {
                if (transition) transition.classList.remove("hide");
                setTimeout(() => {
                    target.scrollIntoView({ behavior: "smooth" });
                    if (transition) transition.classList.add("hide");
                }, 500);
            }
        } catch (err) {
            console.log("Skipping invalid anchor:", targetId);
        }
    });
});
// ✅ 3. Scroll Logic (Parallax, Opacity, Navbar Glass)
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    // Parallax & Opacity
    if (heroVideo) {
        heroVideo.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.25}px)`;
        const maxScroll = window.innerHeight;
        const opacity = 1 - (scrolled / maxScroll);
        heroVideo.style.opacity = Math.max(opacity, 0);
    }

    // Navbar Glass Effect (New Logic)
    nav.classList.toggle("scrolled", scrolled > 50);

    // Back to Top
    if (scrolled > 500) backToTopBtn.classList.add('show');
    else backToTopBtn.classList.remove('show');
});

// ✅ 4. 3D Card Tilt Effect
document.querySelectorAll(".view-card, .food-card, .tool-card").forEach(card => {
    card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;

        const rotateX = ((y / r.height) - 0.5) * -12;
        const rotateY = ((x / r.width) - 0.5) * 12;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });
});

// ✅ 5. Service Worker Registration (PWA)
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch(err => console.log("Service Worker Failed", err));
}

// Reveal Animation
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Other Funcs
backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const musicBtn = document.getElementById('musicBtn');
const audio = document.getElementById('bgMusic');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        musicBtn.textContent = "🎵";
        musicBtn.classList.remove('music-playing');
    } else {
        audio.play().catch(e => console.log("Music play failed/blocked", e));
        musicBtn.textContent = "⏸";
        musicBtn.classList.add('music-playing');
    }
    isPlaying = !isPlaying;
});

function calculateRate() {
    const thb = document.getElementById('thbInput').value;
    const jpy = (thb * 4.35).toLocaleString(undefined, { maximumFractionDigits: 0 });
    document.getElementById('jpyResult').innerText = thb ? jpy : "0";
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}

function updateClock() {
    const now = new Date();
    const tokyo = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: false });
    const bkk = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', hour12: false });
    document.getElementById('tokyoTime').innerText = tokyo;
    document.getElementById('bkkTime').innerText = bkk;
}
setInterval(updateClock, 1000);
updateClock();

const darkModeBtn = document.getElementById('darkModeBtn');
const body = document.body;
darkModeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        darkModeBtn.textContent = "☀️";
        darkModeBtn.style.background = "white";
        darkModeBtn.style.color = "#333";
    } else {
        darkModeBtn.textContent = "🌙";
        darkModeBtn.style.background = "#333";
        darkModeBtn.style.color = "#ffeb3b";
    }
});