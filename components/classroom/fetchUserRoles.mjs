import TPEN from "../../api/TPEN.mjs";

/**
 * Extracts user roles from project data.
 * @param {Object} projectData - The project data object.
 * @returns {Array} List of user roles.
 */
export function extractUserRoles(projectData) {
    if (!projectData || !projectData.collaborators) return [];

    const collaborators = Object.entries(projectData.collaborators).map(([key, value]) => ({
        id: key,
        name: value.profile.displayName,
        roles: value.roles
    }));

    const currentUser = TPEN.currentUser?.displayName;
    return currentUser ? collaborators.find(collab => collab.name === currentUser)?.roles || [] : [];
}