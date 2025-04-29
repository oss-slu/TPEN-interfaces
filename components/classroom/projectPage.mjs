import TPEN from '../../TPEN/index.mjs';

function extractUsernameFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.nickname || payload?.name || payload?.preferred_username;
  } catch (e) {
    console.warn("Couldn't extract username from token", e);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const projectId = new URLSearchParams(window.location.search).get("projectID");

  if (!projectId) {
    document.body.innerHTML = "<p style='color:red;'>Missing project ID in URL.</p>";
    return;
  }

  try {
    const token = TPEN.getAuthorization();
    const response = await fetch(`${TPEN.servicesURL}/project/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const username = extractUsernameFromToken(token);
    console.log("Extracted Username:", username);

    const projectData = await response.json();
    if (!projectData || !projectData._id) {
      throw new Error("Invalid or missing project data");
    }

    console.log("Project Data:", projectData);
    window.projectData = projectData;

    const userID = Object.keys(projectData.collaborators).find(id => {
      return projectData.collaborators[id].profile?.displayName === "sowmya.mutya";//username;
    });

    const user = projectData.collaborators?.[userID];
    const roles = user?.roles || [];
    const displayName = user?.profile?.displayName || "Unknown";

    console.log("User Roles:", roles);
    console.log("User Display Name:", displayName);

    // Display user info
    const nameDisplay = document.createElement("p");
    nameDisplay.textContent = `Welcome, ${displayName}`;
    document.body.appendChild(nameDisplay);

    // Show the roles on screen
    const roleDisplay = document.createElement("p");
    roleDisplay.textContent = `Roles: ${roles.join(", ")}`;
    document.body.appendChild(roleDisplay);

    // Build buttons based on roles
    let buttonsHTML = "";

    if (roles.includes("OWNER") || roles.includes("LEADER")) {
      buttonsHTML += `
        <button onclick="window.location.href='inviteroster.html?projectID=${projectId}'">Invite New Members</button>
        <button onclick="window.location.href='templates/manageRoster.html?projectID=${projectId}'">Manage Roster</button>
        <button onclick="window.location.href='templates/manageRoles.html?projectID=${projectId}'">Manage Roles</button>
        <button onclick="window.location.href='templates/gradebook.html?projectID=${projectId}'">Gradebook</button>
      `;
    }

    if (roles.includes("CONTRIBUTOR")) {
      buttonsHTML += `
        <button onclick="window.location.href='templates/uploadAssignments.html?projectID=${projectId}'">Upload Assignments</button>
        <button onclick="window.location.href='templates/transcription.html?projectID=${projectId}'">Transcription</button>
        <button onclick="window.location.href='templates/grades.html?projectID=${projectId}'">Grades</button>
      `;
    }

    if (!buttonsHTML) {
      buttonsHTML = "<p>You have no special permissions in this project.</p>";
    }

    // Create a div to hold the buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    buttonContainer.innerHTML = buttonsHTML;

    // Create the main container if it doesn't already exist
    let container = document.querySelector(".container");
    if (!container) {
      container = document.createElement("div");
      container.className = "container";
      document.body.appendChild(container);
    }

    // Append the role display and button container to the main container
    container.appendChild(roleDisplay);
    container.appendChild(buttonContainer);

  } catch (err) {
    console.error("Something went wrong:", err);
    document.body.innerHTML = "<p style='color:red;'>Something went wrong. Try again.</p>";
  }
});
