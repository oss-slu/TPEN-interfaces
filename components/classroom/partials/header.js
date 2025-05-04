class TpenHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Attach a shadow DOM
  }

  connectedCallback() {
    this.render(); // Render the header when the component is added to the DOM
    this.addEventListeners(); // Add event listeners for the toggleMenu functionality
  }

  toggleMenu() {
    const navbar = this.shadowRoot.getElementById('navbar');
    navbar.classList.toggle('responsive');
  }

  addEventListeners() {
    // Add click event listener to the hamburger menu
    const menuIcon = this.shadowRoot.querySelector('.hamburger-menu');
    menuIcon.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent the click event from propagating to the document
      this.toggleMenu();
    });

    // Add click event listener to close the menu when clicking outside
    document.addEventListener('click', (event) => {
      const navbar = this.shadowRoot.getElementById('navbar');
      const menuIcon = this.shadowRoot.querySelector('.hamburger-menu');
      if (!navbar.contains(event.target) && !menuIcon.contains(event.target)) {
        if (navbar.classList.contains('responsive')) {
          navbar.classList.add('closing');
          setTimeout(() => {
            navbar.classList.remove('responsive', 'closing');
          }, 400);
        }
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div class="header">
        <h1>TPEN Classroom Interface</h1>
        <div class="hamburger-menu">&#9776;</div>
        <div class="navbar" id="navbar">
          <ul>
            <li><a href="/TPEN-interfaces/components/classroom/index.html" aria-label="home">Home</a></li>
            <!-- Add more links as needed -->
          </ul>
        </div>
      </div>
      <style>
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-inline: 1rem;
          background: #516059; 
          color: white;
        }

        .header h1 {
          font-size: 24px;
        }

        .navbar {
          font-size: clamp(1rem, 2vh, 2rem);
          background-color: #516059;
        }

        .navbar ul {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          gap: 1rem;
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .navbar li a {
          display: block;
          color: #fff;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .navbar li a::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          background-color: #ffffff;
          transition: width 0.3s ease-in-out;
        }

        .navbar li a:hover::after {
          width: 100%;
        }

        /* Hamburger icon */
        .hamburger-menu {
          display: none;
          font-size: 25px;
          cursor: pointer;
          position: absolute;
          top: 16px;
          right: 16px;
        }

        @media (max-width: 600px) {
          .header {
            flex-direction: column;
          }
          
          .header h1 {
            font-size: 24px;
          }

          .navbar {
            background-color: #516059;
          }

          .navbar ul {
            display: none;
            flex-direction: column;
            width: 100%;
            text-align: center;
          }

          .navbar.responsive ul {
            display: flex;
          }

          .hamburger-menu {
            display: block;
          }
        }

        /* Tablet (Portrait and Landscape) */
        @media (min-width: 600px) and (max-width: 900px) {
          /* Styles for tablets */
          .header h1 {
            font-size: 18px;
          }

          .header li {
            font-size: 12px;
          }

          .header li a {
            padding: 5px 5px;
          }
        }
      </style>
    `;
  }
}

customElements.define('tpen3-header', TpenHeader);