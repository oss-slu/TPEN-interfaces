import User from "../../User/index.mjs"
import TPEN from "../../TPEN/index.mjs"
import { eventDispatcher } from "../../TPEN/events.mjs"

export default class ProjectsList extends HTMLElement {
    static get observedAttributes() {
        return ['tpen-user-id']
    }

    #projects = []
    #TPEN = new TPEN()

    constructor() {
        super()
        eventDispatcher.on("tpen-user-loaded", ev => this.currentUser = ev.detail)
    }

    async connectedCallback() {
        TPEN.attachAuthentication(this)
        if (this.currentUser._id) {
            return this.getProjects().then(() => this.render())
        }
        this.innerHTML = "No user logged in yet"
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'tpen-user-id') {
            if (oldValue !== newValue) {
                const loadedUser = new User(newValue)
                loadedUser.authentication = TPEN.getAuthorization()
                loadedUser.getProfile().then(user => this.currentUser = user)
            }
        }
    }

    render() {
        if (!this.currentUser || !this.projects) {
            this.innerHTML = "No user or projects available";
            return;
        }
    
        // Render projects with contributors
        this.innerHTML = `
            <h2>Welcome, ${this.currentUser.name}</h2>
            <ul>
                ${this.projects.map(project => `
                    <li>
                        <strong>${project.title}</strong> (${project.roles.join(", ")})
                        <ul>
                            ${project.contributors.map(contributor => `
                                <li>
                                    ${contributor.name} - ${contributor.role}
                                    <button onclick="managePermissions('${contributor.id}')">Manage Permissions</button>
                                </li>
                            `).join("")}
                        </ul>
                    </li>
                `).join("")}
            </ul>
        `;

        // Attach event listeners after rendering
        this.querySelectorAll('.manage-permissions').forEach(button => {
            button.addEventListener('click', (event) => {
                const contributorId = event.target.getAttribute('data-id');
                this.managePermissions(contributorId);
            });
        });
    }

    managePermissions(contributorId) {
        alert(`Managing permissions for contributor ID: ${contributorId}`);
    }

    async getProjects() {
        return this.#TPEN.currentUser.getProjects()
            .then(async (projects) => {
                // Fetch contributors for each project
                const projectsWithContributors = await Promise.all(
                    projects.map(async (project) => {
                        const contributors = await this.fetchContributors(project._id); // Fetch contributors
                        return { ...project, contributors }; // Add contributors to project object
                    })
                );
                this.projects = projectsWithContributors;
                return projectsWithContributors;
            });
    }
    
    // Helper method to fetch contributors for a project
    async fetchContributors(projectId) {
        const token = TPEN.getAuthorization();
        const response = await fetch(`${this.#TPEN.servicesURL}/project/${projectId}/contributors`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error(`Failed to fetch contributors for project ${projectId}`);
        return response.json(); // Return the contributors
    }

    get currentUser() {
        return this.#TPEN.currentUser
    }

    set currentUser(user) {
        if(this.#TPEN.currentUser?._id !== user._id) {
            this.#TPEN.currentUser = user
        }
        this.#TPEN.currentUser.getProjects().then((projects) => {
            this.projects = projects
            this.render()
        })
        return this
    }

    get projects() {
        return this.#projects
    }

    set projects(projects) {
        this.#projects = projects
        return this
    }
}

customElements.define('tpen-projects-list', ProjectsList)
