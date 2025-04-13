import TPEN from "../../../api/TPEN.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  const projectId = new URLSearchParams(window.location.search).get("projectID");
  const gradebookContainer = document.getElementById("gradebook-names");

  if (!projectId) {
    gradebookContainer.innerHTML = "<p style='color:red;'>Missing project ID.</p>";
    return;
  }

  try {
    const token = TPEN.getAuthorization();

    const response = await fetch(`${TPEN.servicesURL}/project/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const projectData = await response.json();
    const collaborators = projectData?.collaborators || {};

    // Filter only contributors
    const contributors = Object.values(collaborators).filter(collab =>
      collab.roles.includes("CONTRIBUTOR")
    );

    if (contributors.length === 0) {
      gradebookContainer.innerHTML = "<p>No contributors found in this project.</p>";
      return;
    }
      
    contributors.forEach(user => {
        const name = user.profile?.displayName || "Unknown";
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${name}</td>
          <td>TBD</td>
          <td>TBD</td>
          <td>TBD</td>
        `;
        gradebookContainer.appendChild(row);
      });
  
    } catch (err) {
      console.error("Error loading gradebook contributors:", err);
    }
});
