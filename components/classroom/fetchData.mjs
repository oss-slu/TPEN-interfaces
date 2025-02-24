import TPEN from '../../TPEN/index.mjs';

const PROJECT_FORM = document.getElementById("projectId");
const MSG_CONTAINER = document.getElementById("msg"); 

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

        // Extract all collaborators
        const collaborators = Object.entries(data.collaborators || {}).map(([key, value]) => ({
            id: key,
            name: value.profile.displayName,
            roles: value.roles
        }));

        // Display all collaborators in msg
        MSG_CONTAINER.innerHTML = `<pre>${JSON.stringify(collaborators, null, 2)}</pre>`;

        return data; // Ensures function returns data

    } catch (error) {
        console.error("Error fetching project data:", error);
        MSG_CONTAINER.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        return null; // Return null if an error occurs
    }
}

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
            console.log("Project data fetched:", projectData);

            if (!projectData) {
                console.error("No project data returned!");
                MSG_CONTAINER.innerHTML = `<p style="color: red;">No project data available.</p>`;
                return;
            }

            const userRoles = Object.keys(projectData.roles || {}).join(", ");

            const rolesDisplay = userRoles ? `<p><strong>Roles:</strong> ${userRoles}</p>` : "<p>No assigned roles</p>";
            
            MSG_CONTAINER.innerHTML = `
                <p><strong>Project ID: </strong> ${projectData._id || "Unknown"}</p>
                ${rolesDisplay}
                <p><strong>Permissions:</strong> ${
                    Array.isArray(projectData.permissions) 
                        ? projectData.permissions.join(", ") 
                        : "No permissions available"
                }</p>
            `;

        } catch (error) {
            console.error("Error fetching project data:", error);
            MSG_CONTAINER.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    }
});

fetchProjectData(PROJECT_FORM);





