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

    // 3. Анимация при скролле
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

    // 4. Год в футере
    var footer = document.querySelector('footer');
    if (footer) {
        var currentYear = new Date().getFullYear();
        footer.innerHTML = footer.innerHTML.replace(/©\s*\d{4}/, '© ' + currentYear);
    }

    // 5. Загрузка услуг
    const servicesContainer = document.getElementById('services-container');
    if (servicesContainer) {
        fetch('assets/data/services.json')
            .then(res => res.json())
            .then(data => {
                servicesContainer.innerHTML = '';
                data.forEach(service => {
                    const el = document.createElement('div');
                    el.className = 'service-item visible';
                    el.innerHTML = `
                        <span class="service-icon">${service.icon}</span>
                        <h3>${service.name}</h3>
                        <p>${service.description}</p>
                    `;
                    servicesContainer.appendChild(el);
                });
            })
            .catch(err => console.error('Ошибка загрузки услуг:', err));
    }

    // 6. Загрузка цен
    const repairPricesTable = document.querySelector('#repair-prices tbody');
    const tirePricesTable = document.querySelector('#tire-prices tbody');

    if (repairPricesTable || tirePricesTable) {
        fetch('assets/data/prices.json')
            .then(res => res.json())
            .then(data => {
                if (repairPricesTable && data.repair) {
                    repairPricesTable.innerHTML = '';
                    data.repair.forEach(item => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td data-label="Услуга">${item.name}</td>
                            <td data-label="Цена">${item.price}</td>
                        `;
                        repairPricesTable.appendChild(tr);
                    });
                }
                if (tirePricesTable && data.tire) {
                    tirePricesTable.innerHTML = '';
                    data.tire.forEach(item => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td data-label="Услуга">${item.name}</td>
                            <td data-label="Цена">${item.price}</td>
                        `;
                        tirePricesTable.appendChild(tr);
                    });
                }
            })
            .catch(err => console.error('Ошибка загрузки цен:', err));
    }
})