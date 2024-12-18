import { eventDispatcher } from "../TPEN/events.mjs"
/** Description: to use this class, initialize new class, set authentication token, then call required methods
 * 
 */
export default class User {
  #authentication
  baseURL = "https://dev.api.t-pen.org"

  constructor(_id) {
    this._id = _id
    // if (this.#authentication || this._id) this.getProfile()
  }

  /**
   * @param {any} token
   */
  set authentication(token) {
    let isNewToken = false;
    if (token != this.#authentication) {
      isNewToken = true
    }
    this.#authentication = token
    if (isNewToken) this.getProfile()
  }

  async getProfile() {
    if (!this.#authentication && !this._id)
      throw Error("User ID is required")

    const serviceAPI = `${this.baseURL}/${this.#authentication ? "my/profile" : `user/:${this._id}`
      }`
    const headers = this.#authentication
      ? new Headers({ Authorization: `Bearer ${this.#authentication}` })
      : new Headers()
    await fetch(serviceAPI, { headers })
      .then((response) => {
        if (!response.ok) Promise.reject(response)
        return response.json()
      })
      .then((data) => {
        Object.assign(this, data)
        // the public user object has no displayName tag, it has a name instead, hence the check below
        this.displayName = data.profile.displayName ?? data.name ?? "Anonymous"
        if (data._sub) {
          eventDispatcher.dispatch("tpen-user-loaded", this)
        }
      })
    return this
  }

  async getProjects() {
    const headers = new Headers({
      Authorization: `Bearer ${this.#authentication}`
    })

    return fetch(`${this.baseURL}/my/projects`, { headers })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(response)
        }
        return response.json()
      })
      .catch((error) => {
        // Alert user with error message
        throw error
      })
  }

  renderProjects(containerId) {
    let projectsList = document.getElementById(containerId)

    if (!containerId || !projectsList) {
      if (!containerId) {
        alert("Provide id for container to render projects")
      } else {
        alert(`Container element with ID '${containerId}' not found.`)
      }

      throw new Error(
        "Provide container id and attach id to HTML element where projects should be rendered"
      )
    }

    this.getProjects()
      .then((projects) => {
        projectsList.innerHTML = ""

        if (projects.length) {
          projects.forEach((project) => {
            const projectTemplate = `
            <li>
              ${project.title}
              <div class="manage">
                <span>Resume</span>
                <span>Manage</span>
              </div>
            </li>
          `

            projectsList.insertAdjacentHTML("beforeend", projectTemplate)
          })
        } else {
          projectsList.innerHTML = "No projects yet. Create one to get started"
        }
      })
      .catch((error) => {
        const errorTemplate = `
          <li>
            Error ${error.status ?? 500}: ${error.statusText ?? "Unknown Server error"}
          </li>
        `
        projectsList.insertAdjacentHTML("beforeend", errorTemplate)
        throw error
      })
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

  async addToPublicProfile(data) {
    try {
      const userRecord = await this.getProfile()
      const publicInfo = { ...userRecord?.profile, ...data }
      const payload = { ...userRecord, profile: publicInfo }
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
