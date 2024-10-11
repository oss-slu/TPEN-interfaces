// main.js

import { getProjectIDFromURL } from './groups/utils/project.js';

// Function to fetch project data from the TPEN API
async function fetchProjectData(projectId) {
    const bearerToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vc3RvcmUucmVydW0uaW8vYWdlbnQiOiJodHRwczovL3N0b3JlLnJlcnVtLmlvL3YxL2lkLzY2YjliMzE5OTMyNTgyMzBjYTM4NmY4NiIsImh0dHA6Ly9yZXJ1bS5pby9hcHBfZmxhZyI6WyJ0cGVuIl0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vYXBwX2ZsYWciOlsidHBlbiJdLCJodHRwOi8vcmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImlzcyI6Imh0dHBzOi8vY3ViYXAuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDY2YjliMzE4YzZhMjU4MDZjOTgxMDg3YyIsImF1ZCI6WyJodHRwczovL2N1YmFwLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9jdWJhcC5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzI4NjU5NTgyLCJleHAiOjE3Mjg2NjY3ODIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgdXBkYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBvZmZsaW5lX2FjY2VzcyIsImF6cCI6ImJCdWdGTVdIVW8xT2huU1pNcFlVWHhpM1kxVUpJN0tsIn0.QAdI3o_MQLZ_pqs6-pSplqKXdq6xXYaMS1QRG6xrVKAieFFHZL67V9uTRgRSMPOz4UxG83KzXXMqBbVV83jc79zlbBidUfej-1HVOYMIYGikImazl9Mt-JFCjLffSovM2PIv68tieqcFjXplJaTpdWQviMXqTlC9xeXGgpnKJ_XpdqZX5A19bLzy3yF2AvqYC9lPD79tuE5bV1t0rYL5B3doQ0NdajNcaklyZgiBqP2lFG4mDXKFtWHC_hA4z6DTYx2QaH5fvIovdrA8y3EwTk7Z4-8lEpqqgut4aLwj0Q4nkdMjR4rtrtvRVjlPhLU9_BYrX22J2R1p4nDC7QvCcw'; // Replace with your token
    const apiUrl = `https://api.t-pen.org/project/${projectId}`;
    
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
    document.getElementById('projectName').textContent = `Project Name: ${data.name}`;
    document.getElementById('projectCreator').textContent = `Project Creator: ${data.creator}`;
}

// On page load, fetch the project data
window.onload = () => {
    const projectId = getProjectIDFromURL();
    if (projectId) {
        fetchProjectData(projectId);
    } else {
        console.log('Project ID not found in URL');
    }
};
