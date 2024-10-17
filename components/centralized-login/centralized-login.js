/**
 * @module AuthButton Adds custom element for login/logout of TPEN3 Centralized Login
 * @author thehabes
 */

const CENTRAL = "http://localhost:3000"

class AuthButton extends HTMLElement {

  constructor() {
    super(); // Always call the superconstructor first
    this.attachShadow({mode: "open"})
    
    const incomingToken = new URLSearchParams(window.location.search).get("idToken")
    const userToken = incomingToken ?? ""
    const button = document.createElement("button")
    button.innerText = "LOGIN"
    
    // Redirect to login if no userToken
    if(userToken) {
      button.setAttribute("loggedIn", userToken)
      button.innerText = "LOGOUT"
    }
    // Add your custom logic here
    button.addEventListener('click', () => {
      if(button?.getAttribute("loggedIn")) {
        this.logout()
        return
      }
      this.login()
    });
    this.shadowRoot.append(button)
  }

  login() {
    const redirect = document.location.href
    location.href = `${CENTRAL}/login?returnTo=${encodeURIComponent(redirect)}`
    return
  }

  logout() {
    const redirect = document.location.origin + document.location.pathname
    location.href = `${CENTRAL}/logout`
    
    // UGH if only.  Centralized logout can only returnTo CENTRAL
    //location.href = `${CENTRAL}/logout?returnTo=${encodeURIComponent(redirect)}`

    // We put it on the button as an attribute and the url knows it.  All knowledge of this token is removed with this redirect.
    //location.href = location.pathname


    // Can we logout in a new tab, then close that tab somehow, and also do the redirect trick?  Probably thinking too hard.
    // const page = `${CENTRAL}/logout?returnTo=${encodeURIComponent(redirect)}`
    // let logoutWindow = window.open(page, '_blank')
    // location.href = location.pathname
  }
}

customElements.define('auth-button', AuthButton);
