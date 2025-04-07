export async function loadHeader() {
    const response = await fetch('/TPEN-interfaces/components/classroom/partials/header.html');
    const html = await response.text();
    document.getElementById('header-container').innerHTML = html;
    
    // Reattach the hamburger toggle behavior after loading
    window.toggleMenu = function () {
        const navbar = document.getElementById('navbar');
        navbar.classList.toggle('responsive');
    };

    document.addEventListener('click', (event) => {
        const navbar = document.getElementById('navbar');
        const menuIcon = document.querySelector('.hamburger-menu');
        if (!navbar.contains(event.target) && !menuIcon.contains(event.target)) {
            if (navbar.classList.contains('visible')) {
                navbar.classList.add('closing');
                setTimeout(() => {
                    navbar.classList.remove('visible', 'closing');
                }, 400);
            }
        }
    });
}