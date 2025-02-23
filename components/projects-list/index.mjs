import User from "../../api/User.mjs"
import TPEN from "../../api/TPEN.mjs"
import { eventDispatcher } from "../../api/events.mjs"

export default class ProjectsList extends HTMLElement {
    static get observedAttributes() {
        return ['tpen-user-id']
    }

    #projects = []
    #search_list = false
    #projectid = null

    constructor() {
        super()
        eventDispatcher.on("tpen-user-loaded", ev => this.currentUser = ev.detail)
    }

    async connectedCallback() {
        await TPEN.attachAuthentication(this);

        console.log("Checking logged-in user...");
        console.log("User Object:", this.currentUser);

        if (!this.currentUser || !this.currentUser._id) {
            console.warn("No user is logged in.");

            this.innerHTML = `
                <div style="color: red; text-align: center; padding: 10px;">
                    <strong>Error:</strong> No user logged in. Please check your credentials.
                </div>
            `;
            return;
        }

        console.log("User is logged in:", this.currentUser);
        try {
            await this.getProjects();
            this.render();
        } catch (error) {
            console.error("Error fetching projects:", error);
            this.innerHTML = `
                <div style="color: red; text-align: center; padding: 10px;">
                    <strong>Error:</strong> Failed to load projects. Please try again later.
                </div>
            `;
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'tpen-user-id') {
            console.log(`User ID changed: ${newValue}`);
            const loadedUser = new User(newValue);
            loadedUser.authentication = TPEN.getAuthorization();

            loadedUser.getProfile()
                .then(user => {
                    console.log("Fetched user details:", user);

                    if (!user || !user._id || user.message?.includes("not found")) {
                        throw new Error(`User not found: ${user.message}`);
                    }

                    TPEN.currentUser = user;
                    this.getProjects().then(() => this.render());
                })
                .catch(error => {
                    console.error("Error fetching user:", error);

                    this.innerHTML = `
                        <div style="color: red; text-align: center; padding: 10px;">
                            <strong>Error:</strong> User not found. Please enter a valid user ID.
                        </div>
                    `;
                });
        }
    }

    render() {
        if (!TPEN.currentUser?._id) {
            this.innerHTML = `<p style="color: red; text-align: center;">Error: No user logged in.</p>`;
            return;
        }

        if (!this.#projects || this.#projects.length === 0) {
            this.innerHTML = `<p style="color: red; text-align: center;">No projects available.</p>`;
            return;
        }

        this.innerHTML = `<ul>${this.#projects.reduce((a, project) =>
            a + `<li tpen-project-id="${project._id}">${project.title ?? project.label}
            <span class="badge">${project.roles.join(", ").toLowerCase()}</span>
              </li>`, 
            ``)}</ul>`;
    }

    /**
     * @deprecated
     */
    renderProjectsList() {
        this.innerHTML = `
            <h2>Welcome, ${this.currentUser.name}</h2>
            <ul>
                ${this.projects.map(project => `
                    <li data-id="${project._id}" class="project-item">
                        <strong>${project.title}</strong> (${project.roles.join(", ")})
                        <button class="details-button">Details</button>
                    </li>
                `).join("")}
            </ul>
        `;

        this.attachDetailsListeners();
    }

    attachDetailsListeners() {
        this.querySelectorAll('.details-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const projectId = event.target.closest('li').getAttribute('data-id')
                this.loadContributors(projectId)
            })
        })
    }

    project_id(projectid) {
        console.log("set project id function called");
        this.#projectid = projectid;
        this.#search_list = true;
        console.log(this.#projectid);
        this.getProjects().then(() => {
            this.render()
        })
    }

    async loadContributors(projectId) {
        try {
            const contributors = TPEN.activeProject.collaborators
            const contributorsList = document.getElementById('contributorsList')
            if (!contributorsList) {
                console.error("Contributors list element not found")
                return
            }
            contributorsList.innerHTML = contributors.map(contributor => `
                <li>
                    <strong>${contributor.name}</strong>
                    <p>Email: ${contributor.email}</p>
                    <p>Role: ${contributor.role}</p>
                    <button onclick="managePermissions('${contributor.id}')">Manage Permissions</button>
                </li>
            `).join("")
        } catch (error) {
            console.error(`Error fetching contributors for project ${projectId}:`, error)
        }
    }

    async getProjects() {
        return TPEN.currentUser.getProjects()
            .then((projects) => {
                if (this.#search_list === false) {
                    this.#projects = projects;
                    return projects;
                } else {
                    const project = projects.find(project => project._id === this.#projectid);
                    if (project) {
                        this.#projects = [project];
                        console.log("Project found:", project);
                    }else {
                        const project = projects.find(project=>project.title.toLowerCase() === this.#projectid.toLowerCase())
                        if(project){
                            this.#projects = [project];
                            console.log("Project found:", project);
                        }
                        else{
                            this.#projects = [];
                            console.log("Project not found.");
                        }
                    }
                    return this.#projects;
                }
            })
            .catch(error => {
                console.error("Error fetching projects:", error);
                this.innerHTML = `
                    <div style="color: red; text-align: center; padding: 10px;">
                        <strong>Error:</strong> Failed to fetch projects. Please try again later.
                    </div>
                `;
                return [];
            });
    }

    get currentUser() {
        return TPEN.currentUser;
    }

    set currentUser(user) {
        if (TPEN.currentUser?._id !== user._id) {
            TPEN.currentUser = user;
        }
        TPEN.currentUser.getProjects().then((projects) => {
            this.#projects = projects;
            this.render();
        });
        return this;
    }

    get projects() {
        return this.#projects;
    }

    set projects(projects) {
        this.#projects = projects;
        return this;
    }
}

customElements.define('tpen-projects-list', ProjectsList);
