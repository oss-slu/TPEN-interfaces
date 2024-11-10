import TPEN from '../../TPEN/index.mjs';

const PROJECT_FORM = document.getElementById('projectForm');

PROJECT_FORM.TPEN = new TPEN();
TPEN.attachAuthentication(PROJECT_FORM);

if (PROJECT_FORM.TPEN.activeProject?._id) {
    projectId.value = PROJECT_FORM.TPEN.activeProject._id;
    const token = TPEN.getAuthorization();
    // until the Project class is better defined, we'll just fetch the project data directly
    const project = await fetch(`${PROJECT_FORM.TPEN.servicesURL}/project/${PROJECT_FORM.TPEN.activeProject._id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.ok ? res.json() : Promise.reject(res.status))
        .then(data => msg.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`)
        .catch(err => msg.innerHTML = `<pre>${JSON.stringify(err, null, 2)}</pre>`);
}

PROJECT_FORM.addEventListener('submit', async function (event) {
    const projectID = projectId.value;
    location.href = '?projectID=' + projectID;  // Redirect to the same page with the projectID in the query string
});

clickList.addEventListener('click', function (event) {
    const LI = event.target.closest('LI');
    if (LI) {
        location.href = '?projectID=' + event.target.getAttribute('tpen-project-id');
    }
});