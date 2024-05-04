export class UserAPI {
  constructor() {
    this.baseURL = "https://dev.t-pen.org/v1/"
    this.token = this.localInfo().authorization
    this.displayName = this.localInfo().nickname
    // this.displayName = this.getDisplayName()
  }

  localInfo() {
    return window.TPEN_USER
  }

  async getProfile() {
    try {
      const response = await fetch(`${this.baseURL}/my/profile`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching user by ID:", error)
      throw error
    }
  }

  async updateRecord(data) {
    try {
      const response = await fetch(`${this.baseURL}/my/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`
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

  async getProjects() {
    try {
      const response = await fetch(`${this.baseURL}/my/projects`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      const projects = await response.json()
      return projects
    } catch (error) {
      console.error("Error fetching user projects:", error)
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
