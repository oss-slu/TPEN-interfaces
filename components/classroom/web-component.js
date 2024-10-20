class ClassroomGroup extends HTMLElement {
    //  Call the parent class constructor to initialize this web component ClassroomGroup
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        console.log('ClassroomGroup component initialized.');
    }

    // This method watches for changes in the project-id attribute
    static get observedAttributes() {
        console.log('Observed attributes set to: project-id');
        return ['project-id'];
    }

    // This method runs when the project-id attribute changes and triggers the fetching of project data
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute '${name}' changed from '${oldValue}' to '${newValue}'`);
        if (name === 'project-id' && newValue) {
            console.log(`Fetching project data for project ID: ${newValue}`);
            this.fetchProjectData(newValue);
        }
    }

    // Function to fetch project data from API
    async fetchProjectData(projectId) {
        const bearerToken = 'your-token-here';
        const apiUrl = `https://dev.api.t-pen.org/project/${projectId}`;

        console.log('Using Bearer Token:', bearerToken);
        console.log('Requesting data from:', apiUrl);  
        
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.log(`API response status: ${response.status}`);
                if (response.status === 401) {
                    throw new Error('Unauthorized: Invalid or missing token');
                } else if (response.status === 404) {
                    throw new Error('Project not found');
                } else {
                    throw new Error(`Network response was not ok (status: ${response.status})`);
                }
            }

            const projectData = await response.json();
            console.log('Project data fetched successfully:', projectData); 
            this.renderProjectData(projectData); 
        } catch (error) {
            console.error('Error fetching project data:', error);
            this.shadowRoot.innerHTML = `<p>Error fetching project data: ${error.message}</p>`;
        }
    }

    // This method renders the project data inside the component
    renderProjectData(projectData) {
        console.log('Rendering project data...');
        this.shadowRoot.innerHTML = `
            <div>
                <h2>Project Name: ${projectData.name}</h2>
                <p>Project Creator: ${projectData.creator}</p>
                <ul>
                    ${projectData.contributors.map(contributor => `<li>${contributor.name}</li>`).join('')}
                </ul>
            </div>
        `;
        console.log('Project data rendered successfully.');
    }
}

// Define the custom element
customElements.define('classroom-group', ClassroomGroup);

// The logic to handle setting the project-id dynamically
(async function() {
    const projectId = ''; // Example: Replace with the actual project ID you want to test

    try {
        if (projectId) {
            // Set the project ID in the web component's project-id attribute
            const classroomComponent = document.getElementById('classroom-component');
            classroomComponent.setAttribute('project-id', projectId);
            console.log('ID set in web component:', projectId);
        } else {
            console.error('Failed to set project ID');
        }
    } catch (error) {
        console.error('Error setting project ID:', error);
    }
})();
