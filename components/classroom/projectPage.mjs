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

    const roles = Object.keys(projectData.roles || {});
    const container = document.createElement("div");

    if (roles.includes("OWNER") || roles.includes("LEADER")) {
        
      container.innerHTML = `
        <button>Invite New Members</button>
        <button>Manage Roster</button>
        <button>Manage Roles</button>
      `;
    } else if (roles.includes("CONTRIBUTOR")) {
      container.innerHTML = `
        <button>Upload Assignments</button>
        <button>Transcription</button>
        <button>Gradebook</button>
      `;
    } else {
      container.innerHTML = "<p>You have no special permissions in this project.</p>";
    }

    document.body.appendChild(container);

  } catch (err) {
    console.error("Something went wrong:", err);
    document.body.innerHTML = "<p style='color:red;'>Something went wrong. Try again.</p>";
  }
});
