import {decodeContentState} from '../iiif-tools/index.mjs'

const CANVAS_PANEL_SCRIPT = document.createElement('script')
CANVAS_PANEL_SCRIPT.src = "https://cdn.jsdelivr.net/npm/@digirati/canvas-panel-web-components@latest"
document.head.appendChild(CANVAS_PANEL_SCRIPT)

const LINE_IMG = () => document.createElement('canvas-panel')

class TpenLineImage extends HTMLElement {
    #manifestId = ()=>(this.#canvasPanel.closest('[iiif-manifest]') ?? this.closest('[iiif-manifest]'))?.getAttribute('iiif-manifest') 
    #canvasId = ()=>(this.#canvasPanel.closest('[iiif-canvas]') ?? this.closest('[iiif-canvas]'))?.getAttribute('iiif-canvas')
    #canvasPanel = LINE_IMG()
    #manifest
    #line
    #id

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.#canvasPanel.setAttribute("preset","responsive")
        this.shadowRoot.append(this.#canvasPanel)
        this.addEventListener('canvas-change',ev=>{
            this.#canvasPanel.setCanvas(this.#canvasId())
            this.#canvasPanel.setManifest(this.#manifestId())
        })
    }
    
    connectedCallback() {  
        this.#canvasPanel.setAttribute("manifest-id",this.#manifestId())
        this.#canvasPanel.setAttribute("canvas-id",this.#canvasId())
        this.#line = decodeContentState((this.#canvasPanel.closest('[iiif-content]') ?? this.closest('[iiif-content]'))?.getAttribute('iiif-content'))

        if(this.#line) {
            try{
                let anno = JSON.parse(this.#line)
                const TARGET = ((anno.type ?? anno['@type']).match(/Annotation\b/)) ? (anno.target ?? anno.on)?.split('#xywh=') : (anno.items[0]?.target ?? anno.resources[0]?.on)?.split('#xywh=')
                this.#canvasPanel.setAttribute("region",TARGET[1])
                this.#canvasPanel.createAnnotationDisplay(anno)
                return
            }catch(e){}
        }

        this.#id = (this.#canvasPanel.closest('[tpen-line-id]') ?? this.closest('[tpen-line-id]'))?.getAttribute('tpen-line-id')

        if (!this.#id || ("null" === this.#id)) {
            const ERR = new Event('tpen-error', { detail: 'Line ID is required' })
            validateContent(null,this,"Line ID is required")
            return
        }

        fetch(this.#id).then(res=>res.json()).then(anno=>{
            const TARGET = ((anno.type ?? anno['@type']).match(/Annotation\b/)) ? (anno.target ?? anno.on)?.split('#xywh=') : (anno.items[0]?.target ?? anno.resources[0]?.on)
            // this.#canvasPanel.setAttribute("canvas-id",TARGET[0])
            this.#canvasPanel.setAttribute("region",TARGET[1])
            this.#canvasPanel.createAnnotationDisplay(anno)
        })
        this.addEventListener('canvas-change',ev=>{
            this.#canvasId = this.#canvasPanel.closest('[iiif-canvas]') ?? this.closest('[iiif-canvas]')
            this.#canvasPanel.setCanvas(this.#canvasId)
        })
    }

    connectedCallback() {   
        if(!this.#canvasPanel.vault) return

    }

    async selectImage(){
        try {
            new URL(this.#id)
            const TEXT_CONTENT = await loadAnnotation(lineId)
            this.#canvasPanel.innerText = validateContent(TEXT_CONTENT,this)
        } catch (error) {
            console.error(error)
            return validateContent(null,this,"Fetching Error")
        }
    }
    
    loadContent(){
        try {
            const TEXT_CONTENT = JSON.parse(decodeContentState(this.content))
            this.innerText = validateContent(TEXT_CONTENT,this)
        } catch (error) {
            console.error(error)
            return validateContent(null,this,"Decoding Error")
        }
    }

    moveTo(x,y,width,height) {
        this.#canvasPanel.transition(tm => {
            tm.goToRegion({ height, width, x, y }, {
                transition: {
                easing: this.#canvasPanel.easingFunctions().easeOutExpo,
                duration: 1000,
                },
            })
        })
    }
}

customElements.define('tpen-line-image', TpenLineImage)

export default {
    TpenLineImage
}


function loadAnnotation(url){   
    return fetch(url)
        .then(response => {
            if(!response.ok) throw new Error("failed to fetch")
            return response.json()
        })        
        .catch(error => console.error(error))
}

function validateContent(content,elem,msg) {
    if(content==null){
        elem.setAttribute('aria-invalid',true)
        elem.setAttribute('title',msg ?? 'Invalid content')
    }
    return content
}
