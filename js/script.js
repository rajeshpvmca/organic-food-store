/**
 * Organic Food Store - Dynamic Component Loader
 */

function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    fetch(file)
        .then(response => {
            if (response.ok) return response.text();
            throw new Error(`Could not load ${file}`);
        })
        .then(data => {
            element.innerHTML = data;
            
            // Auto-set active link based on current URL
            if (id === 'header-placeholder') {
                const currentPath = window.location.pathname.split("/").pop() || 'index.html';
                element.querySelectorAll('.nav-link').forEach(link => {
                    if (link.getAttribute('href') === currentPath) {
                        link.classList.add('active');
                    }
                });
            }

            // Refresh AOS to detect newly injected elements
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        })
        .catch(error => console.error('Error loading component:', error));
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent('header-placeholder', 'header.html');
    loadComponent('footer-placeholder', 'footer.html');

    // Initialize AOS with mobile-safe settings
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        disable: 'mobile', // Recommended if animations still cause issues on very old devices
        startEvent: 'DOMContentLoaded',
    });

    // Initialize Hero Content Slider
    new Swiper('.hero-content-slider', {
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        allowTouchMove: false,
    });

    // Initialize Testimonial Slider
   new Swiper(".testimonial-slider",{
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 }
        }
    });
    
});