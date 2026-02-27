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
    const modelStandardSelections = {};

    modelCards.forEach((card, cardIndex) => {
        const modelName = card.querySelector('.model-header h3')?.textContent.trim() || 'unknown';
        const isFeatured = card.classList.contains('featured');

        modelStandardSelections[modelName] = 'Ekonomiczny';

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
                const previousStandard = modelStandardSelections[modelName];

                gtag('event', 'model_standard_toggle', {
                    'event_category': 'Model Interaction',
                    'model_name': modelName,
                    'selected_standard': selectedStandard,
                    'previous_standard': previousStandard,
                    'card_position': cardIndex + 1,
                    'is_featured_model': isFeatured
                });

                modelStandardSelections[modelName] = selectedStandard;

                const modelsWithPrestige = Object.values(modelStandardSelections).filter(s => s === 'Prestiz').length;
                if (modelsWithPrestige >= 2) {
                    gtag('event', 'model_comparison_behavior', {
                        'event_category': 'Model Interaction',
                        'action': 'comparing_prestige_options',
                        'models_on_prestige': modelsWithPrestige
                    });
                }
            });
        });

        let hoverStartTime = null;
        card.addEventListener('mouseenter', function() {
            hoverStartTime = Date.now();
        });

        card.addEventListener('mouseleave', function() {
            if (hoverStartTime) {
                const hoverDuration = Math.round((Date.now() - hoverStartTime) / 1000);
                if (hoverDuration >= 2) {
                    gtag('event', 'model_card_hover', {
                        'event_category': 'Model Interaction',
                        'model_name': modelName,
                        'hover_duration_seconds': hoverDuration,
                        'card_position': cardIndex + 1,
                        'is_featured_model': isFeatured
                    });
                }
                hoverStartTime = null;
            }
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
        let fieldTimes = {};
        let lastFieldFocus = null;
        let lastFieldFocusTime = null;
        let formAbandoned = true;

        const formFields = contactForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('focus', function() {
                const fieldName = this.id || this.name;

                if (lastFieldFocus && lastFieldFocusTime) {
                    const timeOnField = Math.round((Date.now() - lastFieldFocusTime) / 1000);
                    fieldTimes[lastFieldFocus] = (fieldTimes[lastFieldFocus] || 0) + timeOnField;
                }

                lastFieldFocus = fieldName;
                lastFieldFocusTime = Date.now();

                if (!formStartTime) {
                    formStartTime = Date.now();
                    gtag('event', 'form_start', {
                        'event_category': 'Form',
                        'form_name': 'contact_form',
                        'first_field': fieldName
                    });
                }

                if (!fieldsInteracted.includes(fieldName)) {
                    fieldsInteracted.push(fieldName);
                    gtag('event', 'form_field_focus', {
                        'event_category': 'Form',
                        'form_name': 'contact_form',
                        'field_name': fieldName,
                        'field_type': this.type || this.tagName.toLowerCase(),
                        'fields_completed_count': fieldsInteracted.length
                    });
                }
            });

            field.addEventListener('blur', function() {
                const fieldName = this.id || this.name;
                const hasValue = this.value.trim().length > 0;

                if (lastFieldFocusTime) {
                    const timeOnField = Math.round((Date.now() - lastFieldFocusTime) / 1000);
                    fieldTimes[fieldName] = (fieldTimes[fieldName] || 0) + timeOnField;
                }

                gtag('event', 'form_field_blur', {
                    'event_category': 'Form',
                    'form_name': 'contact_form',
                    'field_name': fieldName,
                    'field_filled': hasValue,
                    'time_on_field_seconds': fieldTimes[fieldName] || 0
                });

                lastFieldFocus = null;
                lastFieldFocusTime = null;
            });

            field.addEventListener('invalid', function() {
                gtag('event', 'form_validation_error', {
                    'event_category': 'Form',
                    'form_name': 'contact_form',
                    'field_name': this.id || this.name,
                    'validation_message': this.validationMessage
                });
            });
        });

        contactForm.addEventListener('submit', function() {
            formAbandoned = false;
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
                'fields_interacted_count': fieldsInteracted.length,
                'field_times': JSON.stringify(fieldTimes)
            });
        });

        window.addEventListener('beforeunload', function() {
            if (formAbandoned && formStartTime && fieldsInteracted.length > 0) {
                const timeSpent = Math.round((Date.now() - formStartTime) / 1000);
                const filledFields = Array.from(formFields).filter(f => f.value.trim().length > 0).length;

                gtag('event', 'form_abandonment', {
                    'event_category': 'Form',
                    'form_name': 'contact_form',
                    'fields_interacted': fieldsInteracted.join(','),
                    'fields_filled_count': filledFields,
                    'time_spent_seconds': timeSpent,
                    'last_field_focused': lastFieldFocus || 'unknown'
                });
            }
        });
    }

    const sections = document.querySelectorAll('section[id]');
    const sectionTimes = {};
    const sectionViewedOnce = {};

    const observerOptions = {
        root: null,
        threshold: 0.5,
        rootMargin: '0px'
    };

    const sectionTimeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionId = entry.target.id;

            if (entry.isIntersecting) {
                sectionTimes[sectionId] = { startTime: Date.now(), totalTime: sectionTimes[sectionId]?.totalTime || 0 };

                if (!sectionViewedOnce[sectionId]) {
                    sectionViewedOnce[sectionId] = true;
                    gtag('event', 'section_view', {
                        'event_category': 'Engagement',
                        'section_id': sectionId,
                        'section_name': sectionId,
                        'viewport_percentage': Math.round(entry.intersectionRatio * 100)
                    });
                }
            } else {
                if (sectionTimes[sectionId]?.startTime) {
                    const timeInSection = Math.round((Date.now() - sectionTimes[sectionId].startTime) / 1000);
                    sectionTimes[sectionId].totalTime += timeInSection;

                    if (timeInSection >= 3) {
                        gtag('event', 'section_time_spent', {
                            'event_category': 'Engagement',
                            'section_id': sectionId,
                            'time_spent_seconds': timeInSection,
                            'total_time_seconds': sectionTimes[sectionId].totalTime
                        });
                    }

                    sectionTimes[sectionId].startTime = null;
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionTimeObserver.observe(section);
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
    let lightboxImagesViewed = 0;
    let lightboxSessionStart = null;

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            const fileName = this.src.split('/').pop();
            lightboxImagesViewed = 1;
            lightboxSessionStart = Date.now();

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

        const closeLightboxWithTracking = function(method) {
            const sessionDuration = lightboxSessionStart ? Math.round((Date.now() - lightboxSessionStart) / 1000) : 0;

            gtag('event', 'lightbox_interaction', {
                'event_category': 'Gallery',
                'action': 'close',
                'method': method,
                'images_viewed_count': lightboxImagesViewed,
                'session_duration_seconds': sessionDuration
            });

            lightboxImagesViewed = 0;
            lightboxSessionStart = null;
        };

        if (lightboxClose) {
            lightboxClose.addEventListener('click', function() {
                closeLightboxWithTracking('close_button');
            });
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', function() {
                lightboxImagesViewed++;
                gtag('event', 'lightbox_interaction', {
                    'event_category': 'Gallery',
                    'action': 'navigate',
                    'direction': 'previous',
                    'method': 'button'
                });
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', function() {
                lightboxImagesViewed++;
                gtag('event', 'lightbox_interaction', {
                    'event_category': 'Gallery',
                    'action': 'navigate',
                    'direction': 'next',
                    'method': 'button'
                });
            });
        }

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightboxWithTracking('background_click');
            }
        });

        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'ArrowLeft') {
                lightboxImagesViewed++;
                gtag('event', 'lightbox_interaction', {
                    'event_category': 'Gallery',
                    'action': 'navigate',
                    'direction': 'previous',
                    'method': 'keyboard'
                });
            } else if (e.key === 'ArrowRight') {
                lightboxImagesViewed++;
                gtag('event', 'lightbox_interaction', {
                    'event_category': 'Gallery',
                    'action': 'navigate',
                    'direction': 'next',
                    'method': 'keyboard'
                });
            } else if (e.key === 'Escape') {
                closeLightboxWithTracking('keyboard_escape');
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

            if (previousLang !== newLang) {
                gtag('event', 'page_view', {
                    'page_title': document.title,
                    'page_location': window.location.href,
                    'page_language': newLang,
                    'virtual_pageview': true,
                    'previous_language': previousLang
                });
            }

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

    const pageLoadTime = Date.now();
    let totalEngagementTime = 0;
    let lastActivityTime = Date.now();
    let isUserActive = true;
    let idleTimeout = null;
    const IDLE_THRESHOLD = 30000;

    const resetIdleTimer = function() {
        if (!isUserActive) {
            const idleDuration = Math.round((Date.now() - lastActivityTime) / 1000);
            gtag('event', 'user_activity_resumed', {
                'event_category': 'Engagement',
                'idle_duration_seconds': idleDuration
            });
        }

        isUserActive = true;
        lastActivityTime = Date.now();

        if (idleTimeout) clearTimeout(idleTimeout);

        idleTimeout = setTimeout(function() {
            if (isUserActive) {
                totalEngagementTime += Math.round((Date.now() - lastActivityTime) / 1000);
                isUserActive = false;

                gtag('event', 'user_idle', {
                    'event_category': 'Engagement',
                    'engagement_time_before_idle_seconds': totalEngagementTime
                });
            }
        }, IDLE_THRESHOLD);
    };

    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(eventType => {
        document.addEventListener(eventType, resetIdleTimer, { passive: true });
    });

    resetIdleTimer();

    window.addEventListener('beforeunload', function() {
        if (isUserActive) {
            totalEngagementTime += Math.round((Date.now() - lastActivityTime) / 1000);
        }

        const totalTimeOnPage = Math.round((Date.now() - pageLoadTime) / 1000);

        Object.keys(sectionTimes).forEach(sectionId => {
            if (sectionTimes[sectionId]?.startTime) {
                sectionTimes[sectionId].totalTime += Math.round((Date.now() - sectionTimes[sectionId].startTime) / 1000);
            }
        });

        gtag('event', 'page_exit', {
            'event_category': 'Engagement',
            'total_time_on_page_seconds': totalTimeOnPage,
            'engagement_time_seconds': totalEngagementTime,
            'scroll_depth_reached': Math.max(...scrollTracked, 0),
            'sections_visited': Object.keys(sectionViewedOnce).join(',')
        });
    });

    const elementsToTrackVisibility = [
        { selector: '.hero-content .primary-btn', name: 'hero_cta_button' },
        { selector: '.char-card', name: 'characteristic_card', multiple: true },
        { selector: '.model-card', name: 'model_card', multiple: true }
    ];

    const visibilityTracked = {};

    const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const trackingKey = entry.target.dataset.trackingKey;
                if (!visibilityTracked[trackingKey]) {
                    visibilityTracked[trackingKey] = true;
                    gtag('event', 'element_visible', {
                        'event_category': 'Visibility',
                        'element_name': entry.target.dataset.trackingName,
                        'element_index': entry.target.dataset.trackingIndex || 0
                    });
                }
            }
        });
    }, { threshold: 0.8 });

    elementsToTrackVisibility.forEach(config => {
        if (config.multiple) {
            document.querySelectorAll(config.selector).forEach((el, index) => {
                el.dataset.trackingKey = `${config.name}_${index}`;
                el.dataset.trackingName = config.name;
                el.dataset.trackingIndex = index + 1;
                visibilityObserver.observe(el);
            });
        } else {
            const el = document.querySelector(config.selector);
            if (el) {
                el.dataset.trackingKey = config.name;
                el.dataset.trackingName = config.name;
                visibilityObserver.observe(el);
            }
        }
    });

    document.addEventListener('copy', function(e) {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0 && selectedText.length < 500) {
            const isPhoneNumber = /[\d\s\-+]{9,}/.test(selectedText);
            const isEmail = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(selectedText);
            const section = document.activeElement?.closest('section');

            gtag('event', 'text_copied', {
                'event_category': 'Engagement',
                'copied_text': selectedText.substring(0, 100),
                'text_length': selectedText.length,
                'is_phone_number': isPhoneNumber,
                'is_email': isEmail,
                'section_id': section?.id || 'unknown'
            });
        }
    });

    const clickHistory = [];
    const RAGE_CLICK_THRESHOLD = 3;
    const RAGE_CLICK_WINDOW = 1000;
    const RAGE_CLICK_DISTANCE = 50;

    document.addEventListener('click', function(e) {
        const now = Date.now();
        clickHistory.push({ x: e.clientX, y: e.clientY, time: now });

        const recentClicks = clickHistory.filter(click => now - click.time < RAGE_CLICK_WINDOW);

        if (recentClicks.length >= RAGE_CLICK_THRESHOLD) {
            const firstClick = recentClicks[0];
            const allNearby = recentClicks.every(click => {
                const distance = Math.sqrt(Math.pow(click.x - firstClick.x, 2) + Math.pow(click.y - firstClick.y, 2));
                return distance < RAGE_CLICK_DISTANCE;
            });

            if (allNearby) {
                const targetElement = e.target;
                const section = targetElement.closest('section');

                gtag('event', 'rage_click', {
                    'event_category': 'UX Issues',
                    'click_count': recentClicks.length,
                    'target_element': targetElement.tagName.toLowerCase(),
                    'target_class': targetElement.className.split(' ').slice(0, 3).join(' '),
                    'section_id': section?.id || 'unknown',
                    'page_x': e.pageX,
                    'page_y': e.pageY
                });

                clickHistory.length = 0;
            }
        }

        while (clickHistory.length > 0 && now - clickHistory[0].time > RAGE_CLICK_WINDOW) {
            clickHistory.shift();
        }
    });

    const charCards = document.querySelectorAll('.char-card');
    let charCardsViewedCount = 0;
    const totalCharCards = charCards.length;

    const charCardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.viewed) {
                entry.target.dataset.viewed = 'true';
                charCardsViewedCount++;

                if (charCardsViewedCount === totalCharCards) {
                    gtag('event', 'all_characteristics_viewed', {
                        'event_category': 'Engagement',
                        'cards_count': totalCharCards
                    });
                }
            }
        });
    }, { threshold: 0.6 });

    charCards.forEach(card => charCardObserver.observe(card));

    let allModelCardsViewed = false;
    const modelCardObserver = new IntersectionObserver((entries) => {
        let viewedCount = 0;
        modelCards.forEach(card => {
            if (card.dataset.viewed === 'true') viewedCount++;
        });

        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.viewed) {
                entry.target.dataset.viewed = 'true';
                viewedCount++;
            }
        });

        if (viewedCount === modelCards.length && !allModelCardsViewed) {
            allModelCardsViewed = true;
            gtag('event', 'all_models_viewed', {
                'event_category': 'Engagement',
                'models_count': modelCards.length
            });
        }
    }, { threshold: 0.6 });

    modelCards.forEach(card => modelCardObserver.observe(card));
});
