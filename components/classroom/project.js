// function extracts projectID from URL of the page
function getProjectIDFromURL() {
    const params = new URLSearchParams(window.location.search); //searches the query parameters (everything after ?)
    let projectId = params.get('projectId');
    console.log(projectId); 

    if (!projectId) {
        const hash = window.location.hash; //searches the fragment identifier (everything after #)
        projectId = hash.substring(1); 
        console.log(projectId);
        return projectIdgit
    }
    else {
        return projectId
    }
}

// Call the function to get the ProjectID and display it
const projectID = getProjectIDFromURL();
if (projectID) {
    document.getElementById('project-info').textContent = 'Project ID: ' + projectID;
}
else {
    document.getElementById('project-info').textContent = 'Project ID not found in URL';
}