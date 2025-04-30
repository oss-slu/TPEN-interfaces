import TPEN from "../../api/TPEN.js"
import Project from "../../api/Project.js"

const container = document.body
TPEN.attachAuthentication(container)

document.getElementById("goForwardBtn").addEventListener("click", goForward)
document.getElementById("projectSelect").addEventListener("change", () => {
  document.getElementById("projectData").textContent = ""
  document.getElementById("projectDetails").style.display = "none"
})

async function fetchProjects() {
  const AUTH_TOKEN = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userToken="))
    ?.split("=")[1]

  const params = new URLSearchParams(window.location.search)
  const UID = params.get("UID")

  const response = await fetch(
    `${TPEN.servicesURL}/project/import28/${UID}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`
      }
    }
  )

  const json = await response.json()
  const message = json.message
  const data = json.data

  document.getElementById("message").textContent = message

  const select = document.getElementById("projectSelect")
  for (let key in data) {
    const option = document.createElement("option")
    option.value = `${data[key].name}/${data[key].id}`
    option.text = data[key].name
    select.appendChild(option)
  }
}

async function goForward() {
  const select = document.getElementById("projectSelect")
  const selectedValue = select.value
  const selectedId = selectedValue ? selectedValue.split("/")[2] : null

  const projectDataDiv = document.getElementById("projectData")
  const projectDetailsDiv = document.getElementById("projectDetails")
  const messageDiv = document.getElementById("message")

  projectDataDiv.textContent = ""
  projectDetailsDiv.style.display = "none"
  messageDiv.textContent = ""

  if (!selectedId) {
    messageDiv.textContent = "Please select a project first."
    return
  }

  const AUTH_TOKEN = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userToken="))
    ?.split("=")[1]

  const url = `https://dev.t-pen.org/TPEN/manifest/${selectedId}`

  const importResponse = await fetch(
    `${TPEN.servicesURL}/project/import?createFrom=URL`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({ url })
    }
  )

  const result = await importResponse.json()
  const projectID = result._id

  const projectResponse = await fetch(
    `https://dev.t-pen.org/TPEN/getProjectTPENServlet?projectID=${selectedId}`,
    {
      method: "GET",
      credentials: "include"
    }
  )

  if (!projectResponse.ok) return

  document.getElementById("goForwardBtn").remove()

  const rawText = await projectResponse.text()
  const firstLevel = JSON.parse(rawText)
  const parsedData = {}

  for (const [key, value] of Object.entries(firstLevel)) {
    try {
      parsedData[key] = JSON.parse(value)
    } catch {
      parsedData[key] = value
    }
  }

  projectDataDiv.textContent = JSON.stringify(parsedData.ls_u, null, 2)
  projectDetailsDiv.style.display = "block"

  const projectCollaborators = parsedData.ls_u.map((user) => ({
    email: user.Uname
  }))

  const projectCollaboratorsDiv = document.getElementById("projectCollaborators")
  projectCollaboratorsDiv.style.display = "flex"
  projectCollaboratorsDiv.style.justifyContent = "center"
  projectCollaboratorsDiv.style.alignItems = "center"
  projectCollaboratorsDiv.style.gap = "50px"

  projectCollaborators.forEach((user) => {
    const collaboratorP = document.createElement("p")
    collaboratorP.textContent = user.email
    const collaboratorButton = document.createElement("button")
    collaboratorButton.textContent = "Invite"

    collaboratorButton.addEventListener("click", async () => {
      collaboratorButton.textContent = "Inviting..."
      collaboratorButton.disabled = true

      const project = new Project(projectID)
      await project.addMember(user.email)

      collaboratorButton.textContent = "Submit"
      collaboratorButton.disabled = false

      const successMessage = document.createElement("p")
      successMessage.textContent = "Invitation sent successfully!"
      successMessage.classList.add("success-message")

      projectCollaboratorsDiv.appendChild(successMessage)
    })

    projectCollaboratorsDiv.appendChild(collaboratorP)
    projectCollaboratorsDiv.appendChild(collaboratorButton)
  })

  const openProjectButton = document.getElementById("openProject")
  openProjectButton.classList.remove("disable-btn")
  openProjectButton.addEventListener("click", () => {
    window.location.href = `/interfaces/manage-project/index.html?projectID=${projectID}`
  })
}

fetchProjects()