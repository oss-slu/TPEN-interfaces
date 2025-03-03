import TPEN from '../../api/TPEN.mjs';
import { updateUIBasedOnRoles } from './roleBasedDisplay.mjs';

// Get references to UI elements
const PROJECT_FORM = document.getElementById("projectId");
const MSG_CONTAINER = document.getElementById("msg");

/**
 * Fetches project data from the TPEN API using the given project ID.
 * Extracts user roles and updates the UI accordingly.
 * @param {string} projectId - The ID of the project to fetch.
 * @returns {Object|null} Project data including user roles, or null if an error occurs.
 */
async function fetchProjectData(projectId) {
    console.log("Fetching project data for:", projectId);

    try {
        const token = TPEN.getAuthorization();
        const response = await fetch(`${TPEN.servicesURL}/project/${projectId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        console.log("Project Data Fetched:", data);

        if (!data || !data._id) {
            console.error("API response was empty or invalid!");
            return null;
        }

        // Extract all collaborators and their roles
        const collaborators = Object.entries(data.collaborators || {}).map(([key, value]) => ({
            id: key,
            name: value.profile.displayName,
            roles: value.roles
        }));

        // Get the currently logged-in user's name
        const currentUser = TPEN.currentUser?.displayName;
        const userRoles = currentUser 
            ? collaborators.find(collab => collab.name === currentUser)?.roles || [] 
            : [];

        console.log("Logged-in User:", currentUser);
        console.log("Extracted Roles:", userRoles);

        // Update UI based on extracted roles
        updateUIBasedOnRoles(userRoles);

        // Display all collaborators in the message container
        MSG_CONTAINER.innerHTML = `<pre>${JSON.stringify(collaborators, null, 2)}</pre>`;

        return { ...data, userRoles }; // Include userRoles in returned data

    } catch (error) {
        console.error("Error fetching project data:", error);
        MSG_CONTAINER.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        return null;
    }
}

/**
 * Event listener for when a user clicks on a project in the list.
 * Fetches and displays the project's details including roles and permissions.
 */
document.getElementById("clickList").addEventListener("click", async function (event) {
    const LI = event.target.closest("#clickList li");
    if (LI) {
        const projectID = LI.getAttribute("tpen-project-id");
        console.log(`Project clicked: Fetching details for Project ID: ${projectID}`);

        if (!projectID) {
            console.error("No project ID found!");
            return;
        }

        try {
            const projectData = await fetchProjectData(projectID);

            if (!projectData) {
                console.error("No project data returned!");
                MSG_CONTAINER.innerHTML = `<p style="color: red;">No project data available.</p>`;
                return;
            }

            // Extract user roles
            const userRoles = projectData.userRoles || [];

            // Extract permissions for the user's roles
            const userPermissions = new Set();
            userRoles.forEach(role => {
                if (projectData.roles[role]) {
                    projectData.roles[role].forEach(permission => userPermissions.add(permission));
                }
            });

            const permissionsArray = Array.from(userPermissions);

            // Display roles and permissions in the UI
            const rolesDisplay = userRoles.length 
                ? `<p><strong>Roles:</strong> ${userRoles.join(", ")}</p>` 
                : "<p>No assigned roles</p>";

            MSG_CONTAINER.innerHTML = `
                <p><strong>Project ID: </strong> ${projectData._id || "Unknown"}</p>
                ${rolesDisplay}
                <p><strong>Permissions:</strong> ${permissionsArray.length ? permissionsArray.join(", ") : "No permissions available"}</p>
            `;

        } catch (error) {
            console.error("Error fetching project data:", error);
            MSG_CONTAINER.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    }
});

// Fetch project data when the project form is submitted
fetchProjectData(PROJECT_FORM);