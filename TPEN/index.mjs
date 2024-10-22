import User from "./User.mjs"
class TPEN {
    #notReady = false

    constructor(tinyThingsURL = "https://dev.tiny.t-pen.org",servicesURL = "https://dev.api.t-pen.org") {
    // constructor(tinyThingsURL = "https://tiny.t-pen.org",servicesURL = "https://api.t-pen.org") {
        this.tinyThingsURL = tinyThingsURL
        this.servicesURL = servicesURL
        this.currentUser = null
        this.activeProject = null
        this.activeCollection = null
    }

    async reset(force = false) {
        if(this.#notReady && !force) {
            return this = new TPEN()
        }
        throw new Error("TPEN instance has open connections.  Use the force parameter to override.")
    }

    getUser() {
        // Returns the currently authenticated User
        return new User(this.currentUser)
    }

    getActiveProject() {
        // Returns the currently active Project
        return new Project(this.activeProject)
    }

    getActiveCollection() {
        // Returns the currently active Collection
        return new Collection(this.activeCollection)
    }

    getUserProjects() {
        // Returns a list of all the Projects the current user has access to
        return User(this.currentUser).getUserProjects()
    }

    async getAllPublicProjects() {
        // Returns the list of all public Projects and Collections
        const response = await fetch(`${this.servicesURL}/publicProjects`)
        return response.json()
    }

    logout() {
        // Logout the currentUser of the browser session
        this.currentUser = null
    }

    login() {
        // Forces the login/signup interface to appear
        // Simulate login logic
        this.currentUser = "newUser"
        window.location.reload()
    }

    authenticate() {
        // Attempts to silently log into TPEN
        if (!this.currentUser) {
            this.login()
        } else {
            window.location.reload()
        }
    }
}

// Placeholder classes for User, Project, and Collection
class User {
    constructor(id) {
        this.id = id
    }

    getUserProjects() {
        // Simulate fetching user projects
        return []
    }
}

class Project {
    constructor(id) {
        this.id = id
    }
}

class Collection {
    constructor(id) {
        this.id = id
    }
}

export default TPEN
