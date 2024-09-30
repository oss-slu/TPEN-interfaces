import { getProjectIDFromURL } from './project.js';
export async function fetchProjectData(projectId) {
    try {
        const response = await fetch(`https://api.t-pen.org/project/${projectId}`);
        
        if (!response.ok) {
            throw error;
        }

        const data = response.json();
        console.log(data);  // Log the data to inspect its structure

        return data;  // Return data for further use if needed
    } catch (error) {
        console.error(`Failed to fetch project data: ${error}`);
    }
}