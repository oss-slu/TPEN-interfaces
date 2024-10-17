/**
 * @module AuthButton Adds custom element for login/logout of TPEN3 Centralized Login
 * @author thehabes
 */

const CENTRAL = "https://three.t-pen.org"

class AuthButton extends HTMLButtonElement {

  login(redirect=location.href) {
    location.href = `${CENTRAL}/login?returnTo=${encodeURIComponent(redirect)}`
  }

  logout(redirect=location.href) {
    location.href = `${CENTRAL}/logout?returnTo=${encodeURIComponent(redirect)}`
  }

  constructor() {
    super(); // Always call the superconstructor first
    this.attachShadow({mode: "open"})
    const returnTo = document.location.href
    const incomingToken = new URLSearchParams(window.location.search).get("idToken")
    const userToken = incomingToken ?? ""
    this.setAttribute("value", "Login")
    
    // Redirect to login if no userToken
    if(userToken) {
      this.setAttribute("loggedIn", userToken)
      this.setAttribute("value", "Logout")
    }
    // Add your custom logic here
    this.addEventListener('click', () => {
      if(this?.getAttribute("loggedIn")) {
        logout()
        return
      }
      login()
    });
  }
  
}

customElements.define('auth-button', AuthButton, { extends: 'button' });
