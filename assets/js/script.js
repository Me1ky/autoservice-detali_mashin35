document.addEventListener('DOMContentLoaded', function() {
    // 1. Логика мобильного меню (Бургер)
    const burgerBtn = document.querySelector('.burger-btn');
    const navMenu = document.querySelector('nav');

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-visible');
            
            // Меняем иконку
            if (navMenu.classList.contains('mobile-visible')) {
                burgerBtn.textContent = '✕';
            } else {
                burgerBtn.textContent = '☰';
            }
        });
    }

    // 2. Подсветка активного пункта меню
    const currentLocation = location.href;
    const menuItem = document.querySelectorAll('nav a');
    const menuLength = menuItem.length;
    for (let i = 0; i < menuLength; i++) {
        if (menuItem[i].href === currentLocation) {
            menuItem[i].classList.add("nav-active");
        }
    }

    // 3. Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.card, .service-item, .contact-item, .stat-card, .hero, .page-hero, .product-wrapper');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});