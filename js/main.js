document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#navbar .nav-links a, #navbar ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash !== "") {
                e.preventDefault();

                const hash = this.hash;
                const targetElement = document.querySelector(hash);

                if (targetElement) {
                    const navbar = document.getElementById('navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;

                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    const mobileMenu = document.querySelector('.nav-links');
                    const hamburger = document.querySelector('.hamburger');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        hamburger.classList.remove('active');
                        hamburger.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinks2 = document.querySelector('.nav-links');

    if (hamburger && navLinks2) {
        hamburger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            this.classList.toggle('active');
            navLinks2.classList.toggle('active');
            this.setAttribute('aria-expanded', !isExpanded);
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks2.classList.contains('active')) {
                navLinks2.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('click', function(e) {
            if (navLinks2.classList.contains('active') &&
                !navLinks2.contains(e.target) &&
                !hamburger.contains(e.target)) {
                navLinks2.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name === "" || email === "" || message === "") {
                alert('Prosze wypelnic wszystkie wymagane pola formularza.');
                e.preventDefault();
            } else {
                alert('Dziekujemy za wiadomosc! Skontaktujemy sie z Toba najszybciej jak to mozliwe.');
                e.preventDefault();
                contactForm.reset();
            }
        });
    }

    const standardToggles = document.querySelectorAll('.standard-toggle');
    standardToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const card = this.closest('.model-card');
            const economic = card.querySelector('.economic-features');
            const prestige = card.querySelector('.prestige-features');
            const isEconomic = this.classList.contains('toggle-economic');

            card.querySelectorAll('.standard-toggle').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            if (isEconomic) {
                economic.classList.add('active');
                prestige.classList.remove('active');
            } else {
                prestige.classList.add('active');
                economic.classList.remove('active');
            }
        });
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryImages = document.querySelectorAll('.photo-grid img');
    let currentImageIndex = 0;

    if (lightbox && galleryImages.length > 0) {
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', function() {
                currentImageIndex = index;
                lightboxImg.src = this.src;
                lightboxImg.alt = this.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', function(e) {
                e.stopPropagation();
                currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                lightboxImg.src = galleryImages[currentImageIndex].src;
                lightboxImg.alt = galleryImages[currentImageIndex].alt;
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', function(e) {
                e.stopPropagation();
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                lightboxImg.src = galleryImages[currentImageIndex].src;
                lightboxImg.alt = galleryImages[currentImageIndex].alt;
            });
        }

        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                lightboxImg.src = galleryImages[currentImageIndex].src;
                lightboxImg.alt = galleryImages[currentImageIndex].alt;
            } else if (e.key === 'ArrowRight') {
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                lightboxImg.src = galleryImages[currentImageIndex].src;
                lightboxImg.alt = galleryImages[currentImageIndex].alt;
            }
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    const askQuoteButtons = document.querySelectorAll('.ask-quote-btn');
    askQuoteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const card = this.closest('.model-card');
            if (card) {
                const modelName = card.querySelector('h3').textContent.trim();
                const activeStandard = card.querySelector('.standard-toggle.active');
                const standardName = activeStandard ? activeStandard.textContent.trim() : '';

                const productSelect = document.getElementById('product');
                if (productSelect) {
                    const optionValue = `${modelName} - ${standardName}`.toLowerCase().replace(/\s+/g, '-');
                    for (let option of productSelect.options) {
                        if (option.value.includes(modelName.toLowerCase())) {
                            productSelect.value = option.value;
                            break;
                        }
                    }
                }
            }
        });
    });

    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});
