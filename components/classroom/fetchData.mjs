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

document.getElementById("clickList").addEventListener("click", function (event) {
    const LI = event.target.closest("#clickList li");
    if (!LI) return;

    const projectID = LI.getAttribute("tpen-project-id");
    if (!projectID) return;

    // Redirect to new page
    window.location.href = `project.html?projectID=${projectID}`;
});

fetchProjectData(PROJECT_FORM);





