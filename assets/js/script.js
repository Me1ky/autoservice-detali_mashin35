document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. ЛОГИКА МОБИЛЬНОГО МЕНЮ (БУРГЕР)
    // ==========================================
    const burgerBtn = document.querySelector('.burger-btn');
    const navMenu = document.querySelector('nav');

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-visible');
            
            // Меняем иконку при открытии/закрытии
            if (navMenu.classList.contains('mobile-visible')) {
                burgerBtn.textContent = '✕';
            } else {
                burgerBtn.textContent = '☰';
            }
        });
    }

    // ==========================================
    // 2. ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ
    // ==========================================
    const currentLocation = location.href;
    const menuItem = document.querySelectorAll('nav a');
    const menuLength = menuItem.length;
    for (let i = 0; i < menuLength; i++) {
        if (menuItem[i].href === currentLocation) {
            menuItem[i].classList.add("nav-active");
        }
    }

    // ==========================================
    // 3. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
    // ==========================================
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

    // Выбираем элементы для анимации
    const animatedElements = document.querySelectorAll('.card, .service-item, .contact-item, .stat-card, .hero, .page-hero, .product-card, .product-wrapper');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // ==========================================
    // 4. ЗАГРУЗКА ТОВАРОВ ИЗ JSON (products.json)
    // ==========================================
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        fetch('assets/data/products.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(products => {
                productsContainer.innerHTML = ''; // Очищаем текст "Загрузка..."

                products.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card'; 
                    
                    card.innerHTML = `
                        <div class="product-icon">${product.icon}</div>
                        <h3>${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                        <div class="product-price">${product.price.toLocaleString()} ₽</div>
                        <button class="btn-sm" onclick="alert('Для заказа ${product.name} позвоните нам!')">Заказать</button>
                    `;
                    
                    productsContainer.appendChild(card);
                });

                // Перезапуск анимации для новых элементов
                const newCards = document.querySelectorAll('.product-card');
                newCards.forEach(el => {
                    el.classList.remove('visible'); 
                    observer.observe(el);
                });
            })
            .catch(error => {
                console.error('Ошибка загрузки товаров:', error);
                productsContainer.innerHTML = '<p style="color:red; text-align:center;">Не удалось загрузить каталог товаров.</p>';
            });
    }

    // ==========================================
    // 5. ЗАГРУЗКА УСЛУГ ИЗ JSON (services.json)
    // ==========================================
    const servicesContainer = document.getElementById('services-container');
    if (servicesContainer) {
        fetch('assets/data/services.json')
            .then(response => response.json())
            .then(services => {
                servicesContainer.innerHTML = '';
                services.forEach(service => {
                    const item = document.createElement('div');
                    item.className = 'service-item';
                    item.innerHTML = `
                        <span class="service-icon">${service.icon}</span>
                        <h3>${service.name}</h3>
                        <p>${service.description}</p>
                    `;
                    servicesContainer.appendChild(item);
                });
                // Перезапуск анимации
                document.querySelectorAll('.service-item').forEach(el => {
                    el.classList.remove('visible');
                    observer.observe(el);
                });
            })
            .catch(error => {
                console.error('Ошибка загрузки услуг:', error);
                servicesContainer.innerHTML = '<p>Не удалось загрузить услуги.</p>';
            });
    }

    // ==========================================
    // 6. ЗАГРУЗКА ЦЕН ИЗ JSON (prices.json)
    // ==========================================
    const repairTableBody = document.getElementById('repair-table-body');
    const tireTableBody = document.getElementById('tire-table-body');

    // Проверяем, есть ли эти таблицы на странице (только на prices.html)
    if (repairTableBody && tireTableBody) {
        fetch('assets/data/prices.json')
            .then(response => response.json())
            .then(data => {
                // Очищаем таблицы от текста "Загрузка..."
                repairTableBody.innerHTML = '';
                tireTableBody.innerHTML = '';

                // data.repair - это массив ремонтных работ
                if (data.repair) {
                    data.repair.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td data-label="Услуга">${item.name}</td>
                            <td data-label="Цена">${item.price}</td>
                        `;
                        repairTableBody.appendChild(row);
                    });
                }

                // data.tire - это массив шиномонтажа
                if (data.tire) {
                    data.tire.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td data-label="Услуга">${item.name}</td>
                            <td data-label="Цена">${item.price}</td>
                        `;
                        tireTableBody.appendChild(row);
                    });
                }
            })
            .catch(error => {
                console.error('Ошибка загрузки цен:', error);
                repairTableBody.innerHTML = '<tr><td colspan="2">Ошибка загрузки данных</td></tr>';
                tireTableBody.innerHTML = '<tr><td colspan="2">Ошибка загрузки данных</td></tr>';
            });
    }
});