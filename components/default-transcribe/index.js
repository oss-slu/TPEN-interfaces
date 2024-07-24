// custom element named 'tpen-transcription' with a custom template built from the querystring 'projectID' parameter
import { fetchProject, userMessage } from "../iiif-tools/index.mjs"
import "https://cdn.jsdelivr.net/npm/manifesto.js"
import "../line-image/index.js"
import "../line-text/index.js"

class TpenTranscriptionElement extends HTMLElement {
    #projectID = new URLSearchParams(window.location.search).get('projectID')

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        const transcriptionContainer = document.createElement('div')
        transcriptionContainer.setAttribute('id', 'transcriptionContainer')
        const imgTop = document.createElement('line-image')
        imgTop.setAttribute('id', 'imgTop')
        imgTop.setAttribute('projectID', this.#projectID)
        const text = document.createElement('line-text')
        text.setAttribute('id', 'text')
        transcriptionContainer.append(imgTop, text)
        
        this.shadowRoot.append(transcriptionContainer)
    }

    connectedCallback() {
        if (!this.#projectID) {
            userMessage('No project ID provided')
            return
        }
        return fetchProject(this.#projectID);
    }
}

customElements.define('tpen-transcription', TpenTranscriptionElement)




