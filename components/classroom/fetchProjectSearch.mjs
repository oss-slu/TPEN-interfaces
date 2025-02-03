import ProjectsList from "../projects-list/index.mjs";
import User from "../../api/User.mjs"
import TPEN from "../../api/TPEN.mjs"
export default class ProjectSearch extends ProjectsList{

    static get observedAttributes(){
        return['tpen-user-id','project-id']
    }

    #projectid;

    constructor() {
        super();
    }

    async connectedCallback() { // do we need this? or can we just use the parent's connectedcallback
        TPEN.attachAuthentication(this)
        if (this.currentUser && this.currentUser._id && this.#projectid) {
            try {
                await this.getProjects()
                this.render()
            } catch (error) {
                console.error("Error fetching projects:", error)
                this.innerHTML = "Failed to load projects."
            }
        } else if (this.currentUser && this.currentUser._id && !this.#projectid){
            this.innerHTML = "No search specified"
        } else {
            this.innerHTML = "No user logged in yet"
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'tpen-user-id') {
            if (oldValue !== newValue) {
                const loadedUser = new User(newValue)
                loadedUser.authentication = TPEN.getAuthorization()
                loadedUser.getProfile()
            }
        }else if (name === 'project-id'){
            if(oldValue!==newValue){
                this.#projectid = newValue;
            }
        }
    }


    render(){
        if (!TPEN.currentUser._id) return

        const searchedproject = this._projects.find(project=>project._id==this.#projectid)
        if(searchedproject==undefined){
            this.innerHTML = "Project could not be found."
        }
        else{
            this.innerHTML = "project found---working on a way to display it"
        }
        /*
        this.innerHTML = `<ul>${this.project.reduce((a, project) =>
            a + `<li tpen-project-id="${project._id}">${project.title ?? project.label}
            <span class="badge">${project.roles.join(", ").toLowerCase()}</span>
              </li>`,
            ``)}</ul>`
        */
    }
}
customElements.define('tpen-project-search', ProjectSearch)

