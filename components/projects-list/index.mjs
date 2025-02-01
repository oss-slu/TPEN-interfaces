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
        TPEN.attachAuthentication(this);
        
        console.log("Checking logged-in user...");
        console.log("User Object:", this.currentUser);
    
        if (!this.currentUser || !this.currentUser._id) {
            console.warn("No user is logged in. Redirecting...");
            return;
        }
    
        console.log("User is logged in:", this.currentUser);
        this.getProjects().then(() => this.render());
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'tpen-user-id') {
            if (oldValue !== newValue) {
                console.log(`User ID changed: ${newValue}`);
                const loadedUser = new User(newValue);
                loadedUser.authentication = TPEN.getAuthorization();
                
                loadedUser.getProfile()
                    .then(user => {
                        if (!user || !user._id) {
                            throw new Error("User not found.");
                        }
                        console.log("Fetched user details:", user);
                        this.currentUser = user;
                    })
                    .catch(error => {
                        console.error("Error fetching user:", error);
                        this.innerHTML = `<p style="color: red;">Error: ${error.message || "Failed to load user."}</p>`;
                    });
            }
        }
    }    

    render() {
        if (!this.#projects || this.#projects.length === 0) {
            this.innerHTML = `<p style="color: red; text-align: center;">No projects available.</p>`;
            return;
        }
    
        this.innerHTML = `<ul>${this.#projects.reduce((a, project) => 
            a + `<li tpen-project-id="${project._id}">${project.title}
            <span class="badge">${project.roles.join(", ").toLowerCase()}</span>
              </li>`, 
        ``)}</ul>`;
    }
    

    async getProjects() {
        if (!this.#TPEN.currentUser || !this.#TPEN.currentUser._id) {
            this.innerHTML = `<p style="color: red; text-align: center;">Error: No user logged in.</p>`;
            return [];
        }
    
        return this.#TPEN.currentUser.getProjects()
            .then((projects) => {
                if (!projects || projects.length === 0) {
                    console.warn("No projects available for this user.");
                    this.innerHTML = `<p style="color: red; text-align: center;">No projects available.</p>`;
                    return [];
                }
                this.#projects = projects;
                this.render();  // Make sure to render projects
                return projects;
            })
            .catch(error => {
                console.error("Error fetching projects:", error);
                this.innerHTML = `<p style="color: red; text-align: center;">Error loading projects. Please try again later.</p>`;
                return [];
            });
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
