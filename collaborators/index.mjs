import renderRoles from "../utilities/renderRoles.mjs"
import TPEN from "../TPEN/index.mjs"
TPEN.getAuthorization() ?? TPEN.login()
import User from "../User/index.mjs"
window.TPEN_USER = User.fromToken(TPEN.getAuthorization())
import Project from "../Project/index.mjs"

let groupTitle = document.querySelector(".project-title")
let groupMembersElement = document.querySelector(".group-members")
let submitButton = document.getElementById("submit")
let userEmail = document.getElementById("invitee-email")

const inviteForm = document.getElementById("invite-form")
let errorHTML = document.getElementById("errorHTML")

let isOwnerOrLeader = false

const thisTPEN = new TPEN()
await (thisTPEN.activeProject = new Project(thisTPEN.activeProject?._id)).fetch()

renderProjectCollaborators()
inviteForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    try {
        submitButton.textContent = "Inviting..."
        submitButton.disabled = true

        const response = await thisTPEN.activeProject.addMember(userEmail.value)
        if (!response) throw new Error("Invitation failed")
        submitButton.textContent = "Submit"
        submitButton.disabled = false
        renderProjectCollaborators()
        userEmail.value = ""

        // Display a success message
        const successMessage = document.createElement("p")
        successMessage.textContent = "Invitation sent successfully!"
        successMessage.classList.add("success-message")
        document.getElementById("invite-section-container").appendChild(successMessage)

        // Remove the success message after a 3 seconds delay
        setTimeout(() => {
            successMessage.remove()
        }, 3000)
    } catch (error) {
        setTimeout(() => {
            errorHTML.remove()
        }, 3000)
        errorHTML.innerHTML = error.message
        submitButton.textContent = "Submit"
        submitButton.disabled = false
    }

})

async function renderProjectCollaborators() {
    if (!thisTPEN.activeProject) {
        return errorHTML.innerHTML = "No project"
    }

    const userId = TPEN_USER?._id
    groupMembersElement.innerHTML = ""

    const collaborators = thisTPEN.activeProject.collaborators
    groupTitle.innerHTML = thisTPEN.activeProject.getLabel()

    // datafix to remove
    if (collaborators[userId]?.roles.roles) collaborators[userId].roles = collaborators[userId]?.roles.roles
    if (collaborators[userId]?.roles.includes("OWNER") || collaborators[userId]?.roles.includes("LEADER")) {
        isOwnerOrLeader = true
    }
    for (const collaboratorId in collaborators) {
        // datafix to remove
        if (collaborators[collaboratorId]?.roles.roles) collaborators[collaboratorId].roles = collaborators[collaboratorId]?.roles.roles

        const memberData = collaborators[collaboratorId]

        const memberHTML = `
                <li class="member" data-member-id=${collaboratorId}> 
                  <span class="role">${renderRoles(memberData.roles)}</span>
                  ${memberData.profile?.displayName ?? collaboratorId}
 
                 <button class="remove-button allow-invite is-hidden" id="remove-btn" data-member-id=${collaboratorId} data-member-name=${memberData.profile?.displayName ?? collaboratorId} >Remove</button>
 
                </li>
              `

        const memberElement = document.createElement("div")
        memberElement.innerHTML = memberHTML

        groupMembersElement.appendChild(memberElement)

    }

    setPermissionBasedVisibility()

}

async function removeMember(memberID, memberName) {
    const confirmed = confirm(`This action will remove ${memberName} from your project. Click 'OK' to continue?`)
    if (!confirmed) {
        return
    }
    try {
        const data = await thisTPEN.activeProject.removeMember(memberID)
        if (!data) return
        const element = document.querySelector(`[data-member-id="${memberID}"]`)
        element.remove()
        alert('Member removed successfully')
    } catch (error) {
        errorHTML.innerHTML = error.toString()
    }
}

groupMembersElement.addEventListener("click", async (e) => {
    const button = e.target
    const memberID = button.dataset.memberId
    const memberName = button.dataset.memberName

    if (button.classList.contains('remove-button')) {
        removeMember(memberID, memberName)
    }
})

function setPermissionBasedVisibility() {
    const inviteElements = document.querySelectorAll('.allow-invite')

    inviteElements.forEach(element => {
        if (isOwnerOrLeader) {
            element.classList.remove('is-hidden')
        } else {
            element.classList.add('is-hidden')
        }
    })
}
