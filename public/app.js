// Jednoduchý skript pro mobilní menu
const menuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav ul');

menuBtn.addEventListener('click', () => {
    if (nav.style.display === 'flex') {
        nav.style.display = 'none';
        nav.style.flexDirection = 'row';
        nav.style.position = 'static';
        nav.style.width = 'auto';
        nav.style.backgroundColor = 'transparent';
        nav.style.padding = '0';
    } else {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '70px';
        nav.style.left = '0';
        nav.style.width = '100%';
        nav.style.backgroundColor = 'white';
        nav.style.padding = '20px';
        nav.style.boxShadow = '0 10px 10px rgba(0,0,0,0.1)';
    }
});
/* --- SLIDESHOW (PROLÍNÁNÍ FOTEK) --- */
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide() {
    // 1. Odebereme třídu 'active' aktuální fotce (začne mizet)
    slides[currentSlide].classList.remove('active');

    // 2. Vypočítáme index další fotky (pokud jsme na konci, vrátí se na 0)
    currentSlide = (currentSlide + 1) % slides.length;

    // 3. Přidáme třídu 'active' nové fotce (začne se objevovat)
    slides[currentSlide].classList.add('active');
}

// Spustit interval každých 4000 milisekund (4 sekundy)
if (slides.length > 0) {
    setInterval(nextSlide, 8000);
}
