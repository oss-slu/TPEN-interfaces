/**
 * Project API Link for user interfaces to import.
 * 
 * @author cubap
 * @type module
 * @version 0.0.1
 */
const baseURL = "http://localhost:3009"
let token = window.TPEN_USER?.authorization ?? "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vc3RvcmUucmVydW0uaW8vYWdlbnQiOiJodHRwczovL3N0b3JlLnJlcnVtLmlvL3YxL2lkLzY1Zjg2MTVlYzQzYmQ2NjU2OGM2NjZmYSIsImh0dHA6Ly9yZXJ1bS5pby9hcHBfZmxhZyI6WyJ0cGVuIiwiZGxhIl0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vYXBwX2ZsYWciOlsidHBlbiIsImRsYSJdLCJodHRwOi8vcmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9hZG1pbiIsInRwZW5fdXNlcl9pbmFjdGl2ZSJdfSwiaHR0cDovL2R1bmJhci5yZXJ1bS5pby91c2VyX3JvbGVzIjp7InJvbGVzIjpbImR1bmJhcl91c2VyX3B1YmxpYyIsImdsb3NzaW5nX3VzZXJfcHVibGljIiwibHJkYV91c2VyX3B1YmxpYyIsInJlcnVtX3VzZXJfcHVibGljIiwidHBlbl91c2VyX2FkbWluIiwidHBlbl91c2VyX2luYWN0aXZlIl19LCJpc3MiOiJodHRwczovL2N1YmFwLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NWY4NjE1ZDZjNmJlYjIzMTVjZWY4MjIiLCJhdWQiOlsiaHR0cHM6Ly9jdWJhcC5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vY3ViYXAuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcyNjA2MDE2OSwiZXhwIjoxNzI2MDY3MzY5LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIHVwZGF0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgb2ZmbGluZV9hY2Nlc3MiLCJhenAiOiJiQnVnRk1XSFVvMU9oblNaTXBZVVh4aTNZMVVKSTdLbCJ9.4lRHjWay4f0WGJ4qi1zaFYeBRF0YeYR7oN3_csYUUhC3dWFnFC_AV8ZvclAsdFPclZw_KnjxLLll6XTALLGp-IKepYg_zbbdWxXsapbsuqrQm_NtCG22Yg_INdNrCktr32TATIjhtsGhDKdcgGyXd_gQEIagzeouBxoe0MsP3njMtiekO-qnZUg2ScMP6w5hvuhmYE9tXfBUd9XjbH7BQE_qUeSV3tdyXXIcxj18WkjEn8TbrPv-dUtEYKa8Xy9N4RJiTHqTueOwIfqZFx_eRknT7TAdDtRB6YbqfuuGxcXemNM_COcKJ1lcbNGIRTtRIrDx97eC3iEwN6SDZvrwyQ"

export default class Project {
    constructor(projectID) {

        if (typeof projectID === "object") {
            // Assume configuration object
            this.data = projectID
            return
        }

        if (typeof projectID === "string") {
            this.id = projectID
            return
        }

        throw new Error("Project ID or configuration is required")
    }

    // new private function getById()
    /**
     * Load project information from TPEN Services about the project 
     * for rendering user interface.
     * @param {String} projectID short hash id for TPEN project
     */

    async loadData() {
        return await fetch(`${baseURL}/project/${this.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response)
                }
                const data = response.json()
                return this.data = data
            })
            .catch(err => { throw err })
    }

    async addMember(email) {
        let url = `${baseURL}/project/${this.id}/invite-member`

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify({ email }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || `Failed to invite collaborator: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async removeMember(userId) {

        const url = `${baseURL}/project/${this.id}/remove-member`

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId })
            })

            if (!response.ok) {
                throw new Error(`Error removing member: ${response.status}`)
            }

            const data = await response.json()
            return data


        } catch (error) {
            console.error('Error removing member:', error)
            throw error
        }








        const removeButtons = document.querySelectorAll('.remove-button')

        removeButtons.forEach((button) => {


            button.addEventListener('click', async () => {
                const memberID = button.getAttribute("data-member-id")
                const memberName = button.getAttribute("data-member-name")

                const confirmed = confirm(`This action will remove ${memberName} from your project. Click 'OK' to continue?`)
                if (!confirmed) {
                    return
                }


            })
        })
    }

}
