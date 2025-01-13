import User from "../../User/index.mjs";
import TPEN from "../../TPEN/index.mjs";
import { eventDispatcher } from "../../TPEN/events.mjs";

export default class ProjectsList extends HTMLElement {
    static get observedAttributes() {
        return ['tpen-user-id'];
    }

    #projects = [];
    #TPEN = new TPEN();

    constructor() {
        super();
        console.log("ProjectsList component constructed.");
        eventDispatcher.on("tpen-user-loaded", ev => {
            console.log("Event 'tpen-user-loaded' received with data:", ev.detail);
            this.currentUser = ev.detail;
        });
    }

    async connectedCallback() {
        console.log("ProjectsList connected to the DOM.");
        TPEN.attachAuthentication(this);

        if (this.currentUser._id) {
            console.log("Current user exists:", this.currentUser);
            return this.getProjects()
                .then(() => {
                    console.log("Projects fetched successfully:", this.#projects);
                    this.render();
                })
                .catch(error => console.error("Error fetching projects:", error));
        }

        console.warn("No user logged in yet.");
        this.innerHTML = "No user logged in yet";
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute '${name}' changed from '${oldValue}' to '${newValue}'.`);
        if (name === 'tpen-user-id') {
            if (oldValue !== newValue) {
                console.log("Loading new user with ID:", newValue);
                const loadedUser = new User(newValue);
                loadedUser.authentication = TPEN.getAuthorization();
                loadedUser.getProfile()
                    .then(user => {
                        console.log("User profile loaded:", user);
                        this.currentUser = user;
                    })
                    .catch(error => console.error("Error loading user profile:", error));
            }
        }
    }

    render() {
        console.log("Rendering projects list.");
        if (!this.#TPEN.currentUser._id) {
            console.warn("No valid current user. Render aborted.");
            return;
        }

        this.innerHTML = `<ul>${this.#projects.reduce((a, project) => 
            a + `<li tpen-project-id="${project._id}">${project.title}
            <span class="badge">${project.roles.join(", ").toLowerCase()}</span>
              </li>`, 
            ``)}</ul>`;
        console.log("Rendered projects list successfully.");
    }

    async getProjects() {
        console.log("Fetching projects for user:", this.#TPEN.currentUser);
        return this.#TPEN.currentUser.getProjects()
            .then(projects => {
                console.log("Projects retrieved:", projects);
                this.projects = projects;
                return projects;
            })
            .catch(error => {
                console.error("Error fetching projects from TPEN:", error);
                throw error;
            });
    }

    get currentUser() {
        return this.#TPEN.currentUser;
    }

    set currentUser(user) {
        if (this.#TPEN.currentUser?._id !== user._id) {
            console.log("Setting new current user:", user);
            this.#TPEN.currentUser = user;
        }

        this.#TPEN.currentUser.getProjects()
            .then(projects => {
                console.log("Projects fetched for new user:", projects);
                this.projects = projects;
                this.render();
            })
            .catch(error => console.error("Error fetching projects for new user:", error));

        return this;
    }

    get projects() {
        return this.#projects;
    }

    set projects(projects) {
        console.log("Updating projects list:", projects);
        this.#projects = projects;
        return this;
    }
}

customElements.define('tpen-projects-list', ProjectsList);
