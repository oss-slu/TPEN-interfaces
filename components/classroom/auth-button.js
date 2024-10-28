class AuthButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // When the component is added to the DOM, call the render function
        this.render();
    }

    render() {
        // Retrieve the token from the URL to determine login state
        const token = this.getTokenFromURL();

        // Render the button with styles and set its label based on the token presence
        this.shadowRoot.innerHTML = `
            <style>
                button {
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                    background: #516059;
                    color: #fff;
                    border: none;
                }
                button:hover {
                    background: #667a71;
                }
            </style>
            <button id="auth-btn">${token ? "Logout" : "Login"}</button>
        `;

        // If the token exists (logged in), logout on click; otherwise, login
        this.shadowRoot.querySelector('#auth-btn').addEventListener('click', () => {
            if (token) {
                this.logout();
            } else {
                this.login();
            }
        });
    }

    getTokenFromURL() {
        // Get URL parameters and return the value of 'idToken' parameter
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('idToken');
    }

    // Redirect URL with token in the query parameters
    // Redirect to the URL, which will update the token in the URL
    login() {
        const token = "myToken"; // Replace this with actual token logic
        const redirectURL = `http://127.0.0.1:5500/TPEN-interfaces/components/classroom/login.html?idToken=${token}`;
        window.location.href = redirectURL;
    }

    // Define the logout URL, which does not include a token, effectively "logging out"
    logout() {
        const logoutURL = "http://127.0.0.1:5500/TPEN-interfaces/components/classroom/login.html";
        window.location.href = logoutURL;
    }
}

// Register the custom element with the browser
customElements.define('auth-button', AuthButton);