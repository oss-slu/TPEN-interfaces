class TpenFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Attach a shadow DOM
  }

  connectedCallback() {
    this.render(); // Render the footer when the component is added to the DOM
  }

  render() {
    this.shadowRoot.innerHTML = `
      <footer>
        <p>TPEN Classroom Interface</p>
      </footer>
      <style>
        footer {
          padding: 10px;
          text-align: center;
          background: #516059;
          color: white;
          position: fixed; /* Makes the footer stick to the bottom */
          bottom: 0;
          left: 0;
          width: 100%; /* Ensures the footer spans the full width of the page */
          z-index: 1000; /* Ensures it stays above other content */
        }
      </style>
    `;
  }
}

customElements.define('tpen3-footer', TpenFooter);