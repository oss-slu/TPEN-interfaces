// custom element named 'tpen-transcription' with a custom template built from the querystring 'projectID' parameter
import { userMessage, encodeContentState } from "../iiif-tools/index.mjs"
import "https://cdn.jsdelivr.net/npm/manifesto.js"
import "../line-image/index.js"
import "../line-text/index.js"
import TPEN from "../../api/TPEN.mjs"
import User from "../../api/User.mjs"
import Project from "../../api/Project.mjs"
import { eventDispatcher } from "../../api/events.mjs"

class TpenTranscriptionElement extends HTMLElement {
    #transcriptionContainer
    activeCanvas = {}
    activeLine = {}
    userToken

    static get observedAttributes() {
        return ['tpen-project','tpen-user-id']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if(name === 'tpen-user-id') {
                TPEN.currentUser = new User(newValue).getProfile()
            }
            if (name === 'tpen-project' && newValue !== TPEN.activeProject._id) {
                this.#assignProject(newValue)
            }
        }
    }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.#transcriptionContainer = document.createElement('div')
        this.#transcriptionContainer.setAttribute('id', 'transcriptionContainer')
        this.shadowRoot.append(this.#transcriptionContainer)
        TPEN.attachAuthentication(this)
        eventDispatcher.on('tpen-project-loaded', () => this.#assignProject()) 
        eventDispatcher.on('move-to-line', (e) => this.#assignLine(e.detail))
        eventDispatcher.on('change-page', (e) => this.#assignCanvas(e.detail))
    }
    
    connectedCallback() {}

    set activeCanvas(canvas) {
        if (canvas === this.activeCanvas) return
        this.activeCanvas = canvas
    }

    set activeLine(line) {
        if (line === this.activeLine) return
        this.activeLine = line
        this.contentState = JSON.stringify(this.activeLine)
    }

    async #assignProject(projectID = TPEN.activeProject._id) {
        try {
            const project = TPEN.activeProject ?? await new Project(projectID).fetch()
            if(!project) return userMessage('Project not found')
            this.#transcriptionContainer.setAttribute('iiif-manifest', project.manifest)
            // load project.manifest
            let manifest = await manifesto.loadManifest(project.manifest)
            TPEN.activeProject.manifest = new manifesto.Manifest(manifest)
            // page from URL later
            this.activeCanvas = TPEN.activeProject.manifest?.getSequenceByIndex(0)?.getCanvasByIndex(0)
            this.activeLine = this.getFirstLine()
            const imgTop = document.createElement('tpen-line-image')
            imgTop.setAttribute('id', 'imgTop')
            // imgTop.setAttribute('projectID', TPEN.activeProject._id)
            const text = document.createElement('tpen-line-text')
            text.setAttribute('id', 'text')
            this.#transcriptionContainer.append(imgTop, text)
        } catch (err) {
            switch (err.status ?? err.code) {
                case 401:
                    return userMessage('Unauthorized')
                case 403:   
                    return userMessage('Forbidden')
                case 404:
                    return userMessage('Project not found') 
                default:
                    return userMessage(err.message ?? err.statusText ?? err.text ?? 'Unknown error')
            }
        }
    }

    async #assignCanvas(canvasID) {
        this.activeCanvas = TPEN.activeProject.manifest?.getSequenceByIndex(0)?.getCanvasById(canvasID)
        this.activeLine = this.getFirstLine()
    }

    async #assignLine(lineID) {
        this.activeLine = (lineID < 10000) ? this.getLineByIndex(lineID) : this.getLineByID(lineID)
        // this.#transcriptionContainer.setAttribute('tpen-line-id', this.activeLine?.id)
        // this.#transcriptionContainer.setAttribute('iiif-content', encodeContentState(JSON.stringify(this.activeLine)))
    }

    getAllLines(canvas = this.activeCanvas) {
        return canvas?.__jsonld.annotations?.[0]?.items ?? canvas?.__jsonld.annotations?.[0] ?? canvas?.getContent()
    }

    getLineByIndex(index, canvas = this.activeCanvas) {
        return this.getAllLines(canvas)[index]
    }

    getLineByID(id, canvas = this.activeCanvas) {
        return this.getAllLines(canvas).find(line => line.id === id ?? line['@id'] === id)
    }

    getFirstLine(canvas = this.activeCanvas) {
        return this.getAllLines(canvas)[0]
    }

    getLastModifiedLine(canvas) {
        return this.getAllLines(canvas).sort((a, b) => new Date(b.modified) - new Date(a.modified))[0]
    }
}

customElements.define('tpen-transcription', TpenTranscriptionElement)

class TpenPaginationElement extends HTMLElement {
    #paginationContainer
    activeCanvas = {}
    activeLine = {}
    userToken

    static get observedAttributes() {
        return ['tpen-project']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'tpen-project' && newValue !== TPEN.activeProject._id) {
                this.#loadPages(newValue)
            }
        }
    }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.#paginationContainer = document.createElement('div')
        this.#paginationContainer.setAttribute('id', 'paginationContainer')
        this.shadowRoot.append(this.#paginationContainer)
        eventDispatcher.on('tpen-project-loaded', () => this.#loadPages())
    }
    
    connectedCallback() {
        if (!TPEN.activeProject._id) {
            return
        }
        this.setAttribute('tpen-project', TPEN.activeProject._id)
    }

    async #loadPages(projectID = TPEN.activeProject._id) {
        try {
            const project = TPEN.activeProject ?? await new Project(projectID).fetch()
            if(!project) return userMessage('Project not found')
            if (!TPEN.activeProject.manifest?.getSequenceByIndex) {
                let manifest = await manifesto.loadManifest(project.manifest)
                TPEN.activeProject.manifest = new manifesto.Manifest(manifest)   
            }
            let pages = TPEN.activeProject.manifest?.getSequenceByIndex(0)?.getCanvases()
            const select = document.createElement('select')
            select.setAttribute('id', 'pageSelect')
            pages.forEach(page => {
                const option = document.createElement('option')
                option.value = page.id
                option.textContent = page.getLabel().getValue(navigator.language)
                select.appendChild(option)
            })
            this.#paginationContainer.appendChild(select)
            select.addEventListener('change', () => eventDispatcher.dispatch('change-page', select.value))
        }
        catch (err) {
            switch (err.status ?? err.code) {
                case 401:
                    return userMessage('Unauthorized')
                case 403:   
                    return userMessage('Forbidden')
                case 404:
                    return userMessage('Project not found') 
                default:
                    return userMessage(err.message ?? err.statusText ?? err.text ?? 'Unknown error')
            }
        }
    }
}

customElements.define('tpen-pagination', TpenPaginationElement)
