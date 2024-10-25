// custom element named 'tpen-transcription' with a custom template built from the querystring 'projectID' parameter
import { fetchProject, userMessage, encodeContentState } from "../iiif-tools/index.mjs"
import "https://cdn.jsdelivr.net/npm/manifesto.js"
import "../line-image/index.js"
import "../line-text/index.js"
import TPEN from "../../TPEN/index.mjs"
import { User } from "../../User/index.mjs"

class TpenTranscriptionElement extends HTMLElement {
    TPEN = new TPEN()
    #transcriptionContainer
    #project = this.TPEN.activeProject
    #manifest = this.TPEN.activeProject?.manifest
    #activeCanvas = {}
    #activeLine = {}
    userToken

    static get observedAttributes() {
        return ['tpen-project','tpen-user-id']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if(name === 'tpen-user-id') {
                this.TPEN = new TPEN()
                this.TPEN.currentUser = new User(newValue)
            }
            if (name === 'tpen-project') {
                this.TPEN.activeProject = { _id: newValue }
                }
        if(this.userToken) this.#loadProject()
        }
    }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.#transcriptionContainer = document.createElement('div')
        this.#transcriptionContainer.setAttribute('id', 'transcriptionContainer')
        this.shadowRoot.append(this.#transcriptionContainer)
        TPEN.attachAuthentication(this)
    }
    
    connectedCallback() {
        if (!this.#project._id) {
            userMessage('No project ID provided')
            return
        }
        this.setAttribute('tpen-project', this.#project._id)
    }

    async #loadProject() {
        try {
            const project = await fetchProject(this.#project._id, this.userToken ?? TPEN.getAuthorization())
            console.log(this.#project._id, project)
            this.#transcriptionContainer.setAttribute('iiif-manifest', project.manifest)
            // load project.manifest
            let manifest = await manifesto.loadManifest(project.manifest)
            this.#manifest = new manifesto.Manifest(manifest)
            // page from URL later
            this.#activeCanvas = this.#manifest?.getSequenceByIndex(0)?.getCanvasByIndex(0)
            this.#activeLine = this.getFirstLine()
            this.#transcriptionContainer.setAttribute('iiif-canvas', this.#activeCanvas?.id)
            this.#transcriptionContainer.setAttribute('tpen-line-id', this.#activeLine?.id)
            this.#transcriptionContainer.setAttribute('iiif-content', encodeContentState(JSON.stringify(this.#activeLine)))
            const imgTop = document.createElement('tpen-line-image')
            imgTop.setAttribute('id', 'imgTop')
            imgTop.setAttribute('projectID', this.#project._id)
            const text = document.createElement('tpen-line-text')
            text.setAttribute('id', 'text')
            this.#transcriptionContainer.append(imgTop, text)
        } catch (err) {
            return userMessage(err)
        }
    }

    getAllLines(canvas = this.#activeCanvas) {
        return canvas?.__jsonld.annotations?.[0]?.items ?? canvas?.__jsonld.annotations?.[0] ?? canvas?.getContent()
    }

    getLineByIndex(index, canvas = this.#activeCanvas) {
        return this.getAllLines(canvas)[index]
    }

    getLineByID(id, canvas = this.#activeCanvas) {
        return this.getAllLines(canvas).find(line => line.id === id ?? line['@id'] === id)
    }

    getFirstLine(canvas = this.#activeCanvas) {
        return this.getAllLines(canvas)[0]
    }

    getLastModifiedLine(canvas) {
        return this.getAllLines(canvas).sort((a, b) => new Date(b.modified) - new Date(a.modified))[0]
    }
}

customElements.define('tpen-transcription', TpenTranscriptionElement)
