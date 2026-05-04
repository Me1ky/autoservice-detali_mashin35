document.addEventListener('DOMContentLoaded', function() {
    // 1. Подсветка активного пункта меню
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('nav a');
    for (var i = 0; i < navLinks.length; i++) {
        var href = navLinks[i].getAttribute('href');
        if (href === currentPath) {
            navLinks[i].classList.add('nav-active');
        }
    }

    // 2. Адаптивное бургер-меню
    var header = document.querySelector('header');
    var nav = document.querySelector('nav');

    if (header && nav && window.innerWidth <= 768) {
        var burger = document.createElement('button');
        burger.className = 'burger-btn';
        burger.setAttribute('aria-label', 'Открыть меню');
        burger.textContent = '☰';
        header.style.position = 'relative';
        header.appendChild(burger);

        nav.classList.add('mobile-hidden');

        burger.addEventListener('click', function() {
            var isOpen = nav.classList.toggle('mobile-visible');
            nav.classList.toggle('mobile-hidden', !isOpen);
            burger.textContent = isOpen ? '✕' : '☰';
        });

        var links = nav.querySelectorAll('a');
        for (var j = 0; j < links.length; j++) {
            links[j].addEventListener('click', function() {
                nav.classList.remove('mobile-visible');
                nav.classList.add('mobile-hidden');
                burger.textContent = '☰';
            });
        }
    }

    // 3. Загрузка услуг из JSON
    var servicesContainer = document.getElementById('services-container');
    if (servicesContainer) {
        fetch('assets/data/services.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(services) {
                services.forEach(function(service) {
                    var serviceHTML = '<div class="service-item">' +
                        '<span class="service-icon">' + service.icon + '</span>' +
                        '<h3>' + service.name + '</h3>' +
                        '<p>' + service.description + '</p>' +
                        '</div>';
                    servicesContainer.innerHTML += serviceHTML;
                });
            })
            .catch(function(error) {
                console.error('Ошибка загрузки услуг:', error);
            });
    }

    // 4. Загрузка цен из JSON
    var repairTable = document.getElementById('repair-prices');
    var tireTable = document.getElementById('tire-prices');

    if (repairTable || tireTable) {
        fetch('assets/data/prices.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (repairTable) {
                    var repairBody = repairTable.querySelector('tbody');
                    data.repair.forEach(function(item) {
                        var row = '<tr><td data-label="Услуга">' + item.name + '</td><td data-label="Цена">' + item.price + '</td></tr>';
                        repairBody.innerHTML += row;
                    });
                }
                if (tireTable) {
                    var tireBody = tireTable.querySelector('tbody');
                    data.tire.forEach(function(item) {
                        var row = '<tr><td data-label="Услуга">' + item.name + '</td><td data-label="Цена">' + item.price + '</td></tr>';
                        tireBody.innerHTML += row;
                    });
                }
            })
            .catch(function(error) {
                console.error('Ошибка загрузки цен:', error);
            });
    }

    // 5. Анимация при скролле
    var animElements = document.querySelectorAll('.card, .service-item, .contact-item, .stat-card, .page-hero, .hero');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        for (var k = 0; k < animElements.length; k++) {
            observer.observe(animElements[k]);
        }
    } else {
        for (var k = 0; k < animElements.length; k++) {
            animElements[k].classList.add('visible');
        }
    }

    // 6. Год в футере
    var footer = document.querySelector('footer');
    if (footer) {
        var currentYear = new Date().getFullYear();
        footer.innerHTML = footer.innerHTML.replace(/©\s*\d{4}/, '© ' + currentYear);
    }
});