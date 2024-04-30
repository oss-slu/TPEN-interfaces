export class UserAPI {
  constructor() {
    this.baseURL = "https://three.t-pen.org/v1/"
    this.token = window.TPEN_USER
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

  async updateRecord() {
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
}
