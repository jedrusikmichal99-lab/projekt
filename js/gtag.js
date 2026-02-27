document.addEventListener('DOMContentLoaded', function() {
    if (typeof gtag !== 'function') {
        console.warn('Google Analytics not loaded');
        return;
    }

    const navLinks = document.querySelectorAll('#navbar ul li a, .nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const section = this.getAttribute('href').replace('#', '');
            gtag('event', 'navigation_click', {
                'section_name': section,
                'link_text': this.textContent.trim()
            });
        });
    });

    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            gtag('event', 'phone_click', {
                'phone_number': phoneNumber,
                'link_location': this.closest('section')?.id || 'unknown'
            });
        });
    });

    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            const email = this.getAttribute('href').replace('mailto:', '');
            gtag('event', 'email_click', {
                'email_address': email,
                'link_location': this.closest('section')?.id || 'unknown'
            });
        });
    });

    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            const productSelect = document.getElementById('product');
            const selectedProduct = productSelect ? productSelect.value : 'none';
            gtag('event', 'form_submit', {
                'form_name': 'contact_form',
                'selected_product': selectedProduct
            });
        });
    }

    const quoteButtons = document.querySelectorAll('.ask-quote-btn, .primary-btn[href="#kontakt"]');
    quoteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.model-card, .variant-card');
            const productName = productCard ? productCard.querySelector('h3, h4')?.textContent.trim() : 'general';
            gtag('event', 'quote_request_click', {
                'product_name': productName,
                'button_location': this.closest('section')?.id || 'unknown'
            });
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        root: null,
        threshold: 0.5,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gtag('event', 'section_view', {
                    'section_name': entry.target.id,
                    'viewport_percentage': Math.round(entry.intersectionRatio * 100)
                });
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    const pdfLinks = document.querySelectorAll('a[href$=".pdf"]');
    pdfLinks.forEach(link => {
        link.addEventListener('click', function() {
            const fileName = this.getAttribute('href').split('/').pop();
            gtag('event', 'file_download', {
                'file_name': fileName,
                'file_type': 'pdf',
                'link_text': this.textContent.trim()
            });
        });
    });

    let scrollDepths = [25, 50, 75, 100];
    let scrollTracked = [];

    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !scrollTracked.includes(depth)) {
                scrollTracked.push(depth);
                gtag('event', 'scroll_depth', {
                    'scroll_percentage': depth
                });
            }
        });
    });

    const galleryImages = document.querySelectorAll('.photo-grid img, .gallery-item');
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            gtag('event', 'gallery_image_click', {
                'image_index': index + 1,
                'image_alt': this.alt || 'unknown'
            });
        });
    });

    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            gtag('event', 'language_change', {
                'language': lang
            });
        });
    });
});
