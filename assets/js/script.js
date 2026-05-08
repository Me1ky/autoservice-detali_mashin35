document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Логика мобильного меню (Бургер)
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

    // Выбираем элементы для анимации
    const animatedElements = document.querySelectorAll('.card, .service-item, .contact-item, .stat-card, .hero, .page-hero, .product-card, .product-wrapper');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // 4. Загрузка ТОВАРОВ из JSON (если есть контейнер products-container)
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
                    // Создаем карточку товара
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

                // После добавления товаров нужно заново запустить анимацию для новых элементов
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

    // 5. Загрузка УСЛУГ из JSON (если есть контейнер services-container)
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
                // Перезапуск анимации для новых элементов
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
});