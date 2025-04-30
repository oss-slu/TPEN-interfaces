import TPEN from "../../api/TPEN.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    const projectId = new URLSearchParams(window.location.search).get("projectID");
    const roster = document.getElementById("roster");

    if (!projectId) {
        document.body.innerHTML = "<p style='color:red;'>Missing project ID in URL.</p>";
        return;
    }

    try {
        const token = TPEN.getAuthorization();
        const response = await fetch(`${TPEN.servicesURL}/project/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const projectData = await response.json();
        const collaborators = projectData.collaborators || {};
        console.log(projectData);

        // Use innerText or textContent to set the title
        document.getElementById("title").innerText = projectData.label + " Project Roster";
        roster.innerHTML = ""; // Clear loading text

        // Build the roster dynamically
        Object.keys(collaborators).forEach(id => {
            const user = collaborators[id];
            const name = user.profile?.displayName || "(Unnamed)";
            const roles = user.roles?.join(", ") || "No roles";

            const li = document.createElement("li");
            const button = document.createElement("button");
            button.textContent = `${name} — ${roles}`;
            button.classList.add("rosterbutton");
            li.appendChild(button);

            const options = document.createElement("div");
            const manageButton = document.createElement("button");
            manageButton.textContent = "Manage Roles";
            manageButton.classList.add("optionbuttons");
            options.appendChild(manageButton);

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove User";
            removeButton.style.backgroundColor = "red";
            removeButton.classList.add("optionbuttons");
            options.appendChild(removeButton);

            options.classList.add("rosterbuttonoptions");
            li.appendChild(options);

            li.classList.add("rosterlistitem");
            roster.appendChild(li);
        });

        // Handle the toggle for options
        const rosterItems = document.getElementsByClassName("rosterbutton");
        for (let i = 0; i < rosterItems.length; i++) {
            rosterItems[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }
    }catch (err) {
        const li = document.createElement("li");
        li.classList.add("rosterlistitem");

        const flexContainer = document.createElement("div");
        flexContainer.style.display = "flex";
        flexContainer.style.alignItems = "center";
        flexContainer.style.justifyContent = "flex-start";
        flexContainer.style.gap = "20px";
        flexContainer.style.padding = "8px 0";

        // Name + Role Button
        const nameButton = document.createElement("button");
        nameButton.textContent = `${name} — ${roles}`;
        nameButton.classList.add("rosterbutton");

        // Manage Roles Button
        const manageButton = document.createElement("button");
        manageButton.textContent = "Manage Roles";
        manageButton.classList.add("optionbuttons");

        // Role Dropdown (hidden initially)
        const roleDropdown = document.createElement("select");
        roleDropdown.classList.add("role-dropdown");
        roleDropdown.style.display = "none";

        ["OWNER", "LEADER", "CONTRIBUTOR", "CUSTOM"].forEach(role => {
            const option = document.createElement("option");
            option.value = role;
            option.textContent = role;
            roleDropdown.appendChild(option);
        });

        manageButton.onclick = () => {
            roleDropdown.style.display = roleDropdown.style.display === "none" ? "block" : "none";
        };

        // Remove User Button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove User";
        removeButton.classList.add("optionbuttons", "remove");

        // Assemble the flex container
        flexContainer.appendChild(nameButton);
        flexContainer.appendChild(manageButton);
        flexContainer.appendChild(removeButton);
        flexContainer.appendChild(roleDropdown);

        // Append to the list item
        li.appendChild(flexContainer);
        roster.appendChild(li);
    }

    // } catch (err) {
    //     console.error("Something went wrong:", err);
    //     document.body.innerHTML = "<p style='color:red;'>Something went wrong. Try again.</p>";
    // }
});

// Modal Invite Code
const modal = document.getElementById("invitemodal");
const modalButton = document.getElementById("invite-button");

modalButton.onclick = function () {
    modal.style.display = "block";
};

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Fix: Ensure the invite form is selected correctly
const inviteForm = document.getElementById("invite-form");
const submitButton = document.getElementById("submit");
const userEmail = document.getElementById("invitee-email");

inviteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.textContent = "Inviting...";
    submitButton.disabled = true;

    try {
        const response = await TPEN.activeProject.addMember(userEmail.value);
        if (!response) throw new Error("Invitation failed");

        submitButton.textContent = "Submit";
        submitButton.disabled = false;
        userEmail.value = "";

        const successMessage = document.createElement("p");
        successMessage.textContent = "Invitation sent successfully!";
        successMessage.classList.add("success-message");
        document.getElementById("invite-section-container").appendChild(successMessage);

        setTimeout(() => {
            successMessage.remove();
        }, 3000);

    } catch (error) {
        console.error(error);
        submitButton.textContent = "Submit";
        submitButton.disabled = false;

        const errorMessage = document.getElementById("error");
        errorMessage.textContent = "Failed to send invitation. Try again.";
    }
});
