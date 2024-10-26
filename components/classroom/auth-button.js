class AuthButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const token = this.getTokenFromURL();
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

        this.shadowRoot.querySelector('#auth-btn').addEventListener('click', () => {
            if (token) {
                this.logout();
            } else {
                this.login();
            }
        });
    }

    getTokenFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('idToken');
    }

    login() {
        const redirectURL = "http://127.0.0.1:5500/TPEN-interfaces/components/classroom/index.html?idToken=myToken";
        //const loginURL = `https://tpen3.url/centralLogin?redirect=${encodeURIComponent(redirectURL)}`;
        window.location.href = redirectURL;
    }

    logout() {
        //const logoutURL = `https://tpen3.url/centralLogout?redirect=${encodeURIComponent("http://127.0.0.1:5500/TPEN-interfaces/components/classroom/login.html")}`;
        window.location.href = "http://127.0.0.1:5500/TPEN-interfaces/components/classroom/login.html";
    }
}

customElements.define('auth-button', AuthButton);