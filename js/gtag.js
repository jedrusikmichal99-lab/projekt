document.addEventListener('DOMContentLoaded', function() {
    if (typeof gtag !== 'function') {
        console.warn('Google Analytics not loaded');
        return;
    }

    let currentLanguage = localStorage.getItem('biuraogrodowe_lang') || 'pl';

    const navItems = [
        { id: 'opis', position: 1 },
        { id: 'charakterystyka', position: 2 },
        { id: 'modele', position: 3 },
        { id: 'galeria', position: 4 },
        { id: 'kontakt', position: 5 }
    ];

    const navLinks = document.querySelectorAll('#navbar .nav-links ul li a');
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function() {
            const section = this.getAttribute('href').replace('#', '');
            const navItem = navItems.find(item => item.id === section);
            gtag('event', 'navigation_click', {
                'event_category': 'Navigation',
                'nav_item_id': section,
                'nav_item_text': this.textContent.trim(),
                'nav_position': navItem ? navItem.position : index + 1,
                'nav_type': 'main_menu',
                'device_type': window.innerWidth <= 768 ? 'mobile' : 'desktop'
            });
        });
    });

    const logo = document.querySelector('#navbar .logo');
    if (logo) {
        logo.addEventListener('click', function() {
            gtag('event', 'logo_click', {
                'event_category': 'Navigation',
                'click_location': 'header',
                'device_type': window.innerWidth <= 768 ? 'mobile' : 'desktop'
            });
        });
    }

    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            gtag('event', 'hamburger_menu_toggle', {
                'event_category': 'Navigation',
                'action': isExpanded ? 'close' : 'open',
                'device_type': 'mobile'
            });
        });
    }

    const heroCta = document.querySelector('.hero-content .primary-btn[href="#kontakt"]');
    if (heroCta) {
        heroCta.addEventListener('click', function() {
            gtag('event', 'cta_click', {
                'event_category': 'CTA',
                'cta_type': 'quote_request',
                'cta_text': this.textContent.trim(),
                'cta_location': 'hero',
                'section_id': 'hero',
                'button_style': 'primary'
            });
        });
    }

    const descriptionCta = document.querySelector('.description-section .secondary-btn[href="#galeria"]');
    if (descriptionCta) {
        descriptionCta.addEventListener('click', function() {
            gtag('event', 'cta_click', {
                'event_category': 'CTA',
                'cta_type': 'view_gallery',
                'cta_text': this.textContent.trim(),
                'cta_location': 'description_section',
                'section_id': 'opis',
                'button_style': 'secondary'
            });
        });
    }

    const modelCards = document.querySelectorAll('.model-card');
    modelCards.forEach((card, cardIndex) => {
        const modelName = card.querySelector('.model-header h3')?.textContent.trim() || 'unknown';
        const isFeatured = card.classList.contains('featured');

        const quoteBtn = card.querySelector('.ask-quote-btn');
        if (quoteBtn) {
            quoteBtn.addEventListener('click', function() {
                const activeStandard = card.querySelector('.standard-toggle.active');
                const standardType = activeStandard?.classList.contains('toggle-prestige') ? 'Prestiz' : 'Ekonomiczny';

                gtag('event', 'cta_click', {
                    'event_category': 'CTA',
                    'cta_type': 'quote_request',
                    'cta_text': this.textContent.trim(),
                    'cta_location': 'models_section',
                    'section_id': 'modele',
                    'model_name': modelName,
                    'model_standard': standardType,
                    'card_position': cardIndex + 1,
                    'is_featured_model': isFeatured,
                    'button_style': 'primary'
                });
            });
        }

        const standardToggles = card.querySelectorAll('.standard-toggle');
        standardToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const selectedStandard = this.classList.contains('toggle-prestige') ? 'Prestiz' : 'Ekonomiczny';
                gtag('event', 'model_standard_toggle', {
                    'event_category': 'Model Interaction',
                    'model_name': modelName,
                    'selected_standard': selectedStandard,
                    'card_position': cardIndex + 1,
                    'is_featured_model': isFeatured
                });
            });
        });
    });

    const callNowBtn = document.querySelector('.contact-section .call-btn');
    if (callNowBtn) {
        callNowBtn.addEventListener('click', function() {
            gtag('event', 'cta_click', {
                'event_category': 'CTA',
                'cta_type': 'call_now',
                'cta_text': this.textContent.trim(),
                'cta_location': 'contact_section',
                'section_id': 'kontakt',
                'button_style': 'primary'
            });
        });
    }

    const phoneContacts = [
        { selector: 'a[href="tel:+48691058088"]', person: 'Michal', phone: '+48691058088' },
        { selector: 'a[href="tel:+48516037401"]', person: 'Tomasz', phone: '+48516037401' }
    ];

    phoneContacts.forEach(contact => {
        const links = document.querySelectorAll(contact.selector);
        links.forEach(link => {
            link.addEventListener('click', function() {
                const isCallButton = this.classList.contains('call-btn');
                const section = this.closest('section');
                gtag('event', 'phone_click', {
                    'event_category': 'Contact',
                    'phone_number': contact.phone,
                    'contact_person': contact.person,
                    'click_type': isCallButton ? 'cta_button' : 'text_link',
                    'section_id': section?.id || 'unknown',
                    'section_name': section?.id || 'unknown'
                });
            });
        });
    });

    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            const email = this.getAttribute('href').replace('mailto:', '');
            const section = this.closest('section');
            gtag('event', 'email_click', {
                'event_category': 'Contact',
                'email_address': email,
                'section_id': section?.id || 'unknown'
            });
        });
    });

    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        let formStartTime = null;
        let fieldsInteracted = [];

        const formFields = contactForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('focus', function() {
                if (!formStartTime) {
                    formStartTime = Date.now();
                    gtag('event', 'form_start', {
                        'event_category': 'Form',
                        'form_name': 'contact_form',
                        'first_field': this.id || this.name
                    });
                }

                if (!fieldsInteracted.includes(this.id || this.name)) {
                    fieldsInteracted.push(this.id || this.name);
                    gtag('event', 'form_field_focus', {
                        'event_category': 'Form',
                        'form_name': 'contact_form',
                        'field_name': this.id || this.name,
                        'field_type': this.type || this.tagName.toLowerCase(),
                        'fields_completed_count': fieldsInteracted.length
                    });
                }
            });
        });

        contactForm.addEventListener('submit', function() {
            const productSelect = document.getElementById('product');
            const selectedProduct = productSelect ? productSelect.value : 'none';
            const messageField = document.getElementById('message');
            const messageLength = messageField ? messageField.value.length : 0;
            const completionTime = formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : 0;

            gtag('event', 'form_submit', {
                'event_category': 'Form',
                'form_name': 'contact_form',
                'selected_model': selectedProduct || 'not_selected',
                'message_length': messageLength,
                'form_completion_time_seconds': completionTime,
                'fields_interacted_count': fieldsInteracted.length
            });
        });
    }

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
                    'event_category': 'Engagement',
                    'section_id': entry.target.id,
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
            const section = this.closest('section');
            gtag('event', 'file_download', {
                'event_category': 'Downloads',
                'file_name': fileName,
                'file_type': 'pdf',
                'link_text': this.textContent.trim(),
                'section_id': section?.id || 'unknown'
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
                    'event_category': 'Engagement',
                    'scroll_percentage': depth,
                    'page_height': document.documentElement.scrollHeight
                });
            }
        });
    });

    const galleryImages = document.querySelectorAll('.photo-grid img');
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            const fileName = this.src.split('/').pop();
            gtag('event', 'gallery_image_click', {
                'event_category': 'Gallery',
                'image_index': index + 1,
                'image_total': galleryImages.length,
                'image_filename': fileName,
                'image_alt': this.alt || 'unknown',
                'action': 'open_lightbox'
            });
        });
    });

    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');

        if (lightboxClose) {
            lightboxClose.addEventListener('click', function() {
                gtag('event', 'lightbox_interaction', {
                    'event_category': 'Gallery',
                    'action': 'close',
                    'method': 'close_button'
                });
            });
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', function() {
                gtag('event', 'lightbox_interaction', {
                    'event_category': 'Gallery',
                    'action': 'navigate',
                    'direction': 'previous'
                });
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', function() {
                gtag('event', 'lightbox_interaction', {
                    'event_category': 'Gallery',
                    'action': 'navigate',
                    'direction': 'next'
                });
            });
        }

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                gtag('event', 'lightbox_interaction', {
                    'event_category': 'Gallery',
                    'action': 'close',
                    'method': 'background_click'
                });
            }
        });
    }

    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const newLang = this.getAttribute('data-lang');
            const previousLang = currentLanguage;

            gtag('event', 'language_change', {
                'event_category': 'Settings',
                'language_from': previousLang,
                'language_to': newLang,
                'is_change': previousLang !== newLang
            });

            currentLanguage = newLang;
        });
    });

    const footerPrivacyLink = document.querySelector('footer a[href="polityka-prywatnosci.html"]');
    if (footerPrivacyLink) {
        footerPrivacyLink.addEventListener('click', function() {
            gtag('event', 'footer_link_click', {
                'event_category': 'Navigation',
                'link_type': 'privacy_policy',
                'link_text': this.textContent.trim()
            });
        });
    }

    const socialLinks = document.querySelectorAll('a[href*="facebook.com"], a[href*="instagram.com"]');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            let platform = 'unknown';
            if (href.includes('facebook.com')) platform = 'facebook';
            if (href.includes('instagram.com')) platform = 'instagram';

            gtag('event', 'social_link_click', {
                'event_category': 'Social',
                'platform': platform,
                'link_url': href
            });
        });
    });
});
