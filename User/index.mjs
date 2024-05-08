export class User {
  #authentication
  constructor(userId) {
    this.userId = userId
    this.baseURL = "https://dev.api.t-pen.org"
    // this.baseURL = "http://localhost:3009"
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
    try {
      const response = await fetch(serviceAPI, {headers})
      const data = await response.json()
      Object.assign(this, data)
      return data
    } catch (error) {
      console.error(error)
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
      throw error
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

      projectsList.innerHTML = ""

      projects.length
        ? projects.forEach((project) => {
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
        : (projectsList.innerHTML =
            "No projects yet. Create one to get started")
    } catch (error) {
      throw error
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

const currentUser = new User()
currentUser.authentication =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vc3RvcmUucmVydW0uaW8vYWdlbnQiOiJodHRwczovL3N0b3JlLnJlcnVtLmlvL3YxL2lkLzY1Zjg2MTVlYzQzYmQ2NjU2OGM2NjZmYSIsImh0dHA6Ly9yZXJ1bS5pby9hcHBfZmxhZyI6WyJ0cGVuIiwiZGxhIl0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vYXBwX2ZsYWciOlsidHBlbiIsImRsYSJdLCJodHRwOi8vcmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9hZG1pbiIsInRwZW5fdXNlcl9pbmFjdGl2ZSJdfSwiaHR0cDovL2R1bmJhci5yZXJ1bS5pby91c2VyX3JvbGVzIjp7InJvbGVzIjpbImR1bmJhcl91c2VyX3B1YmxpYyIsImdsb3NzaW5nX3VzZXJfcHVibGljIiwibHJkYV91c2VyX3B1YmxpYyIsInJlcnVtX3VzZXJfcHVibGljIiwidHBlbl91c2VyX2FkbWluIiwidHBlbl91c2VyX2luYWN0aXZlIl19LCJpc3MiOiJodHRwczovL2N1YmFwLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NWY4NjE1ZDZjNmJlYjIzMTVjZWY4MjIiLCJhdWQiOlsiaHR0cHM6Ly9jdWJhcC5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vY3ViYXAuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcxNTE5OTE2NiwiZXhwIjoxNzE1MjA2MzY2LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIHVwZGF0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgb2ZmbGluZV9hY2Nlc3MiLCJhenAiOiJiQnVnRk1XSFVvMU9oblNaTXBZVVh4aTNZMVVKSTdLbCJ9.dt5qt-fa5AAQU1HbNXuOb6yqoA9pHCzY0kdb4bMBM1skgQcZmLuHfflkqypwvCL90RDcWwyJKrJV81_iPxojdVAnYAC6U2t6o_rut2ND3bh3TtNZMV0lcr6d6BXXRHFF0rR4cNiGROrI7gbtjBKB2QcrahS_uRKP40HkMKxBAsaCps6ORyf-AurKQpFXMOovL5roHZe5eiGQDF5j2LcmRc3pur6jeEwFkt5qnE9RhW3JUPymgG7leCZShAwGjVDnddHTivHIJIK3Ekj3ZsrfNNNPNGtB-dCR2tUkZ_yWKapA9Jo-TbD5_klspk8xWm8cgaUuo_swrfhiQB9xUDwBsA"

currentUser.renderProjects("projects")
console.log(await currentUser.getProfile())
console.log( "NickName", currentUser.nickname)
console.log( "Picture", currentUser.picture)
console.log(await currentUser.getProjects())
