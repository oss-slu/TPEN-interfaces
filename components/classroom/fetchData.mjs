import TPEN from '../../api/TPEN.mjs';

/**
 * Fetches project data from the TPEN API using the given project ID.
 * Extracts user roles and updates the UI accordingly.
 * @param {string} projectId - The ID of the project to fetch.
 * @returns {Object|null} Project data including user roles, or null if an error occurs.
 */
export async function fetchProjectData(projectId) {
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

        return data;
    } catch (error) {
        console.error("Error fetching project data:", error);
        return null;
    }
}