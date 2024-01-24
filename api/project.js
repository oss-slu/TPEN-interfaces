/**
 * Project API Link for user interfaces to import.
 * 
 * @author cubap
 * @type module
 * @version 0.0.1
 */
export default class Project {
    constructor(projectID) {

        if (typeof projectID === "object") {
            // Assume configuration object
            this.data = projectID
            return
        }

        if (typeof projectID === "string") {
            this.id = projectID
            this.fetchByID(projectID)
                .then(project => this.data = project)
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

    fetchByID(projectID) {
        fetch(`/project/${projectID}`)
            .then(response => response.json())
    }
}
