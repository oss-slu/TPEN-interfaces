import TPEN from "../../../api/TPEN.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  const rosterList = document.getElementById("roster-list");
  const projectId = new URLSearchParams(window.location.search).get("projectID");

  if (!projectId) {
    rosterList.innerHTML = "<li style='color:red;'>Missing project ID in URL.</li>";
    return;
  }

  try {
    const token = TPEN.getAuthorization();
    const response = await fetch(`${TPEN.servicesURL}/project/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const projectData = await response.json();
    const collaborators = projectData.collaborators || {};

    rosterList.innerHTML = "";

    Object.keys(collaborators).forEach(id => {
      const user = collaborators[id];
      const name = user.profile?.displayName || "(Unnamed)";
      const roles = user.roles?.join(", ") || "No roles";

      const li = document.createElement("li");
      li.textContent = `${name} — ${roles}`;
      rosterList.appendChild(li);
    });

  } catch (err) {
    console.error("Failed to fetch roster:", err);
    rosterList.innerHTML = "<li style='color:red;'>Error loading roster.</li>";
  }

  // Handle member removal
  document.getElementById("remove-form").addEventListener("submit", e => {
    e.preventDefault();
    const memberId = document.getElementById("member-id").value;
    document.getElementById("remove-message").textContent =
      `🛠️ (Stub) Would attempt to remove: ${memberId}`;
  });
});
