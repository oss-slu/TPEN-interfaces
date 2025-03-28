import TPEN from '../../TPEN/index.mjs';

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

    const projectData = await response.json();
    
    if (!projectData || !projectData._id) {
      throw new Error("Invalid or missing project data");
    }

    console.log("Project Data:", projectData);
    window.projectData = projectData;

    // Try to get the user ID from TPEN, fallback to matching the first ID with a displayName
    let userID = TPEN?.currentUser?._id;

    if (!userID) {
      userID = Object.keys(projectData.collaborators).find(
        id => projectData.collaborators[id].profile?.displayName
      );
    }

    const user = projectData.collaborators?.[userID];
    const roles = user?.roles || [];

    console.log("User Roles:", roles);

    // Show the roles on screen
    const roleDisplay = document.createElement("p");
    roleDisplay.textContent = `Roles: ${roles.join(", ")}`;
    document.body.appendChild(roleDisplay);

    // Build buttons based on roles
    let buttonsHTML = "";

    if (roles.includes("OWNER") || roles.includes("LEADER")) {
      buttonsHTML += `
        <button>Invite New Members</button>
        <button>Manage Roster</button>
        <button>Manage Roles</button>
      `;
    }

    if (roles.includes("CONTRIBUTOR")) {
      buttonsHTML += `
        <button>Upload Assignments</button>
        <button>Transcription</button>
        <button>Gradebook</button>
      `;
    }

    if (!buttonsHTML) {
      buttonsHTML = "<p>You have no special permissions in this project.</p>";
    }

    const container = document.createElement("div");
    container.style.marginTop = "1rem";
    container.innerHTML = buttonsHTML;
    document.body.appendChild(container);

  } catch (err) {
    console.error("Something went wrong:", err);
    document.body.innerHTML = "<p style='color:red;'>Something went wrong. Try again.</p>";
  }
});
