/**
 * @deprecated
 */
import { eventDispatcher } from "../api/events.mjs"
import TPEN from "../api/TPEN.mjs"
import User from "../api/User.mjs"

class ProfileInfo extends HTMLElement {

    user = TPEN.currentUser

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        eventDispatcher.on('tpen-user-loaded', ev => {
            this.render(ev.detail)
        })


    }

    async connectedCallback() {
        this.render()
        // TPEN.attachAuthentication(this)
    }

    async render() {
        const user = TPEN.currentUser
        console.log(user)
        this.shadowRoot.innerHTML = `
        <style>
            /* Add styles for the profile info */
            .profile {
                text-align: right;
                padding: 10px;
            }
        </style>
        <div class="profile">
            <p>User Name: ${user.displayName ?? user?.profile?.displayName}</p>
            <p>Email: ${user.email}</p>
        </div>
    `
    }
}

customElements.define('profile-info', ProfileInfo) 