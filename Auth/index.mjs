/**
 * @module Auth
 * @description Adds custom handling for TPEN3 Centralized Login
 * @author cubap
 * @version 0.1
 */

class Auth {
    #CENTRAL = "https://three.t-pen.org/"
    #LOGIN = "login"
    #LOGOUT = "logout"
    #token = null

    constructor() {
        this.authElems = new Set([...document.querySelectorAll("[require-auth]")])
        this.init()
    }

    static loadEvent = "DOMContentLoaded"
    static authEvent = "tpen-authenticated"
    static authErrorEvent = "tpen-authentication-error"
    static logoutEvent = "tpen-logout-requested"
    static userResetEvent = "tpen-user-reset"

    /**
     * Looks for a user token in the URL, authentication stored in localStorage.
     * Flows appropriately to the login or logout methods.
     * @returns {void}
     */
    init() {
        if (window.location.search.includes("idToken")) {
            this.#token = new URLSearchParams(window.location.search).get("idToken")
            this.saveToken()
            this.apply()
            return
        }
        this.#token = this.getToken()
        if (this.#token) {
            this.apply()
            return
        }
        // no auth found, redirect to login if auth is required
        if (this.authElems.length) {
            this.login()
            return
        }
        console.log("No authentication requested.")
    }

    /**
     * Applies authentication to the page.
     * @returns {void}
     */
    apply(elem=null) {
        if(!this.#token) {
            this.login()
            return
        }
        const decodedToken = jwt_decode(this.#token)
        this.user ??= decodedToken['http://store.rerum.io/agent'].split("/").pop()
        this.expires ??= decodedToken.expires
        if (elem) {
            elem.setAttribute("tpen-user", this.user)
            elem.setAttribute("tpen-token-expires", this.expires)
            elem.tpenAuthToken = this.#token
            this.authElems.add(elem)
            return
        }
        this.authElems.forEach(elem => {
            elem.setAttribute("tpen-user", this.user)
            elem.setAttribute("tpen-token-expires", this.expires)
            elem.tpenAuthToken = this.#token
        })
    }

    /**
     * Clears the user out of the current session.
     * @returns {void}
     */
    resetUser() {
        this.#token = null
        this.removeToken()
        this.authElems.forEach(elem => {
            elem.setAttribute("tpen-user", "")
            elem.setAttribute("tpen-token-expires","")
            elem.tpenAuthToken = null
        })
        this.dispatchEvent(Auth.userResetEvent)
    }

    /**
     * Redirects to the centralized login page.
     * @returns {void}
     */
    login() {
        const redirect = location.href
        location.href = `${this.#CENTRAL}${this.#LOGIN}?returnTo=${encodeURIComponent(redirect)}`
    }

    /**
     * Redirects to the centralized logout page.
     * @returns {void}
     */
    logout() {
        const redirect = document.location.origin + document.location.pathname
        location.href = `${this.#CENTRAL}${this.#LOGOUT}?returnTo=${encodeURIComponent(redirect)}`
    }

    /**
     * Saves the token to localStorage.
     * @returns {void}
     */
    saveToken() {
        localStorage.setItem("tpen-auth", this.#token)
    }

    /**
     * Retrieves the token from localStorage.
     * @returns {string}
     */
    getToken() {
        return localStorage.getItem("tpen-auth")
    }

    /**
     * Removes the token from localStorage.
     * @returns {void}
     */
    removeToken() {
        return localStorage.removeItem("tpen-auth")
    }

}
