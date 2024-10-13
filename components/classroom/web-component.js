class ClassroomGroup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    // This method watches for changes in the project-id attribute
    static get observedAttributes() {
        return ['project-id'];
    }

    // This method runs when the project-id attribute changes
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'project-id' && newValue) {
            this.fetchProjectData(newValue);
        }
    }

    // Function to fetch project data from the TPEN API
    async fetchProjectData(projectId) {
        const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vc3RvcmUucmVydW0uaW8vYWdlbnQiOiJodHRwczovL3N0b3JlLnJlcnVtLmlvL3YxL2lkLzY2YjliMzE5OTMyNTgyMzBjYTM4NmY4NiIsImh0dHA6Ly9yZXJ1bS5pby9hcHBfZmxhZyI6WyJ0cGVuIl0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vYXBwX2ZsYWciOlsidHBlbiJdLCJodHRwOi8vcmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImlzcyI6Imh0dHBzOi8vY3ViYXAuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDY2YjliMzE4YzZhMjU4MDZjOTgxMDg3YyIsImF1ZCI6WyJodHRwczovL2N1YmFwLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9jdWJhcC5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzI4Njc1MDczLCJleHAiOjE3Mjg2ODIyNzMsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgdXBkYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBvZmZsaW5lX2FjY2VzcyIsImF6cCI6ImJCdWdGTVdIVW8xT2huU1pNcFlVWHhpM1kxVUpJN0tsIn0.TRmYqcEIGh5lvt_6mjX6CULsiIthh-P-gWLAl_JDuKjZsbbw-gSzX5ogQ70Iya9vxGdbBemYdKMqW2I8CN7w-4MCt4GMQvLNDXbaf8HUs4ohVqMzkpRvjjqwHtWzrIYO_f8ceKU8KFeu3czGmZ0_1_R30zTrEty0WMEVfhAI1v7qUiE5VY5tef-rbX19lcAMUku4b0xs8lKzlKFzsekSFtZsJ-pOoytMLWoEIeU_hxE8AmdCSm3W9Hg3jAVVIBDMKpY0foI4BSAsCWzfT9qnjBTbKtixM4k4MWyAJISERn9coIJFOG9ae6GP8JiVrIMD9je0gxDSxik8HnRINBsmLA'
        const apiUrl = `https://dev.api.t-pen.org/project/${projectId}`;
        
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${bearerToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const projectData = await response.json();
            renderProjectData(projectData);
        } catch (error) {
            console.error('Error fetching project data:', error);
            this.shadowRoot.innerHTML = `<p>Error fetching project data</p>`
        }
    }

    // This method renders the project data inside the component
    renderProjectData(projectData) {
        this.shadowRoot.innerHTML = `
            <div>
                <h2>Project Name: ${projectData.name}</h2>
                <p>Project Creator: ${projectData.creator}</p>
                <ul>
                    ${data.contributors.map(contributor => `<li>${contributor.name}</li>`).join('')}
                </ul>
            </div>
        `;
    }
}


// Define the custom element
customElements.define('classroom-group', ClassroomGroup);