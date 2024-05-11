export class User {
  #authentication
  constructor(userId) {
    this.userId = userId
    // this.baseURL = "https://dev.api.t-pen.org"
    this.baseURL = "http://localhost:3009"
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
    const headers = this.#authentication
      ? new Headers({Authorization: `Bearer ${this.#authentication}`})
      : new Headers()
    fetch(serviceAPI, {headers})
      .then((response) => {
        if (!response.ok) Promise.reject(response)
        const data = response.json()
        Object.assign(this, data)
      })
      .catch((err) => {
        throw new Error(err)
      }) 
  }

  async getProjects() {
    const headers = new Headers({
      Authorization: `Bearer ${this.#authentication}`
    })

    return fetch(`${this.baseURL}/my/projects`, {headers})
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(response)
        }
        return response.json()
      })
      .catch((error) => {
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
            Error ${error.status}: ${error.statusText}
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
// Sample Usage
// const currentUser = new User()
// currentUser.authentication = "User token here"

// currentUser.renderProjects("projects")
// console.log(await currentUser.getProfile())
// console.log("NickName", currentUser.nickname)
// console.log("Picture", currentUser.picture)
// console.log(await currentUser.getProjects())
// console.log(currentUser)
