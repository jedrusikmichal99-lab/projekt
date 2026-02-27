document.addEventListener('DOMContentLoaded', function() {
    const banner = document.getElementById('cookie-consent-banner');
    const acceptAllBtn = document.getElementById('cookie-accept-all');
    const savePrefsBtn = document.getElementById('cookie-save-prefs');
    const rejectAllBtn = document.getElementById('cookie-reject-all');
    const analyticsCheckbox = document.getElementById('cookie-analytics');
    const marketingCheckbox = document.getElementById('cookie-marketing');

    if (!banner) return;

    const savedConsent = localStorage.getItem('cookie_consent');

    if (savedConsent) {
        banner.style.display = 'none';
        const consent = JSON.parse(savedConsent);
        applyConsent(consent);
    }

    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', function() {
            const consent = {
                analytics: true,
                marketing: true
            };

            saveConsent(consent);
            applyConsent(consent);
            hideBanner();
        });
    }

    if (savePrefsBtn) {
        savePrefsBtn.addEventListener('click', function() {
            const consent = {
                analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
                marketing: marketingCheckbox ? marketingCheckbox.checked : false
            };

            saveConsent(consent);
            applyConsent(consent);
            hideBanner();
        });
    }

    if (rejectAllBtn) {
        rejectAllBtn.addEventListener('click', function() {
            const consent = {
                analytics: false,
                marketing: false
            };

            saveConsent(consent);
            applyConsent(consent);
            hideBanner();
        });
    }

    function saveConsent(consent) {
        localStorage.setItem('cookie_consent', JSON.stringify(consent));
    }

    function applyConsent(consent) {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': consent.analytics ? 'granted' : 'denied',
                'ad_storage': consent.marketing ? 'granted' : 'denied',
                'ad_user_data': consent.marketing ? 'granted' : 'denied',
                'ad_personalization': consent.marketing ? 'granted' : 'denied'
            });
        }
    }

    function hideBanner() {
        banner.classList.add('hiding');
        setTimeout(() => {
            banner.style.display = 'none';
            banner.classList.remove('hiding');
        }, 300);
    }
});
