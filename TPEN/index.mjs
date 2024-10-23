/**
 * The TPEN class is the main class for accessing the TPEN services API. It is used to initialize the TPEN module and to make calls to the API.
 * @module TPEN
 * @class
 * @example https://centerfordigitalhumanities.github.io/TPEN-interfaces/classes/TPEN
 * @param {String} tinyThingsURL - The URL of the TinyThings API. Defaults to "https://dev.tiny.t-pen.org"
 * @imports {User, Project, Transcription}
 */

import { User } from './User/index.mjs'
// import { Project } from './Project/index.mjs'

export class TPEN {
    #actionQueue = []
    #currentUser
    #activeProject
    #activeCollection

    constructor(tinyThingsURL = "https://dev.tiny.t-pen.org") {
        this.tinyThingsURL = tinyThingsURL
        this.servicesURL = "https://dev.api.t-pen.org"
    }

    async reset(force = false) {
        return new Promise((resolve, reject) => {
            // Logic to reset the TPEN object
            if (force) {
                resolve(this.#actionQueue)
            } else {
                reject(this.#actionQueue)
            }
        })
    }

    get currentUser() {
        return this.#currentUser
    }

    set currentUser(user) {
        // confirm user is a User object
        if (!(user instanceof User)) {
            throw new Error("Invalid user object")
        }
        this.#currentUser = (this.#currentUser?._id === user._id)
            ? Object.assign(this.#currentUser, user)
            : user
        return this
    }

    get activeProject() {
        return this.#activeProject
    }

    set activeProject(project) {
        this.#activeProject = project
    }

    get activeCollection() {
        return this.#activeCollection
    }

    set activeCollection(collection) {
        this.#activeCollection = collection
    }

    async getUserProjects() {
        return this.#currentUser.getUserProjects()
    }

    async getAllPublicProjects() {
        // Logic to fetch all public projects
        return fetch(`${this.servicesURL}/projects/public`)
            .then(response => response.json())
    }

    getAuthorization() {
        return localStorage.getItem("userToken") ?? false
    }

    static logout(redirect = origin + pathname) {
        this.currentUser = null
        localStorage.clear()
        location.href = `https://three.t-pen.org/logout?returnTo=${encodeURIComponent(redirect)}`
        return
    }

    static login(redirect = location.href) {
        location.href = `https://three.t-pen.org/login?returnTo=${encodeURIComponent(redirect)}`
        return
    }

    static attachAuthentication(element) {
        if(Array.isArray(element)) {
            element.forEach(elem => this.attachAuthentication(elem))
            return
        }
        const token = new URLSearchParams(location.search).get("idToken") ?? this.getAuthorization()
        if (!token) {
            this.login()
            return
        }
        element.setAttribute("require-auth", true)
        element.addEventListener("tpen-authenticated", updateUser)
        document.dispatchEvent(new CustomEvent("tpen-authenticated", { detail: { authorization: token } }))
    }
}

function updateUser(event) {
    this.userToken = event.detail.authorization
    const decodedToken = JSON.parse(atob(this.userToken.split(".")[1]))
    const userId = decodedToken['http://store.rerum.io/agent'].split("/").pop()
    this.setAttribute("tpen-user-id", userId)
    this.querySelectorAll("[tpen-creator]").forEach(elem => elem.setAttribute("tpen-creator", `https://store.rerum.io/v1/id/${userId}`))
}
