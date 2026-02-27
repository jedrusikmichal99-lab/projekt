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
            const eventName = 'menu_' + section;
            gtag('event', eventName, {
                'event_category': 'Nawigacja',
                'tekst_elementu': this.textContent.trim(),
                'pozycja_w_menu': navItem ? navItem.position : index + 1,
                'typ_menu': 'menu_glowne',
                'urzadzenie': window.innerWidth <= 768 ? 'mobilne' : 'desktop'
            });
        });
    });

    const logo = document.querySelector('#navbar .logo');
    if (logo) {
        logo.addEventListener('click', function() {
            gtag('event', 'logo_biura_ogrodowe', {
                'event_category': 'Nawigacja',
                'lokalizacja': 'naglowek',
                'urzadzenie': window.innerWidth <= 768 ? 'mobilne' : 'desktop'
            });
        });
    }

    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            gtag('event', 'menu_mobilne', {
                'event_category': 'Nawigacja',
                'akcja': isExpanded ? 'zamkniecie' : 'otwarcie',
                'urzadzenie': 'mobilne'
            });
        });
    }

    const heroCta = document.querySelector('.hero-content .primary-btn[href="#kontakt"]');
    if (heroCta) {
        heroCta.addEventListener('click', function() {
            gtag('event', 'zapytaj_o_wycene_hero', {
                'event_category': 'CTA',
                'przycisk': 'Zapytaj o wycene',
                'lokalizacja': 'hero',
                'sekcja': 'hero',
                'tekst_przycisku': this.textContent.trim()
            });
        });
    }

    const descriptionCta = document.querySelector('.description-section .secondary-btn[href="#galeria"]');
    if (descriptionCta) {
        descriptionCta.addEventListener('click', function() {
            gtag('event', 'zobacz_galerie_opis', {
                'event_category': 'CTA',
                'przycisk': 'Zobacz galerie',
                'lokalizacja': 'sekcja_opisu',
                'sekcja': 'opis',
                'tekst_przycisku': this.textContent.trim()
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

                gtag('event', 'zapytaj_o_wycene_modele', {
                    'event_category': 'CTA',
                    'przycisk': 'Zapytaj o wycene',
                    'lokalizacja': 'sekcja_modeli',
                    'sekcja': 'modele',
                    'nazwa_modelu': modelName,
                    'standard_modelu': standardType,
                    'pozycja_karty': cardIndex + 1,
                    'model_wyrozniany': isFeatured,
                    'tekst_przycisku': this.textContent.trim()
                });
            });
        }

        const standardToggles = card.querySelectorAll('.standard-toggle');
        standardToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const selectedStandard = this.classList.contains('toggle-prestige') ? 'Prestiz' : 'Ekonomiczny';
                const previousStandard = modelStandardSelections[modelName];

                gtag('event', 'zmiana_standardu_modelu', {
                    'event_category': 'Interakcja_z_modelem',
                    'nazwa_modelu': modelName,
                    'wybrany_standard': selectedStandard,
                    'poprzedni_standard': previousStandard,
                    'pozycja_karty': cardIndex + 1,
                    'model_wyrozniany': isFeatured
                });

                modelStandardSelections[modelName] = selectedStandard;

                const modelsWithPrestige = Object.values(modelStandardSelections).filter(s => s === 'Prestiz').length;
                if (modelsWithPrestige >= 2) {
                    gtag('event', 'porownywanie_modeli', {
                        'event_category': 'Interakcja_z_modelem',
                        'akcja': 'porownywanie_opcji_prestiz',
                        'liczba_modeli_prestiz': modelsWithPrestige
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
                    gtag('event', 'najechanie_na_model', {
                        'event_category': 'Interakcja_z_modelem',
                        'nazwa_modelu': modelName,
                        'czas_najechania_sekundy': hoverDuration,
                        'pozycja_karty': cardIndex + 1,
                        'model_wyrozniany': isFeatured
                    });
                }
                hoverStartTime = null;
            }
        });
    });

    const callNowBtn = document.querySelector('.contact-section .call-btn');
    if (callNowBtn) {
        callNowBtn.addEventListener('click', function() {
            gtag('event', 'zadzwon_teraz_kontakt', {
                'event_category': 'CTA',
                'przycisk': 'Zadzwon teraz',
                'lokalizacja': 'sekcja_kontakt',
                'sekcja': 'kontakt',
                'tekst_przycisku': this.textContent.trim()
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
                gtag('event', 'klikniecie_telefon', {
                    'event_category': 'Kontakt',
                    'numer_telefonu': contact.phone,
                    'osoba_kontaktowa': contact.person,
                    'typ_klikniecia': isCallButton ? 'przycisk_cta' : 'link_tekstowy',
                    'sekcja': section?.id || 'nieznana'
                });
            });
        });
    });

    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            const email = this.getAttribute('href').replace('mailto:', '');
            const section = this.closest('section');
            gtag('event', 'klikniecie_email', {
                'event_category': 'Kontakt',
                'adres_email': email,
                'sekcja': section?.id || 'nieznana'
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
                    gtag('event', 'formularz_rozpoczety', {
                        'event_category': 'Formularz',
                        'nazwa_formularza': 'formularz_kontaktowy',
                        'pierwsze_pole': fieldName
                    });
                }

                if (!fieldsInteracted.includes(fieldName)) {
                    fieldsInteracted.push(fieldName);
                    gtag('event', 'formularz_pole_aktywne', {
                        'event_category': 'Formularz',
                        'nazwa_formularza': 'formularz_kontaktowy',
                        'nazwa_pola': fieldName,
                        'typ_pola': this.type || this.tagName.toLowerCase(),
                        'liczba_wypelnionych_pol': fieldsInteracted.length
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

                gtag('event', 'formularz_pole_opuszczone', {
                    'event_category': 'Formularz',
                    'nazwa_formularza': 'formularz_kontaktowy',
                    'nazwa_pola': fieldName,
                    'pole_wypelnione': hasValue,
                    'czas_na_polu_sekundy': fieldTimes[fieldName] || 0
                });

                lastFieldFocus = null;
                lastFieldFocusTime = null;
            });

            field.addEventListener('invalid', function() {
                gtag('event', 'formularz_blad_walidacji', {
                    'event_category': 'Formularz',
                    'nazwa_formularza': 'formularz_kontaktowy',
                    'nazwa_pola': this.id || this.name,
                    'komunikat_walidacji': this.validationMessage
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

            gtag('event', 'formularz_wyslany', {
                'event_category': 'Formularz',
                'nazwa_formularza': 'formularz_kontaktowy',
                'wybrany_model': selectedProduct || 'nie_wybrany',
                'dlugosc_wiadomosci': messageLength,
                'czas_wypelniania_sekundy': completionTime,
                'liczba_interakcji_z_polami': fieldsInteracted.length,
                'czasy_na_polach': JSON.stringify(fieldTimes)
            });
        });

        window.addEventListener('beforeunload', function() {
            if (formAbandoned && formStartTime && fieldsInteracted.length > 0) {
                const timeSpent = Math.round((Date.now() - formStartTime) / 1000);
                const filledFields = Array.from(formFields).filter(f => f.value.trim().length > 0).length;

                gtag('event', 'formularz_porzucony', {
                    'event_category': 'Formularz',
                    'nazwa_formularza': 'formularz_kontaktowy',
                    'pola_z_interakcja': fieldsInteracted.join(','),
                    'liczba_wypelnionych_pol': filledFields,
                    'czas_spedzony_sekundy': timeSpent,
                    'ostatnie_aktywne_pole': lastFieldFocus || 'nieznane'
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
                    gtag('event', 'wyswietlenie_sekcji', {
                        'event_category': 'Zaangazowanie',
                        'sekcja': sectionId,
                        'nazwa_sekcji': sectionId,
                        'procent_widocznosci': Math.round(entry.intersectionRatio * 100)
                    });
                }
            } else {
                if (sectionTimes[sectionId]?.startTime) {
                    const timeInSection = Math.round((Date.now() - sectionTimes[sectionId].startTime) / 1000);
                    sectionTimes[sectionId].totalTime += timeInSection;

                    if (timeInSection >= 3) {
                        gtag('event', 'czas_w_sekcji', {
                            'event_category': 'Zaangazowanie',
                            'sekcja': sectionId,
                            'czas_spedzony_sekundy': timeInSection,
                            'calkowity_czas_sekundy': sectionTimes[sectionId].totalTime
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
            gtag('event', 'pobranie_pliku', {
                'event_category': 'Pobieranie',
                'nazwa_pliku': fileName,
                'typ_pliku': 'pdf',
                'tekst_linku': this.textContent.trim(),
                'sekcja': section?.id || 'nieznana'
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
                gtag('event', 'glebokosc_przewijania', {
                    'event_category': 'Zaangazowanie',
                    'procent_przewiniecia': depth,
                    'wysokosc_strony': document.documentElement.scrollHeight
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

            gtag('event', 'klikniecie_zdjecie_galerii', {
                'event_category': 'Galeria',
                'indeks_zdjecia': index + 1,
                'liczba_zdjec': galleryImages.length,
                'nazwa_pliku': fileName,
                'alt_zdjecia': this.alt || 'nieznany',
                'akcja': 'otwarcie_lightbox'
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

            gtag('event', 'zamkniecie_lightbox', {
                'event_category': 'Galeria',
                'akcja': 'zamkniecie',
                'metoda': method,
                'liczba_obejrzanych_zdjec': lightboxImagesViewed,
                'czas_sesji_sekundy': sessionDuration
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
                gtag('event', 'nawigacja_lightbox', {
                    'event_category': 'Galeria',
                    'akcja': 'nawigacja',
                    'kierunek': 'poprzednie',
                    'metoda': 'przycisk'
                });
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', function() {
                lightboxImagesViewed++;
                gtag('event', 'nawigacja_lightbox', {
                    'event_category': 'Galeria',
                    'akcja': 'nawigacja',
                    'kierunek': 'nastepne',
                    'metoda': 'przycisk'
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
                gtag('event', 'nawigacja_lightbox', {
                    'event_category': 'Galeria',
                    'akcja': 'nawigacja',
                    'kierunek': 'poprzednie',
                    'metoda': 'klawiatura'
                });
            } else if (e.key === 'ArrowRight') {
                lightboxImagesViewed++;
                gtag('event', 'nawigacja_lightbox', {
                    'event_category': 'Galeria',
                    'akcja': 'nawigacja',
                    'kierunek': 'nastepne',
                    'metoda': 'klawiatura'
                });
            } else if (e.key === 'Escape') {
                closeLightboxWithTracking('klawiatura_escape');
            }
        });
    }

    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const newLang = this.getAttribute('data-lang');
            const previousLang = currentLanguage;
            const eventName = 'jezyk_' + newLang.toUpperCase();

            gtag('event', eventName, {
                'event_category': 'Ustawienia',
                'jezyk_z': previousLang,
                'czy_zmiana': previousLang !== newLang
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
            gtag('event', 'klikniecie_stopka', {
                'event_category': 'Nawigacja',
                'typ_linku': 'polityka_prywatnosci',
                'tekst_linku': this.textContent.trim()
            });
        });
    }

    const socialLinks = document.querySelectorAll('a[href*="facebook.com"], a[href*="instagram.com"]');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            let platform = 'nieznana';
            if (href.includes('facebook.com')) platform = 'facebook';
            if (href.includes('instagram.com')) platform = 'instagram';

            gtag('event', 'klikniecie_social_media', {
                'event_category': 'Social',
                'platforma': platform,
                'url_linku': href
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
            gtag('event', 'uzytkownik_wrocil', {
                'event_category': 'Zaangazowanie',
                'czas_nieaktywnosci_sekundy': idleDuration
            });
        }

        isUserActive = true;
        lastActivityTime = Date.now();

        if (idleTimeout) clearTimeout(idleTimeout);

        idleTimeout = setTimeout(function() {
            if (isUserActive) {
                totalEngagementTime += Math.round((Date.now() - lastActivityTime) / 1000);
                isUserActive = false;

                gtag('event', 'uzytkownik_nieaktywny', {
                    'event_category': 'Zaangazowanie',
                    'czas_aktywnosci_przed_nieaktywnoscia_sekundy': totalEngagementTime
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

        gtag('event', 'opuszczenie_strony', {
            'event_category': 'Zaangazowanie',
            'calkowity_czas_na_stronie_sekundy': totalTimeOnPage,
            'czas_aktywnosci_sekundy': totalEngagementTime,
            'osiagnieta_glebokosc_przewijania': Math.max(...scrollTracked, 0),
            'odwiedzone_sekcje': Object.keys(sectionViewedOnce).join(',')
        });
    });

    document.addEventListener('copy', function(e) {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0 && selectedText.length < 500) {
            const isPhoneNumber = /[\d\s\-+]{9,}/.test(selectedText);
            const isEmail = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(selectedText);
            const section = document.activeElement?.closest('section');

            gtag('event', 'skopiowanie_tekstu', {
                'event_category': 'Zaangazowanie',
                'skopiowany_tekst': selectedText.substring(0, 100),
                'dlugosc_tekstu': selectedText.length,
                'czy_numer_telefonu': isPhoneNumber,
                'czy_email': isEmail,
                'sekcja': section?.id || 'nieznana'
            });
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
                    gtag('event', 'wszystkie_cechy_obejrzane', {
                        'event_category': 'Zaangazowanie',
                        'liczba_kart': totalCharCards
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
            gtag('event', 'wszystkie_modele_obejrzane', {
                'event_category': 'Zaangazowanie',
                'liczba_modeli': modelCards.length
            });
        }
    }, { threshold: 0.6 });

    modelCards.forEach(card => modelCardObserver.observe(card));
});
