// Navigasi Burger Menu
const burgerIcon = document.getElementById('burgerIcon');
const sideNav = document.getElementById('sideNav');

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