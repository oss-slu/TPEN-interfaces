import { Roles } from './groups/roles.mjs';
import TPEN from '../../TPEN/index.mjs';

async function fetchUserRoles(projectId) {
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

        // Get the currently logged-in user's name
        const currentUser = TPEN.currentUser?.displayName;
        if (!currentUser) {
            console.error("No logged-in user found.");
            return null;
        }

        // Find the logged-in user's roles
        const userRoles = collaborators.find(collab => collab.name === currentUser)?.roles || [];

        console.log("Logged-in User:", currentUser);
        console.log("Extracted Roles:", userRoles);

        return { ...data, userRoles }; // Return user roles specifically

    } catch (error) {
        console.error("Error fetching project data:", error);
        return null; // Return null if an error occurs
    }
}

export function updateUIBasedOnRoles(roles) {
    const managementOptions = document.getElementById('managementOptions');
    const viewOptions = document.getElementById('viewOptions');

    if (!roles || roles.length === 0) {
        managementOptions.style.display = 'none';
        viewOptions.style.display = 'none';
        return;
    }

    if (roles.includes(Roles.CONTRIBUTOR)) {
        managementOptions.style.display = 'none';
        viewOptions.style.display = 'block';
    }

    if (roles.includes(Roles.OWNER) || roles.includes(Roles.LEADER)) {
        managementOptions.style.display = 'block';
    } else {
        managementOptions.style.display = 'none';
    }

    viewOptions.style.display = 'block'; // Default visible for all roles
}

// Fetch project data and update UI on page load
document.addEventListener("DOMContentLoaded", async () => {
    const projectID = '671bef745c729146b048fe9a'; // Replace with actual project ID
    const projectData = await fetchUserRoles(projectID);

    if (projectData) {
        updateUIBasedOnRoles(projectData.userRoles);
    }
});