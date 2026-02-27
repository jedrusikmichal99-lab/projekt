document.addEventListener('DOMContentLoaded', () => {
    // 1. Płynne przewijanie do sekcji
    const navLinks = document.querySelectorAll('#navbar ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Sprawdzenie, czy to jest link do sekcji w tej samej stronie
            if (this.hash !== "") {
                e.preventDefault();
                
                const hash = this.hash;
                const targetElement = document.querySelector(hash);

                if (targetElement) {
                    // Użycie metody scrollIntoView z opcją smooth
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 2. Prosta walidacja formularza kontaktowego (podstawowa)
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Przykład prostej walidacji po stronie klienta
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (name === "" || email === "" || message === "") {
                alert('Proszę wypełnić wszystkie pola formularza.');
                e.preventDefault(); 
                // W rzeczywistym projekcie należy użyć bardziej zaawansowanej walidacji i wysyłki AJAX
            } else {
                 // W przypadku braku backendu do faktycznej wysyłki:
                 alert('Dziękujemy za wiadomość! Skontaktujemy się z Tobą najszybciej jak to możliwe.');
                 e.preventDefault();
                 contactForm.reset();
            }
        });
    }

});