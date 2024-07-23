// custom element named 'tpen-transcription' with a custom template built from the querystring 'projectID' parameter
import { fetchProject, userMessage } from "../iiif-tools/index.mjs"

class TpenTranscriptionElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const projectID = new URLSearchParams(window.location.search).get('projectID');
        if (!projectID) {
            userMessage('No project ID provided');
            return
        }
        fetchProject(projectID);
    }
}

customElements.define('tpen-transcription', TpenTranscriptionElement)




