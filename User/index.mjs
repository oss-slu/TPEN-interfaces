window.TPEN_USER = {
  "http://store.rerum.io/agent":
    "https://store.rerum.io/v1/id/65f8615ec43bd66568c666fa",
  "http://rerum.io/app_flag": ["tpen", "dla"],
  "http://dunbar.rerum.io/app_flag": ["tpen", "dla"],
  "http://rerum.io/user_roles": {
    roles: [
      "dunbar_user_public",
      "glossing_user_public",
      "lrda_user_public",
      "rerum_user_public",
      "tpen_user_admin",
      "tpen_user_inactive"
    ]
  },
  "http://dunbar.rerum.io/user_roles": {
    roles: [
      "dunbar_user_public",
      "glossing_user_public",
      "lrda_user_public",
      "rerum_user_public",
      "tpen_user_admin",
      "tpen_user_inactive"
    ]
  },
  nickname: "onoja.jsdev",
  name: "onoja.jsdev@gmail.com",
  picture:
    "https://s.gravatar.com/avatar/596f8a66f8aa1a42661dc102e142da00?s=480&r=pg&d=https%3A%2F%2Fcenterfordigitalhumanities.github.io%2Frerum-consortium%2Flogo.png",
  updated_at: "2024-05-08T03:00:17.755Z",
  email: "onoja.jsdev@gmail.com",
  email_verified: false,
  iss: "https://cubap.auth0.com/",
  aud: "bBugFMWHUo1OhnSZMpYUXxi3Y1UJI7Kl",
  iat: 1715137220,
  exp: 1715173220,
  sub: "auth0|65f8615d6c6beb2315cef822",
  at_hash: "cDMcK30oBfxdGaTyyaIRhA",
  sid: "3MQvopXwsw8C8l7cyvAgcbXL-6aj4KVP",
  nonce: "5ZKtIXrUl.IEP6~MaA.vPNQtZvKJpEQs",
  authorization:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vc3RvcmUucmVydW0uaW8vYWdlbnQiOiJodHRwczovL3N0b3JlLnJlcnVtLmlvL3YxL2lkLzY1Zjg2MTVlYzQzYmQ2NjU2OGM2NjZmYSIsImh0dHA6Ly9yZXJ1bS5pby9hcHBfZmxhZyI6WyJ0cGVuIiwiZGxhIl0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vYXBwX2ZsYWciOlsidHBlbiIsImRsYSJdLCJodHRwOi8vcmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9hZG1pbiIsInRwZW5fdXNlcl9pbmFjdGl2ZSJdfSwiaHR0cDovL2R1bmJhci5yZXJ1bS5pby91c2VyX3JvbGVzIjp7InJvbGVzIjpbImR1bmJhcl91c2VyX3B1YmxpYyIsImdsb3NzaW5nX3VzZXJfcHVibGljIiwibHJkYV91c2VyX3B1YmxpYyIsInJlcnVtX3VzZXJfcHVibGljIiwidHBlbl91c2VyX2FkbWluIiwidHBlbl91c2VyX2luYWN0aXZlIl19LCJpc3MiOiJodHRwczovL2N1YmFwLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NWY4NjE1ZDZjNmJlYjIzMTVjZWY4MjIiLCJhdWQiOlsiaHR0cHM6Ly9jdWJhcC5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vY3ViYXAuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcxNTEzNzIyMCwiZXhwIjoxNzE1MTQ0NDIwLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIHVwZGF0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgb2ZmbGluZV9hY2Nlc3MiLCJhenAiOiJiQnVnRk1XSFVvMU9oblNaTXBZVVh4aTNZMVVKSTdLbCJ9.oCTEhwVDxmRTezukdBxNwYufm1O2GoNbfZuqrtcF4D0NkHGLZjcEHushCznOtroazJF99OSMDy4sXwphfk3XRUNzYMg0uPrODdE4IooYyuh7jdm-Jdj0LxTMNtGR_Q3Ig0GLAz134LvEqMCE2nqlTmHM1jJmq6-GWGHFcSz9mm9aign0SQDyVvmBm0Ejkz71lWAIahe-oNRat8qPej3TQqwz3VDjOHYT_kaQzH5izqUUlqu4EtAyJUCoG6F-2RWxe7Sme3SyPDlRxI61YXAmF63nMBBahLjisCMbKEx1OqFGlUjt5NtUyXfe9B8YzIwRX1sHrk-XhJDmeqW0baku0g"
}

