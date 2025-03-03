import { updateUIBasedOnRoles } from "./roleBasedDisplay.mjs";

/**
 * Updates the UI with project details, roles, and permissions.
 * @param {Object} projectData - The project data.
 * @param {Array} userRoles - The user's roles.
 */
export function updateUI(projectData, userRoles) {
    const MSG_CONTAINER = document.getElementById("msg");

    // Extract permissions
    const userPermissions = new Set();
    userRoles.forEach(role => {
        if (projectData.roles[role]) {
            projectData.roles[role].forEach(permission => userPermissions.add(permission));
        }
    });

    const permissionsArray = Array.from(userPermissions);

    // Display project info
    MSG_CONTAINER.innerHTML = `
        <p><strong>Project ID: </strong> ${projectData._id || "Unknown"}</p>
        <p><strong>Roles:</strong> ${userRoles.length ? userRoles.join(", ") : "No assigned roles"}</p>
        <p><strong>Permissions:</strong> ${permissionsArray.length ? permissionsArray.join(", ") : "No permissions available"}</p>
    `;

    // Update UI elements based on roles
    updateUIBasedOnRoles(userRoles);
}