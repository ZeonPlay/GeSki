document.addEventListener('DOMContentLoaded', () => {
    const burgerIcon = document.getElementById('burgerIcon');
    const sideNav = document.getElementById('sideNav');
    const clickSound = document.getElementById('clickSound');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const scrollBottomBtn = document.getElementById('scrollBottomBtn');

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

    // Scroll behavior
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Check if we're on the homepage (look for home-container)
        const isHomePage = document.querySelector('.home-container') !== null;
        
        if (!isHomePage) {
            scrollTopBtn.classList.add('hidden');
            scrollBottomBtn.classList.add('hidden');
            return;
        }
        
        // Show top button after scrolling down 100px
        if (scrollTop > 100) {
            scrollTopBtn.classList.remove('hidden');
        } else {
            scrollTopBtn.classList.add('hidden');
        }
        
        // Show bottom button if not near the bottom
        if (scrollTop + windowHeight < documentHeight - 100) {
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

    // Handle feedback form submission
    document.querySelector('form[name="feedback"]').addEventListener('submit', function(e) {
        const nameInput = this.querySelector('input[name="name"]');
        if (!nameInput.value.trim()) {
            e.preventDefault();
            nameInput.value = 'Anonymous';
            this.submit();
        }
    });
});