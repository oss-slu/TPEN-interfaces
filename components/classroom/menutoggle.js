function toggleMenu() {
    var navbar = document.getElementById("navbar");
    if (navbar.className === "navbar") {
        navbar.className += " responsive";
    } else {
        navbar.className = "navbar";
    }
}

// Function to display login alert
function loginAlert() {
    const username = document.getElementById("username").value;
    if (username) {
        alert("Welcome Back " + username + "!");
    }
}

// Event listener for the login button
document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.querySelector(".submit-button");
    loginButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent form submission
        loginAlert();
    });
});