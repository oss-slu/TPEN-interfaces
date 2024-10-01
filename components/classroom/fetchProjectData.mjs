export async function fetchProjectData(projectId) {
    try {
        const response = await fetch(`https://api.t-pen.org/project/${projectId}`, {});
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Project not found');
            } else if (response.status === 401) {
                throw new Error('Unauthorized: Please check your API key or token');
            } else {
                throw new Error(`Error: ${response.statusText}`);
            }
        }

        const data = await response.json();
        console.log('Fetched Data:', data);  // Log the data to inspect its structure
        return data;
    } catch (error) {
        console.error(`Failed to fetch project data: ${error}`);
        return null;
    }
}