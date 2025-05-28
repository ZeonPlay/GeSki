// Navigasi Burger Menu
const burgerIcon = document.getElementById('burgerIcon');
const sideNav = document.getElementById('sideNav');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const scrollBottomBtn = document.getElementById('scrollBottomBtn');

// Fungsi untuk menutup navigasi
function closeSideNav() {
    sideNav.classList.add('hidden');
    sideNav.classList.remove('visible');
}

// Toggle navigasi saat ikon burger diklik
burgerIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    sideNav.classList.toggle('visible');
    sideNav.classList.toggle('hidden');
});

// Tutup navigasi saat klik di luar navigasi
document.body.addEventListener('click', (e) => {
    if (!sideNav.contains(e.target) && !burgerIcon.contains(e.target)) {
        closeSideNav();
    }
}, { passive: true });

// Tutup navigasi saat tombol ESC ditekan
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideNav.classList.contains('visible')) {
        closeSideNav();
    }
}, { passive: true });

// Ambil elemen audio
const clickSound = document.getElementById('clickSound');

// Fungsi untuk memutar suara klik
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

// Tambahkan event listener ke semua tombol
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', playClickSound, { passive: true });
    });
}, { passive: true });

// Scroll behavior
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Show/hide top button
    if (scrollTop > windowHeight * 0.3) {
        scrollTopBtn.classList.remove('hidden');
    } else {
        scrollTopBtn.classList.add('hidden');
    }
    
    // Show/hide bottom button
    if (scrollTop < documentHeight - windowHeight * 1.3) {
        scrollBottomBtn.classList.remove('hidden');
    } else {
        scrollBottomBtn.classList.add('hidden');
    }
}

// Smooth scroll functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    playClickSound();
}

function scrollToBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
    playClickSound();
}

// Event listeners
window.addEventListener('scroll', handleScroll, { passive: true });
scrollTopBtn.addEventListener('click', scrollToTop);
scrollBottomBtn.addEventListener('click', scrollToBottom);

// Initial check
handleScroll();