export async function loadFooter() {
    const response = await fetch('./partials/footer.html');
    const html = await response.text();
    document.getElementById('footer-container').innerHTML = html;
}