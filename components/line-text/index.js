const LINE_TEXT_HTML = `<span></span>`

class TpenLineText extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.id = this.getAttribute('tpen-line-id')
        this.content = this.getAttribute('iiif-content')
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = LINE_TEXT_HTML
        const SPAN = this.shadowRoot.querySelector('span')
        
        if (!this.id && !this.content) {
            const ERR = new Event('tpen-error', { detail: 'Line ID is required' })
            validateContent(null,SPAN,"Line ID is required")
        }
        
        this.content ? loadContent(this.content,SPAN) : loadText(this.id,SPAN)
    }
}

customElements.define('tpen-line-text', TpenLineText)

export default {
    TpenLineText
}

async function loadText(lineId,elem){
    try {
        new URL(lineId)
        const TEXT_CONTENT = await loadAnnotation(lineId)
        elem.innerText = validateContent(TEXT_CONTENT,elem)
    } catch (error) {
        console.error(error)
        return validateContent(null,elem,"Fetching Error")
    }
}

function loadContent(b64,elem){
    try {
        const TEXT_CONTENT = getText(JSON.parse(decodeContentState(b64)))
        elem.innerText = validateContent(TEXT_CONTENT,elem)
    } catch (error) {
        console.error(error)
        return validateContent(null,elem,"Decoding Error")
    }
}

function loadAnnotation(url){   
    return fetch(url)
        .then(response => {
            if(!response.ok) throw new Error("failed to fetch")
            return response.json()
        })        
        .then(anno => getText(anno))
        .catch(error => console.error(error))
}

function getText(annotation){
    // TODO: currently this is a fragile mess
    let textContent = annotation.body?.value
    if(annotation.resource) textContent = annotation.resource["cnt:chars"]
    if(typeof annotation.body === "string") textContent = annotation.body
    return textContent ?? "weird value"
}

function validateContent(content,elem,msg) {
    if(content==null){
        elem.setAttribute('aria-invalid',true)
        elem.setAttribute('title',msg ?? 'Invalid content')
    }
    return content
}

//https://iiif.io/api/content-state/1.0/#61-choice-of-encoding-mechanism
function decodeContentState(encodedContentState) {
    let base64url = restorePadding(encodedContentState);
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    let base64Decoded = atob(base64);                        // using built in function
    let uriDecoded = decodeURIComponent(base64Decoded);      // using built in function
    return uriDecoded;
}

function restorePadding(s) {
    // The length of the restored string must be a multiple of 4
    let pad = s.length % 4;
    let padding = "";
    if (pad) {
        if (pad === 1) {
            throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
        }
        s += '===='.slice(0, 4 - pad);
    }
    return s + padding;
}