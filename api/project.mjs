/**
 * Project API Link for user interfaces to import. The result will look like this:
 * { 
 *  _id: "someHash",
 *  label: "Some Project",
 *  metadata: [ {} ],
 *  layers: [ {} ],
 *  creator: "userHash",
 *  collaborators: { userHash: { roles: [ "roles" ], profile: { displayName: "name", ...} }},
 *  license: "licenseString",
 *  tools: [ {} ],
 *  options: { "option": "value" },
 *  roles: { "roleName": [ "permissions" ] },
 * }
 * 
 * @author cubap@slu.edu
 * @type module
 * @version 0.0.1
 */
import TPEN from './TPEN.mjs'
import { eventDispatcher } from './events.mjs'
export default class Project {

    #authentication
    #isLoaded
    #TPEN = new TPEN()

    /**
     * The constructor for the Project class.
     * @param {String} projectID The new Project() will always load from Services.
     * @returns 
     */
    constructor(projectID) {
        if (typeof projectID !== "string") {
            throw new Error("Project ID must be a string")
        }
        this._id = projectID
        this.#isLoaded = false
        this.#loadFromService().then(() => {
            this.#isLoaded = true
            this.#TPEN.activeProject = this
            eventDispatcher.dispatch("tpen-project-loaded", this)
        })
        eventDispatcher.on("tpen-authenticated", ev => this.#authentication = ev.detail)
    }

    // new private function getById()
    /**
     * Load project information from TPEN Services about the project 
     * for rendering user interface.
     * @param {String} projectID short hash id for TPEN project
     */

    async #loadFromService(reload = false) {
        if(!reload && this.#isLoaded) {
            return Promise.resolve(this)
        }
        try {
            const response = await fetch(`${this.#TPEN.servicesURL}/project/${this._id}`)
            const project = await (response.ok ? response.json() : Promise.reject(response))
            return Object.assign(this, project)
        } catch (err) {
            return new Promise.reject(err)
        }
    }

    save() {
        if (!this.#authentication) {
            throw new Error("Authentication is required to save a project")
        }
        return fetch(`${this.#TPEN.servicesURL}/project/${this._id}`, {
            method: "PUT",
            headers: new Headers({
                Authorization: `Bearer ${this.#authentication}`,
                "Content-Type": "application/json"
            }),
            body: JSON.stringify(this)
        })
    }

    setMetadata(metadata) {
        this.metadata = metadata
        return this.save()
    }

    addLayer(layer) {
        this.layers.push(layer)
        return this.save()
    }

    removeLayer(layerID) {
        this.layers = this.layers.filter(layer => layer._id !== layerID)
        return this.save()
    }

    addTool(tool) {
        this.tools.push(tool)
        return this.save()
    }

    removeTool(toolID) {
        this.tools = this.tools.filter(tool => tool._id !== toolID)
        return this.save()
    }

    async inviteCollaborator(email, roles) {
        return fetch(`${this.#TPEN.servicesURL}/project/${this._id}/invite-member`, {
            method: "POST",
            headers: new Headers({
                Authorization: `Bearer ${this.#authentication}`,
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({ email, roles })
        }).catch(err => Promise.reject(err))
    }

    async removeCollaborator(userID) {
        // userID is the _id (Hexstring) of the user to remove from the project
        if(!this.collaborators?.[userID]) {
            return Promise.reject(new Error("User not found in collaborators list"))
        }
        return fetch(`${this.#TPEN.servicesURL}/project/${this._id}/remove-member`, {
            method: "POST",
            headers: new Headers({
                Authorization: `Bearer ${this.#authentication}`,
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({ userID })
        }).catch(err => Promise.reject(err))
    }

    /**
     * Add roles to a collaborator in a project. Roles should be 
     * defined in the project's custom roles. Undefined roles will be ignored.
     * @param {String} userID Collaborator _id to modify roles
     * @param {Array<String>} roles Roles to add to the user
     * @returns 
     */
    async addCollaboratorRole(userID, roles) {
        // role is a string value of the role to add to the user
        if(!this.collaborators?.[userID]) {
            return Promise.reject(new Error("User not found in collaborators list"))
        }
        return fetch(`${this.#TPEN.servicesURL}/project/${this._id}/collaborator/${userID}/addRoles`, {
            method: "POST",
            headers: new Headers({
                Authorization: `Bearer ${this.#authentication}`,
                "Content-Type": "application/json"
            }),
            body: JSON.stringify(roles)
        }).catch(err => Promise.reject(err))
    }

    /**
     * Remove roles from a collaborator in a project. Roles will not be 
     * removed from custom roles if no one is left assigned to them. It is
     * not allowed to remove the OWNER role or the last role from a user.
     * @param {String} userID Collaborator _id to modify roles
     * @param {Array<String>} roles Roles to remove from the user
     * @returns 
     */
    async removeCollaboratorRole(userID, roles) {
        // role is a string value of the role to remove from the user
        if(!this.collaborators?.[userID]) {
            return Promise.reject(new Error("User not found in collaborators list"))
        }
        return fetch(`${this.#TPEN.servicesURL}/project/${this._id}/collaborator/${userID}/removeRoles`, {
            method: "POST",
            headers: new Headers({
                Authorization: `Bearer ${this.#authentication}`,
                "Content-Type": "application/json"
            }),
            body: JSON.stringify(roles)
        }).catch(err => Promise.reject(err))
    }

    async setCollaboratorRoles(userID, roles) {
        // role is a string value of the role to set for the user
        if(!this.collaborators?.[userID]) {
            return Promise.reject(new Error("User not found in collaborators list"))
        }
        return fetch(`${this.#TPEN.servicesURL}/project/${this._id}/collaborator/${userID}/setRoles`, {
            method: "PUT",
            headers: new Headers({
                Authorization: `Bearer ${this.#authentication}`,
                "Content-Type": "application/json"
            }),
            body: JSON.stringify(roles)
        }).catch(err => Promise.reject(err))
    }

}
