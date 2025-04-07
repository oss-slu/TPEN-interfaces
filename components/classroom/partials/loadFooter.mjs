export async function loadFooter() {
    const response = await fetch('/TPEN-interfaces/components/classroom/partials/footer.html');
    const html = await response.text();
    document.getElementById('footer-container').innerHTML = html;
}