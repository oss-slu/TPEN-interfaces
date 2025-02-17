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

        // Display all collaborators in ms
        msg.innerHTML = `<pre>${JSON.stringify(collaborators, null, 2)}</pre>`;

        return data; // Ensures function returns data

    } catch (error) {
        console.error("Error fetching project data:", error);
        MSG_CONTAINER.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        return null; // Return null if an error occurs
    }
}

PROJECT_FORM.addEventListener('submit', async function (event) {
    const projectID = projectId.value;
    location.href = '?projectID=' + projectID;  // Redirect to the same page with the projectID in the query string
});

document.getElementById("clickList").addEventListener("click", async function (event) {
    const LI = event.target.closest("#clickList li");
    if (LI) {
        const projectID = LI.getAttribute("tpen-project-id");
        console.log(`✅ Project clicked! Fetching details for Project ID: ${projectID}`);

        if (!projectID) {
            console.error("No project ID found!");
            return;
        }

        try {
            console.log("Calling fetchProjectData...");
            const projectData = await fetchProjectData(projectID);
            console.log("Project data fetched:", projectData);

            if (!projectData) {
                console.error("No project data returned!");
                MSG_CONTAINER.innerHTML = `<p style="color: red;">No project data available.</p>`;
                return;
            }

            MSG_CONTAINER.innerHTML = `
                <p><strong>Project ID: </strong> ${projectData._id || "Unknown"}</p>
                <p><strong>User Roles:</strong> ${Array.isArray(projectData.roles) ? projectData.roles.join(", ") : "No roles assigned"}</p>
                <p><strong>Permissions:</strong> ${Array.isArray(projectData.permissions) ? projectData.permissions.join(", ") : "No permissions available"}</p>
            `;

        } catch (error) {
            console.error("Error fetching project data:", error);
            MSG_CONTAINER.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    }
});

fetchProjectData(PROJECT_FORM);




