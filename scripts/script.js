document.addEventListener('DOMContentLoaded', () => {
    const burgerIcon = document.getElementById('burgerIcon');
    const sideNav = document.getElementById('sideNav');
    const clickSound = document.getElementById('clickSound');

    if (burgerIcon && sideNav) {
        // Ensure initial state
        sideNav.classList.add('hidden');
        
        // Toggle navigation with simpler logic
        burgerIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            sideNav.classList.toggle('visible');
            sideNav.classList.toggle('hidden');
            playClickSound();
        });

        // Close navigation when clicking outside
        document.addEventListener('click', (e) => {
            if (!sideNav.classList.contains('hidden') && 
                !sideNav.contains(e.target) && 
                !burgerIcon.contains(e.target)) {
                sideNav.classList.remove('visible');
                sideNav.classList.add('hidden');
            }
        });

        // Close navigation on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !sideNav.classList.contains('hidden')) {
                sideNav.classList.remove('visible');
                sideNav.classList.add('hidden');
            }
        });
    }

    // Sound effect
    function playClickSound() {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(err => console.log('Sound play prevented'));
        }
    }

    // Add click sound to all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', playClickSound);
    });
});