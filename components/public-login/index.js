/**
 * @module AuthButton Adds custom element for login/logout of TPEN3 Centralized Login
 * @author thehabes, cubap
 */

import TPEN from "../../TPEN/index.mjs"
import { eventDispatcher } from "../../TPEN/events.mjs"

class AuthButton extends HTMLElement {
  #TPEN = new TPEN()

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    const button = document.createElement("button")
    button.innerText = "LOGIN"
    eventDispatcher.on("tpen-authenticated", ev => {
      button.setAttribute("loggedIn", true)
      button.innerText = "LOGOUT"
    })
    button.addEventListener('click', () => this[button.getAttribute("loggedIn") ? 'logout' : 'login']())
    TPEN.attachAuthentication(this)
    this.shadowRoot.append(button)
  }

  /**
    * Use the TPEN3 Central Login to redirect back to this page with a valid ID Token.
  */
  login() {
    const redirect = location.href
    location.href = `${CENTRAL}/login?returnTo=${encodeURIComponent(redirect)}`
    return
  }

  /**
    * Use the TPEN3 Central Logout to retire the current token and redirect back to this page.
    * Make sure to remove the token if you have it stored anywhere, such as in the address bar or in localStorage.
  */
  logout() {
    const where = location.href
    let link = new URL(where)
    link.searchParams.delete("idToken")
    const redirect = link.toString()
    location.href = `${CENTRAL}/logout?returnTo=${encodeURIComponent(redirect)}`
    return
  }
  
}

customElements.define('auth-button', AuthButton)
