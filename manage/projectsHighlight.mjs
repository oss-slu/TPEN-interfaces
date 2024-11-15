// projects.mjs
import User from "../User/index.mjs"
import Project from "../Project/index.mjs"

const elem = document.getElementById("manage-class")
TPEN.attachAuthentication(elem)

TPEN.eventDispatcher.on("tpen-authenticated", loadProjects)

async function fetchProjects() {
    const token = elem.userToken
    const userObj = User.fromToken(token)
    return await userObj.getProjects()
}

function renderProjects(projects) {
    const projectsList = document.getElementById('projects-list')
    projectsList.innerHTML = ''

    projects.forEach(project => {
        const projectItem = document.createElement('li')
        projectItem.classList.add('project')
        projectItem.innerHTML = `
            <div class="title">${project.name ?? project.title}</div>
            <div class="delete" data-id="${project._id}">&#128465;</div>
        `
        projectsList.appendChild(projectItem)
    })

    // Add delete functionality to each delete button
    const deleteButtons = projectsList.querySelectorAll('.delete')
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const projectID = event.target.getAttribute('data-id')
            deleteProject(projectID)
        })
    })
}


async function renderActiveProject(fallbackProjectId) {
    const activeProjectContainer = document.getElementById('active-project')
    activeProjectContainer.innerHTML = ''

    let projectId = new TPEN().activeProject?._id // ?? fallbackProjectId
    if(!projectId) {
        // cheat to help other tabs for now
        location.href = `?projectID=${fallbackProjectId ?? 'DEV_ERROR'}`
        return
    }
    
    let project = new Project(projectId)
    let projectData = await project.fetch()

    activeProjectContainer.innerHTML = `   <p>
    Active project is
    <span class="red"> "${projectData?.name ?? projectData?.title ?? '[ untitled ]' }"</span>

  </p>
  <p>
    Active project T-PEN I.D.
    <span class="red">${projectData._id ?? 'ERR!'}</span>
  </p>`
}

async function deleteProject(projectID) {
    try {
        const response = await fetch(`/api/projects/${projectID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${window.TPEN_USER?.authorization}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('Failed to delete the project')
        }

        loadProjects()
    } catch (error) {
        console.log('Error deleting project:', error)
        throw error
    }
}


// This function is called after the "projects" component is loaded
async function loadProjects() {
    const projects = await fetchProjects()
    renderActiveProject(projects[0]?._id)
    renderProjects(projects)
}


export { loadProjects }
