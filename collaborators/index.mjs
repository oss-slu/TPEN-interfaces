let groupTitle = document.querySelector(".project-title")
let groupMembersElement = document.querySelector(".group-members")
const inviteSectionContainer = document.getElementById("invite-section-container");
let submitButton = document.getElementById("submit")
// let   removeButton = document.getElementById("remove-btn")
let userEmail = document.getElementById("invitee-email")
let error = document.getElementById("error")

let isOwnerOrLeader = false;
let projectID;
let testToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vc3RvcmUucmVydW0uaW8vYWdlbnQiOiJodHRwczovL3N0b3JlLnJlcnVtLmlvL3YxL2lkLzY1Zjg2MTVlYzQzYmQ2NjU2OGM2NjZmYSIsImh0dHA6Ly9yZXJ1bS5pby9hcHBfZmxhZyI6WyJ0cGVuIiwiZGxhIl0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vYXBwX2ZsYWciOlsidHBlbiIsImRsYSJdLCJodHRwOi8vcmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9hZG1pbiIsInRwZW5fdXNlcl9pbmFjdGl2ZSJdfSwiaHR0cDovL2R1bmJhci5yZXJ1bS5pby91c2VyX3JvbGVzIjp7InJvbGVzIjpbImR1bmJhcl91c2VyX3B1YmxpYyIsImdsb3NzaW5nX3VzZXJfcHVibGljIiwibHJkYV91c2VyX3B1YmxpYyIsInJlcnVtX3VzZXJfcHVibGljIiwidHBlbl91c2VyX2FkbWluIiwidHBlbl91c2VyX2luYWN0aXZlIl19LCJpc3MiOiJodHRwczovL2N1YmFwLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NWY4NjE1ZDZjNmJlYjIzMTVjZWY4MjIiLCJhdWQiOlsiaHR0cHM6Ly9jdWJhcC5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vY3ViYXAuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcyNTQ1ODg1NywiZXhwIjoxNzI1NDY2MDU3LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIHVwZGF0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgb2ZmbGluZV9hY2Nlc3MiLCJhenAiOiJiQnVnRk1XSFVvMU9oblNaTXBZVVh4aTNZMVVKSTdLbCJ9.D06LUWxeS2HKibY3sLxe18f7n3b56PifEGaoGriPDqkvsIG077Sa9qn-6WZCguw3TFSGKN0GG6YM9Gd8hGdXkPB3gEpYSlAzwZwHZzvs3bV1dPBE6zSkL1Z_lTyVXyhjh13oCJx73Y66DjjZkuLGvVG7_IEC7OF9njYAF5MgqgvyQZlSTKpOnxgu76S7SNjrecnMscMLNASe6fDSeH7NUXP3HEhYuy1dbBV_pVaxFZLIjx5-KHNCHs4LvuybSmm0GWt6HyRTpi69AsA_rSGDcW9rzLZSCGRWr1fN4WOWKbM-Lwpdt_0ir_djQmbkrnk9sO4FQ7P5ZmQD_vAoPTPGWQ"

userEmail.addEventListener("input", () => {
    error.innerHTML = "";
});

submitButton.addEventListener("click", () => {
    inviteCollaborator()
})

document.addEventListener("DOMContentLoaded", async () => {
    const URLParams = new URLSearchParams(window.location.search)
    projectID = URLParams.get("projectID")
    const project = await getProjects(projectID)

    renderProjectContributors(project)


    inviteSectionContainer.style.display = isOwnerOrLeader ? "block" : "none";


    removeMember();

})





async function getProjects(projectID) {
    let url = `http://localhost:3009/project/${projectID}`;

    return fetch(url, {
        headers: {
            Authorization: `Bearer ${testToken}`
        }
    })
        .then((resp) => {
            if (resp.status == 401) {
                return error.innerHTML = "Unauthorized request. Please log in to view this resource"
            }
            return resp.json()
        })
        .then((data) => {
            return data
        })
        .catch((err) => {
            console.log(err)
        });
}

function renderRoles(roles) {
    if (roles.includes("OWNER")) {
        return "owner";
    } else if (roles.includes("LEADER")) {
        return "leader";
    } else {
        return roles.join(", ").toLowerCase();
    }
}

async function inviteCollaborator() {
    if (!userEmail.value) {
        return (error.innerHTML = "Invitee's email is required");
    }

    submitButton.textContent = "Inviting...";
    submitButton.disabled = true;

    let url = `http://localhost:3009/project/${projectID}/invite-member`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${testToken}`,
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({ email: userEmail.value }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to invite collaborator: ${response.statusText}`);
        }

        const data = await response.json();

        submitButton.textContent = "Submit";
        submitButton.disabled = false;
        renderProjectContributors(data);
        userEmail.value = "";

        // Display a success message
        const successMessage = document.createElement("p");
        successMessage.textContent = "Invitation sent successfully!";
        successMessage.classList.add("success-message");
        document.getElementById("invite-section-container").appendChild(successMessage);

        // Remove the success message after a 3 seconds delay
        setTimeout(() => {
            successMessage.remove();
        }, 3000);

    } catch (err) {
        error.innerHTML = err.message;
        submitButton.textContent = "Submit";
        submitButton.disabled = false;
    }
}




function renderProjectContributors(project) {
    const userId = window.TPEN_USER?._id || "65f8615ec43bd66568c666fa"
    groupMembersElement.innerHTML = ""

    if (project) {
        const contributors = project.contributors
        groupTitle.innerHTML = project.name

        for (const contributorId in contributors) {

            const memberData = contributors[contributorId];
            if (contributors[userId] && (contributors[userId].roles.includes("OWNER") || contributors[userId].roles.includes("LEADER"))) {
                isOwnerOrLeader = true
            };


            const memberHTML = `
                <li class="member" data-member-id=${contributorId}> 
                  ${memberData.displayName ? `<span class="role">${renderRoles(memberData.roles)}</span>` : `<span class="pending">Pending</span>`}
                  ${memberData.displayName || memberData.email}

                  ${isOwnerOrLeader ? `<button class="remove-button" id="remove-btn" data-member-id=${contributorId} data-member-name=${memberData.displayName || memberData.email} >Remove</button>` : ''}
                </li>
              `;

            const memberElement = document.createElement("div");
            memberElement.innerHTML = memberHTML;

            groupMembersElement.appendChild(memberElement);

        }

    }

}


async function removeMember() {
    const removeButtons = document.querySelectorAll('.remove-button');

    removeButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const memberID = button.getAttribute("data-member-id");
            const memberName = button.getAttribute("data-member-name");

            const confirmed = confirm(`This action will remove ${memberName} from your project. Click 'OK' to continue?`);
            if (!confirmed) {
                return;
            }

            const url = `http://localhost:3009/project/${projectID}/remove-member`;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${testToken}`
                    },
                    body: JSON.stringify({ userId: memberID })
                });

                if (!response.ok) {
                    throw new Error(`Error removing member: ${response.status}`);
                }

                const data = await response.json();
                console.log('Member removed successfully:', data);


                const memberElements = document.querySelectorAll('.member');
                memberElements.forEach((element) => {
                    const elementMemberId = element.getAttribute('data-member-id');
                    if (elementMemberId === memberID) {
                        element.remove();
                        // renderProjectContributors(data)
                        return;
                    }
                });


            } catch (error) {
                console.error('Error removing member:', error);
            }
        });
    });
}