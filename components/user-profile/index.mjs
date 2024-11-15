import { eventDispatcher } from '../../api/events.mjs'
import TPEN from '../../api/TPEN.mjs'

class UserProfile extends HTMLElement {
    #TPEN = new TPEN()

    user = this.#TPEN.currentUser

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        eventDispatcher.on('tpen-user-loaded', ev => {
            this.updateProfile(ev.detail)
        })
    }

    connectedCallback() {
        this.render()
        TPEN.attachAuthentication(this)
    }

    updateProfile(profile) {
        this.shadowRoot.querySelector('#name').textContent = profile.displayName
        this.shadowRoot.querySelector('#email').textContent = profile.email
        this.shadowRoot.querySelector('#profile').textContent = JSON.stringify(this.getPublicProfile(profile), null, 2).replace(/^\s*[{]\s*|^\s*[}]\s*$|^\s*[\r\n]+/gm, '')
        this.shadowRoot.querySelector('#metadata').textContent = JSON.stringify(this.getMetadata(profile), null, 2).replace(/^\s*[{]\s*|^\s*[}]\s*$|^\s*[\r\n]+/gm, '')
    }

    getMetadata(userData) {
        // return a new object without certain keys from the profile object
        const { baseURL, profile, displayName, '@type': type, ...metadata } = userData
        return metadata
    }

    getPublicProfile(profile) {
        // return only certain keys from the profile object
        return profile.profile
    }

    async render() {
        this.shadowRoot.innerHTML = `
            <div>
                <p><em>Display Name:</em> <span id="name">loading...</span></p>
                <p><em>Email:</em> <span id="email">loading...</span></p>
                <p><em>Public Profile:</em><pre id="profile">loading...</pre></p>
                <p><em>Metadata:</em><pre id="metadata">loading...</pre></p>
            </div>
        `
    }
}

customElements.define('tpen-user-profile', UserProfile)
