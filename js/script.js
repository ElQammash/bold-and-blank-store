        // Initialize WOW.js
        new WOW().init();

        // --- DATA ---
        const imageSets = {
            'Black': ['https://placehold.co/600x750/2d2d2d/ffffff?text=Black+1', 'https://placehold.co/600x750/2d2d2d/ffffff?text=Black+2', 'https://placehold.co/600x750/2d2d2d/ffffff?text=Black+3', 'https://placehold.co/600x750/2d2d2d/ffffff?text=Black+4', 'https://placehold.co/600x750/2d2d2d/ffffff?text=Black+5'],
            'Pink': ['https://placehold.co/600x750/e88793/ffffff?text=Pink+1', 'https://placehold.co/600x750/e88793/ffffff?text=Pink+2', 'https://placehold.co/600x750/e88793/ffffff?text=Pink+3', 'https://placehold.co/600x750/e88793/ffffff?text=Pink+4', 'https://placehold.co/600x750/e88793/ffffff?text=Pink+5'],
            'Green': ['https://placehold.co/600x750/5b8c8d/ffffff?text=Green+1', 'https://placehold.co/600x750/5b8c8d/ffffff?text=Green+2', 'https://placehold.co/600x750/5b8c8d/ffffff?text=Green+3', 'https://placehold.co/600x750/5b8c8d/ffffff?text=Green+4', 'https://placehold.co/600x750/5b8c8d/ffffff?text=Green+5']
        };

        const giftBags = [{
            value: 'Bag 1',
            src: './images/bag-1.jpg'
        }, {
            value: 'Bag 2',
            src: './images/bag-2.jpg'
        }, {
            value: 'Bag 3',
            src: './images/bag-3.jpg'
        }, {
            value: 'Bag 4',
            src: './images/bag-4.jpg'
        }, {
            value: 'Bag 5',
            src: './images/bag-5.jpg'
        }, ];

        let currentLanguage = localStorage.getItem('language') || 'en';
        let currentImageIndex = 0;

        // --- DOM ELEMENTS ---
        const thumbnailContainer = document.getElementById('thumbnail-container');
        const mainProductImage = document.getElementById('main-product-image');
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const langToggleDesktop = document.getElementById('lang-toggle-desktop');
        const langToggleMobile = document.getElementById('lang-toggle-mobile');
        const contactForm = document.getElementById('contactForm');
        const formMessage = document.getElementById('formMessage');
        const giftBagSelector = document.getElementById('gift-bag-selector');
        const imageStickyWrapper = document.querySelector('.image-sticky');

        // --- FUNCTIONS ---
        const setLanguage = (lang, isInitialLoad = false) => {
            currentLanguage = lang;
            localStorage.setItem('language', lang);
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

            const elements = document.querySelectorAll('.lang-translatable');
            
            // If not the initial load, fade out the current text first
            if (!isInitialLoad) {
                elements.forEach(el => el.classList.add('fade-out'));
                
                // Wait for the fade-out transition to complete
                setTimeout(() => {
                    updateTextAndFadeIn();
                }, 500); // This matches the 0.5s transition time
            } else {
                updateTextAndFadeIn();
            }

            function updateTextAndFadeIn() {
                elements.forEach(el => {
                    const newText = lang === 'ar' ? el.dataset.langAr : el.dataset.langEn;
                    el.innerText = newText;
                    el.classList.remove('fade-out');
                });
                langToggleDesktop.innerText = lang === 'en' ? 'AR' : 'EN';
                langToggleMobile.innerText = lang === 'en' ? 'AR' : 'EN';
            }
        };

        const toggleMenu = () => {
            menuBtn.classList.toggle('open');
            mobileMenu.classList.toggle('max-h-0');
            mobileMenu.classList.toggle('max-h-screen');
            mobileMenu.classList.toggle('opacity-0');
        };

        const updateThumbnailGallery = (color) => {
            const images = imageSets[color] || [];
            thumbnailContainer.innerHTML = '';
            currentImageIndex = 0;
            images.forEach((src, index) => {
                const img = document.createElement('img');
                img.src = src;
                img.className = 'thumbnail w-16 h-20 object-cover rounded-md flex-shrink-0';
                img.onerror = function() {
                    this.src = 'https://placehold.co/600x750/cccccc/333333?text=Image+Not+Found';
                };
                if (index === 0) img.classList.add('active');
                img.onclick = () => changeImage(src, img, index);
                thumbnailContainer.appendChild(img);
            });
            if (images.length > 0) {
                changeImage(images[0], thumbnailContainer.querySelector('.thumbnail'), 0);
            }
        };

        const changeImage = (imageSrc, thumbnailElement, index) => {
            mainProductImage.style.opacity = 0;
            setTimeout(() => {
                mainProductImage.src = imageSrc;
                mainProductImage.style.opacity = 1;
            }, 150);
            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            if (thumbnailElement) {
                thumbnailElement.classList.add('active');
            }
            currentImageIndex = index;
        };

        const scrollThumbnails = (direction) => {
            const thumbnails = thumbnailContainer.querySelectorAll('.thumbnail');
            if (thumbnails.length === 0) return;
            let newIndex = currentImageIndex;
            if (direction === 'prev') {
                newIndex = (currentImageIndex - 1 + thumbnails.length) % thumbnails.length;
            } else {
                newIndex = (currentImageIndex + 1) % thumbnails.length;
            }
            thumbnails[newIndex].click();
            thumbnails[newIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        };

        const renderGiftBags = () => {
            giftBagSelector.innerHTML = '';
            giftBags.forEach(bag => {
                const bagContainer = document.createElement('div');
                bagContainer.className = 'gift-bag-swatch relative overflow-hidden rounded-lg cursor-pointer transition-all duration-500 transform';
                bagContainer.dataset.group = 'gift-bag';
                bagContainer.dataset.value = bag.value;
                bagContainer.innerHTML = `<img src="${bag.src}" alt="${bag.value}" class="w-full h-full object-cover rounded-lg">`;
                bagContainer.addEventListener('click', () => {
                    document.querySelectorAll('.gift-bag-swatch').forEach(s => s.classList.remove('selected'));
                    bagContainer.classList.add('selected');
                });
                giftBagSelector.appendChild(bagContainer);
            });
        };

        // --- EVENT LISTENERS ---
        menuBtn.addEventListener('click', toggleMenu);
        document.querySelectorAll('#mobile-menu a, #mobile-menu button').forEach(link => {
            link.addEventListener('click', () => {
                if (menuBtn.classList.contains('open')) toggleMenu();
            });
        });

        langToggleDesktop.addEventListener('click', () => setLanguage(currentLanguage === 'en' ? 'ar' : 'en'));
        langToggleMobile.addEventListener('click', () => setLanguage(currentLanguage === 'en' ? 'ar' : 'en'));

        document.querySelectorAll('.option-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                const group = swatch.dataset.group;
                const value = swatch.dataset.value;
                document.querySelectorAll(`.option-swatch[data-group="${group}"]`).forEach(s => s.classList.remove('selected'));
                swatch.classList.add('selected');
                if (group === 'product-color') updateThumbnailGallery(value);
            });
        });

        // Thumbnail scroll buttons
        document.getElementById('thumb-scroll-up').addEventListener('click', () => scrollThumbnails('prev'));
        document.getElementById('thumb-scroll-down').addEventListener('click', () => scrollThumbnails('next'));
        document.getElementById('thumb-scroll-left').addEventListener('click', () => scrollThumbnails('prev'));
        document.getElementById('thumb-scroll-right').addEventListener('click', () => scrollThumbnails('next'));

        const mainImageContainer = document.querySelector('.main-image-container');
        mainImageContainer.addEventListener('mousemove', (e) => {
            const rect = mainImageContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            mainProductImage.style.transformOrigin = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
            mainProductImage.style.transform = 'scale(2)';
        });
        mainImageContainer.addEventListener('mouseleave', () => {
            mainProductImage.style.transformOrigin = 'center center';
            mainProductImage.style.transform = 'scale(1)';
        });

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const selectedColor = document.querySelector('.option-swatch[data-group="product-color"].selected')?.dataset.value || 'Not selected';
            const selectedSize = document.querySelector('.option-swatch[data-group="product-size"].selected')?.dataset.value || 'Not selected';
            const selectedGift = document.querySelector('.gift-bag-swatch.selected')?.dataset.value || 'None';
            const name = document.getElementById('name').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            const phone2 = document.getElementById('phone2').value;

            console.log('--- New Order ---');
            console.log('Name:', name);
            console.log('Phone:', phone);
            console.log('Second Phone:', phone2);
            console.log('Address:', address);
            console.log('Color:', selectedColor);
            console.log('Size:', selectedSize);
            console.log('Gift:', selectedGift);

            const successMessage = currentLanguage === 'en' ? 'Thank you! Your order has been placed.' : 'شكراً لك! تم استلام طلبك.';
            formMessage.textContent = successMessage;
            contactForm.reset();
            document.querySelectorAll('.option-swatch.selected').forEach(s => s.classList.remove('selected'));
            document.querySelectorAll('.gift-bag-swatch.selected').forEach(s => s.classList.remove('selected'));

            // Set defaults after submission
            document.querySelector('.option-swatch[data-group="product-color"][data-value="Black"]').classList.add('selected');
            document.querySelector('.option-swatch[data-group="product-size"][data-value="M"]').classList.add('selected');
            updateThumbnailGallery('Black');

            setTimeout(() => formMessage.textContent = '', 5000);
        });

        // --- INITIALIZE PAGE ---
        document.addEventListener('DOMContentLoaded', () => {
            setLanguage(currentLanguage, true);

            // Set default selections on page load
            document.querySelector('.option-swatch[data-group="product-color"][data-value="Black"]').classList.add('selected');
            document.querySelector('.option-swatch[data-group="product-size"][data-value="M"]').classList.add('selected');
            updateThumbnailGallery('Black');
            renderGiftBags();
        });