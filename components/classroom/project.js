// function extracts projectID from URL of the page
export function getProjectIDFromURL() {
    const params = new URLSearchParams(window.location.search); //searches the query parameters (everything after ?)
    let projectIdQuery = params.get('projectId');
    console.log('Query Parameter Project ID:', projectIdQuery); 

    if (!projectIdQuery) {
        const hash = window.location.hash; //searches the fragment identifier (everything after #)
        let projectIdHash = hash.substring(1); 
        console.log('Hash Project ID:', projectIdHash);
        return projectIdHash;
    }
    else {
        return projectIdQuery;
    }
}

/* // Call the function to get the ProjectID and display it
const projectID = getProjectIDFromURL();
if (projectID) {
    document.getElementById('project-info').textContent = 'Project ID: ' + projectID;
}
else {
    document.getElementById('project-info').textContent = 'Project ID not found in URL';
} */