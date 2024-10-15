import { getProjectIDFromURL } from './groups/utils/project.js';

// Bearer token and base API URL
const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vc3RvcmUucmVydW0uaW8vYWdlbnQiOiJodHRwczovL3N0b3JlLnJlcnVtLmlvL3YxL2lkLzY2YjliMzE5OTMyNTgyMzBjYTM4NmY4NiIsImh0dHA6Ly9yZXJ1bS5pby9hcHBfZmxhZyI6WyJ0cGVuIl0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vYXBwX2ZsYWciOlsidHBlbiJdLCJodHRwOi8vcmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImlzcyI6Imh0dHBzOi8vY3ViYXAuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDY2YjliMzE4YzZhMjU4MDZjOTgxMDg3YyIsImF1ZCI6WyJodHRwczovL2N1YmFwLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9jdWJhcC5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzI4OTE3NzAwLCJleHAiOjE3Mjg5MjQ5MDAsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgdXBkYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBvZmZsaW5lX2FjY2VzcyIsImF6cCI6ImJCdWdGTVdIVW8xT2huU1pNcFlVWHhpM1kxVUpJN0tsIn0.4lA5GxKA_RJ4MbIlOjDiZvBYLrldeABqZffYQ7ZM1MFDmim_C9croJLALPIdZlrXXKrDIXJjPcMAyR9P9eCxvEiH01uPLtXlZoCRRRnzyBZdw-DejbUQbQrsEVb7eo5GC7UxUyeGJKB5Ahiv1xbzAtEQHx5woHxa7zVnncKuPD-wNCed6XcFad3Cg38iris89vkr0l4eUanG1tOjJUPzLnyj_SIjEUAnjKxEX-tKe_0QjXXCkvRm-GLibOMY6kh6ce-oRe0n5lnqy2Fw2TgOGgE62SaNNyk8aK28JY3oAwxy73ksH-Me4WfSEWELFZRPvXgD8RYdwAmUGFXOvsNs9A'; // bearer token
const baseApiUrl = 'https://dev.api.t-pen.org';

// Function to fetch project data from the TPEN API
async function fetchProjectData(projectId) {
    const apiUrl = `${baseApiUrl}/project/${projectId}`;
    console.log('Fetching project data for projectId:', projectId);

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
        displayProjectData(projectData);
    } catch (error) {
        console.error('Error fetching project data:', error);
    }
}

// Function to display project data in the HTML
function displayProjectData(data) {
    document.getElementById('projectId').textContent = `Project ID: ${data._id}`;
    document.getElementById('projectCreator').textContent = `Project Creator: ${data.creator}`;
    document.getElementById('projectManifest').textContent = `Project Name: ${data.manifest}`;
}

// Function to create a new project
async function createProject(projectName, projectCreator, projectDescription, projectKeywords, projectLayerName, projectLayerType, projectManifest, projectContext) {
    const apiUrl = `${baseApiUrl}/project/create`;
    
    const projectData = {
        name: projectName,
        metadata: {
            description: projectDescription,
            keywords: projectKeywords.split(',').map(keyword => keyword.trim()) // Convert keywords to an array
        },
        layers: [
            {
                name: projectLayerName,
                type: projectLayerType
            }
        ],
        title: projectName,
        manifest: projectManifest,
        '@context': projectContext
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error details:', errorDetails);
            throw new Error('Failed to create the project');
        }

        const newProject = await response.json();
        console.log('Created Project ID:', newProject._id);
        console.log('Project creation response:', newProject);
        displayProjectData(newProject);
        alert('Project created successfully!');
    } catch (error) {
        console.error('Error creating project:', error);
    }
}

// Event listener for creating a project
document.getElementById('createProjectForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    
    const projectCreator = document.getElementById('projectCreatorInput').value;
    const projectDescription = document.getElementById('projectDescriptionInput').value;
    const projectKeywords = document.getElementById('projectKeywordsInput').value;
    const projectLayerName = document.getElementById('projectLayerNameInput').value;
    const projectLayerType = document.getElementById('projectLayerTypeInput').value;
    const projectManifest = document.getElementById('projectManifestInput').value;
    const projectContext = document.getElementById('projectContextInput').value;

    createProject(projectId, projectCreator, projectDescription, projectKeywords, projectLayerName, projectLayerType, projectManifest, projectContext);
});

// On page load, fetch the project data if projectId is found in the URL
window.onload = () => {
    const projectId = getProjectIDFromURL();
    if (projectId) {
        fetchProjectData(projectId);
    } else {
        console.log('Project ID not found in URL');
    }
};
