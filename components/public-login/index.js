/**
 * @module AuthButton Adds custom element for login/logout of TPEN3 Centralized Login
 * @author thehabes, cubap
 */

import TPEN from "../../api/TPEN.mjs"
import { eventDispatcher } from "../../api/events.mjs"

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

  login = TPEN.login

  logout = TPEN.logout
}

customElements.define('auth-button', AuthButton)
