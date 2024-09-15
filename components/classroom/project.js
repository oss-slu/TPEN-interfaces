// function extracts projectID from URL of the page
function getProjectIDFromURL() {
    const params = new URLSearchParams(window.location.search);
    let projectId = params.get('projectId');
    console.log(projectId); 

    if (!projectId) {
        const hash = window.location.hash;
        projectId = hash.substring(1); 
        console.log(projectId);
        return projectId
    }
    else {
        return projectId
    }
}