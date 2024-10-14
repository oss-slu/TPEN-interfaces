class ClassroomGroup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        console.log('ClassroomGroup component initialized.');
    }

    // Function to fetch project data from TPEN API
    async fetchProjectData(projectId) {
        const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vcmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImh0dHA6Ly9zdG9yZS5yZXJ1bS5pby9hZ2VudCI6Imh0dHBzOi8vc3RvcmUucmVydW0uaW8vdjEvaWQvNjcwOTg4NWIzZjliZmJiZjY1NjY5MTAwIiwiaHR0cDovL3JlcnVtLmlvL2FwcF9mbGFnIjpbInRwZW4iXSwiaHR0cDovL2R1bmJhci5yZXJ1bS5pby9hcHBfZmxhZyI6WyJ0cGVuIl0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImlzcyI6Imh0dHBzOi8vY3ViYXAuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDY3MDk4ODVhMGVhNjBhNmIwZGRhODI4ZiIsImF1ZCI6WyJodHRwczovL2N1YmFwLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9jdWJhcC5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzI4ODU5NjkxLCJleHAiOjE3Mjg4NjY4OTEsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgdXBkYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBvZmZsaW5lX2FjY2VzcyIsImF6cCI6ImJCdWdGTVdIVW8xT2huU1pNcFlVWHhpM1kxVUpJN0tsIn0.nZrU6bhc23EhyT2CbtfgfoFXlqDdRokyEz7EZihGjaZBPdU1NjM80UMoj2aSLBSwm0YUF9_OTpKHtvjIvSz83jk6Rho7dgZ_bDYiyGjzOz1rYOHGHonfcpTgrYSdhdIyHMpFo7zg20SCstvGg3UU5rtVkmIwPfBT8dLSHf1sbVOromD87mg68J45N0kMYZ-eJAzQgDEK3Bs6EF3lrOr3B_TnNuAwmJoJvKKjhuxBs6t2pRKZrGwlUFxOe1nyUbry8bEz9ylvAIWyVho1fNOhw5eASKzbU47pdY71zWFelwyq_DGcvvZL56w0f5zJ0WY9AB8c0g8-ATm3usES_4okLw'
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