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

    // Easter Egg Implementation
    let typing = '';
    let cloudClicks = 0;
    let cloudClickTimer;
    const isMobile = /Android/i.test(navigator.userAgent);

    // Desktop Easter Egg
    document.addEventListener('keypress', (e) => {
        if (!isMobile) {
            typing += e.key.toLowerCase();
            if (typing.length > 5) typing = typing.slice(-5);
            if (typing === 'tabob') {
                createSnowfall();
                typing = '';
            }
        }
    });

    // Mobile Easter Egg
    const heroLogo = document.querySelector('.hero-logo');
    if (heroLogo && isMobile) {
        heroLogo.addEventListener('click', () => {
            cloudClicks++;
            clearTimeout(cloudClickTimer);
            
            cloudClickTimer = setTimeout(() => {
                cloudClicks = 0;
            }, 1000);

            if (cloudClicks === 5) {
                createRainfall();
                cloudClicks = 0;
            }
        });
    }

    function createSnowfall() {
        const snowflakes = ['❄', '❅', '❆'];
        for (let i = 0; i < 50; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = snowflakes[Math.floor(Math.random() * snowflakes.length)];
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
            snowflake.style.animationName = 'fall';
            snowflake.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(snowflake);

            // Remove snowflake after animation
            setTimeout(() => {
                snowflake.remove();
            }, 5000);
        }
    }

    function createRainfall() {
        for (let i = 0; i < 100; i++) {
            const raindrop = document.createElement('div');
            raindrop.className = 'raindrop';
            raindrop.style.left = Math.random() * 100 + 'vw';
            raindrop.style.animationDuration = '1s';
            raindrop.style.animationName = 'fall';
            raindrop.style.animationDelay = Math.random() + 's';
            document.body.appendChild(raindrop);

            // Remove raindrop after animation
            setTimeout(() => {
                raindrop.remove();
            }, 2000);
        }
    }
});