export class User {
  #authentication
  constructor(userId) {
    this.userId = userId
    this.baseURL = "https://dev.api.t-pen.org"
    if (this.#authentication || this.userId) this.getProfile()
  }

  /**
   * @param {any} token
   */
  set authentication(token) {
    if (!token) return Error("Authorization token is required")
    this.#authentication = token
    this.getProfile()
  }

  async getProfile() {
    if (!this.#authentication && !this.userId)
      return new Error("User ID is required")

    const serviceAPI = `${this.baseURL}/${
      this.#authentication ? "my/profile" : `user/:${this.userId}`
    }`
    const headers = this.authentication
      ? new Headers({Authorization: `Bearer ${this.#authentication}`})
      : new Headers()
    try {
      const response = await fetch(serviceAPI, {headers})
      const data = await response.json()
      Object.assign(this, data)
      return data
    } catch (error) {
      console.error(error)
      // throw new Error(`${error.status} ${error.statusText}`)
    }
  }

  async getProjects() {
    const headers = new Headers({
      Authorization: `Bearer ${this.#authentication}`
    })
    try {
      const response = await fetch(`${this.baseURL}/my/projects`, {headers})
      const projects = await response.json()
      return projects
    } catch (error) {
      console.error("Error fetching user projects:", error)
      // throw error
    }
  }

  async renderProjects(containerId) {
    const projectsList = document.getElementById(containerId)
    if (!projectsList) {
      console.error(`Container element with ID '${containerId}' not found.`)
      return
    }

    try {
      const projects = await this.getProjects()
      // const projects = [
      //   {title: "Harry Potter, the end", creator: "VOO"},
      //   {title: "DNA Sequensing", creator: "John Doe"}
      // ]

      projectsList.innerHTML = ""

      projects.forEach((project) => {
        const projectTemplate = `
              <li > 
               ${project.creator}, ${project.title}
                <div class="manage">
                  <span>Resume</span>
                  <span>Manage</span>
                </div>
              </li>
            `

        projectsList.insertAdjacentHTML("beforeend", projectTemplate)
      })
    } catch (error) {
      console.error("Error rendering projects:", error)
    }
  }

  async updateRecord(data) {
    try {
      const response = await fetch(`${this.baseURL}/my/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.#authentication}`
        },
        body: JSON.stringify(data)
      })
      const updatedUser = await response.json()
      return updatedUser
    } catch (error) {
      console.error("Error updating user record:", error)
      throw error
    }
  }

  async getDisplayName() {
    const userInfo = await this.getProfile()
    return userInfo?.displayName ?? userInfo?.profile?.displayName
  }

  async addToPublicProfile(data) {
    try {
      const userRecord = await this.getProfile()
      const publicInfo = {...userRecord?.profile, ...data}
      const payload = {...userRecord, profile: publicInfo}
      const response = await this.updateRecord(payload)
      return response
      // We can either manipulate the data this way and use the the same route to handle all updates or,
      // we can create a new route in Services and move these manipuations there.
      // A third option would be to add a tag in the payload or via query strings
    } catch (error) {
      console.error("Error updating user record:", error)
      throw error
    }
  }

  async updatePrivateInformation(data) {
    const response = await this.updateRecord(data)
    return response
  }
}

const currentUser = new User("660d801652df1c2243d6d935")
currentUser.authentication = window.TPEN_USER.authorization
currentUser.renderProjects("projects")

console.log(await currentUser.getProfile())
// console.log( currentUser.displayName)
// console.log(await currentUser.getProjects())
