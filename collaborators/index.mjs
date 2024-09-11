import Project from "../api/project.mjs"

let groupTitle = document.querySelector(".project-title")
let groupMembersElement = document.querySelector(".group-members")
const inviteSectionContainer = document.getElementById("invite-section-container")
let submitButton = document.getElementById("submit")
// let   removeButton = document.getElementById("remove-btn")
let userEmail = document.getElementById("invitee-email")

const inviteForm = document.getElementById("invite-form")
let errorHTML = document.getElementById("errorHTML")

let isOwnerOrLeader = false

const URLParams = new URLSearchParams(window.location.search)
let projectID = URLParams.get("projectID")
let project = new Project(projectID)




const TPEN_USER = window.TPEN_USER
let token = TPEN_USER?.authorization ?? "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vc3RvcmUucmVydW0uaW8vYWdlbnQiOiJodHRwczovL3N0b3JlLnJlcnVtLmlvL3YxL2lkLzY1Zjg2MTVlYzQzYmQ2NjU2OGM2NjZmYSIsImh0dHA6Ly9yZXJ1bS5pby9hcHBfZmxhZyI6WyJ0cGVuIiwiZGxhIl0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vYXBwX2ZsYWciOlsidHBlbiIsImRsYSJdLCJodHRwOi8vcmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9hZG1pbiIsInRwZW5fdXNlcl9pbmFjdGl2ZSJdfSwiaHR0cDovL2R1bmJhci5yZXJ1bS5pby91c2VyX3JvbGVzIjp7InJvbGVzIjpbImR1bmJhcl91c2VyX3B1YmxpYyIsImdsb3NzaW5nX3VzZXJfcHVibGljIiwibHJkYV91c2VyX3B1YmxpYyIsInJlcnVtX3VzZXJfcHVibGljIiwidHBlbl91c2VyX2FkbWluIiwidHBlbl91c2VyX2luYWN0aXZlIl19LCJpc3MiOiJodHRwczovL2N1YmFwLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NWY4NjE1ZDZjNmJlYjIzMTVjZWY4MjIiLCJhdWQiOlsiaHR0cHM6Ly9jdWJhcC5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vY3ViYXAuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcyNTkxMzgwNiwiZXhwIjoxNzI1OTIxMDA2LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIHVwZGF0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgb2ZmbGluZV9hY2Nlc3MiLCJhenAiOiJiQnVnRk1XSFVvMU9oblNaTXBZVVh4aTNZMVVKSTdLbCJ9.u9MUgmCcZZUSN1TOF-Y6ECFr43CvYgE104YHdjLOjH1Jh2PcC07sOA3NhGDCdiP_BTC3WWF28dGdMmAjTZW7TCmylPrFN_KI1WQUqKi_0I1mkfq1iYbx5dKWvW6kOFnD4XC8-dWJci_cVN_86RhHOBjDVghbsRMF6plNbBPJKaTERx4ROU1DWGs0TnZpPTK9qBIuG_kMB-_FxLRyj8CRNF7pEQaqUuHj1lpFefPDWBSMr3wMJ6mogeG8HCjp-ole9uXEa55cg0LuKNzjeGONZZdmKnDkfL2Z9to0Jpcbhf2w2FDXOdI_q5MZVW-Te0ryhG3zcUNzkUWpUiz4YmjGAQ"

userEmail.addEventListener("input", () => {
    errorHTML.innerHTML = ""
})




document.addEventListener("DOMContentLoaded", async () => {
    try {
        const projectData = await project.loadData()
        renderProjectContributors(projectData)
    } catch (error) {
        return errorHTML.innerHTML = error.status == 401 ? "Unauthorized request. Please log in to view this resource" : `Error ${error.status ?? ""}: ${error.statusText ?? error.toString()}`
    }

    inviteSectionContainer.style.display = isOwnerOrLeader ? "block" : "none"

    removeMember()

})



inviteForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    try {
        submitButton.textContent = "Inviting..."
        submitButton.disabled = true

        const data = await project.addMember(userEmail.value)

        submitButton.textContent = "Submit"
        submitButton.disabled = false
        renderProjectContributors(data)
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
        errorHTML.innerHTML = error.message
        submitButton.textContent = "Submit"
        submitButton.disabled = false
    }

})



function renderRoles(roles) {
    if (roles.includes("OWNER")) {
        return "owner"
    } else if (roles.includes("LEADER")) {
        return "leader"
    } else {
        return roles.join(", ").toLowerCase()
    }
}


function renderProjectContributors(project) {
    const userId = window.TPEN_USER?._id || "65f8615ec43bd66568c666fa"
    groupMembersElement.innerHTML = ""

    if (project) {
        const contributors = project.contributors
        groupTitle.innerHTML = project.name

        for (const contributorId in contributors) {

            const memberData = contributors[contributorId]
            if (contributors[userId] && (contributors[userId].roles.includes("OWNER") || contributors[userId].roles.includes("LEADER"))) {
                isOwnerOrLeader = true
            };


            const memberHTML = `
                <li class="member" data-member-id=${contributorId}> 
                  ${memberData.displayName ? `<span class="role">${renderRoles(memberData.roles)}</span>` : `<span class="pending">Pending</span>`}
                  ${memberData.displayName || memberData.email}

                  ${isOwnerOrLeader ? `<button class="remove-button" id="remove-btn" data-member-id=${contributorId} data-member-name=${memberData.displayName || memberData.email} >Remove</button>` : ''}
                </li>
              `

            const memberElement = document.createElement("div")
            memberElement.innerHTML = memberHTML

            groupMembersElement.appendChild(memberElement)

        }

    }

}


async function removeMember() {
    const removeButtons = document.querySelectorAll('.remove-button')

    removeButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const memberID = button.getAttribute("data-member-id")
            const memberName = button.getAttribute("data-member-name")

            const confirmed = confirm(`This action will remove ${memberName} from your project. Click 'OK' to continue?`)
            if (!confirmed) {
                return
            }
            try {
                const data = await project.removeMember(memberID)
                console.log('Member removed successfully:', data)
                const memberElements = document.querySelectorAll('.member')
                memberElements.forEach((element) => {
                    const elementMemberId = element.getAttribute('data-member-id')
                    if (elementMemberId === memberID) {
                        element.remove()
                        // renderProjectContributors(data) 
                        return
                    }
                })


            } catch (error) {
                errorHTML.innerHTML = error.toString()
            }
        })
    })
}

