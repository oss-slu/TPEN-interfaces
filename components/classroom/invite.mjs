import TPEN from "../../api/TPEN.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    const projectId = new URLSearchParams(window.location.search).get("projectID");
    const roster = document.getElementById("roster")

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
  
      if (!projectData || !projectData._id) {
        throw new Error("Invalid or missing project data");
      }
  
      console.log("Project Data:", projectData);

      document.getElementById("title").innerText = projectData.title+" Project Roster";

      roster.innerHTML = "";

      Object.keys(collaborators).forEach(id => {
      const user = collaborators[id];
      const name = user.profile?.displayName || "(Unnamed)";
      const roles = user.roles?.join(", ") || "No roles";

      const li = document.createElement("li");
      const button = document.createElement("button")
      button.textContent = `${name} — ${roles}`;
      button.classList.add("rosterbutton");
      li.appendChild(button);

      const options = document.createElement("div");
      const managebutton = document.createElement("button");
      managebutton.textContent = "Manage Roles";
      managebutton.classList.add("optionbuttons");
      managebutton.dataset.userid = id;
      console.log(managebutton.dataset.user);
      const rolemodal = document.getElementById("rolemodal")
      managebutton.onclick = function() {
          rolemodal.style.display = "block";
          const user = collaborators[managebutton.dataset.userid]
          document.getElementById("roletitle").innerText = "Manage Roles For "+user.profile?.displayName;
          //future issue: update which boxes are checked based on the roles the user currently has!

          const checklist = document.getElementById("rolechecklist")
          const submitrolebutton = document.getElementById("submitroles")
          submitrolebutton.onclick = function() {
            console.log("submit button clicked");
            submitroles(checklist, managebutton.dataset.userid);
          }
      }
      options.appendChild(managebutton);

      const removebutton = document.createElement("button");
      removebutton.textContent = "Remove User";
      removebutton.style.backgroundColor = "red";
      removebutton.classList.add("optionbuttons");
      removebutton.dataset.user = user;
      options.appendChild(removebutton);
      options.classList.add("rosterbuttonoptions");
      li.appendChild(options);

      li.classList.add("rosterlistitem");
      roster.appendChild(li);
      });
      const rosteritems = document.getElementsByClassName("rosterbutton");
      var i;

      for (i = 0; i < rosteritems.length; i++) {
        rosteritems[i].addEventListener("click", function() {
          this.classList.toggle("active");
          var content = this.nextElementSibling;
          console.log(content);
          if (content.style.display === "block") {
            content.style.display = "none";
          } else {
            content.style.display = "block";
          }
        });
      }
    }catch (err) {
        console.error("Something went wrong:", err);
        document.body.innerHTML = "<p style='color:red;'>Something went wrong. Try again.</p>";
    }
});

const modal = document.getElementById("invitemodal")
const modalButton = document.getElementById("invite-button")

modalButton.onclick = function() {
    modal.style.display = "block";
}

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
    else if (event.target == rolemodal) {
      rolemodal.style.display = "none";
    }
}

async function submitroles(checklist,userID){
  console.log("submit roles function called")
  const selectedRoles = Array.from(
  checklist.querySelectorAll("input[type=checkbox]:checked")
  ).map((checkbox) => checkbox.value)
  console.log(selectedRoles)
  if (selectedRoles.length > 0) {
    const response = await TPEN.activeProject.cherryPickRoles(userID, selectedRoles)
    if (response) {
        alert("Roles updated successfully.")
    }
  }
}

const inviteForm = document.getElementById("invite-form")
const submitButton = document.getElementById("submitinvite")
const userEmail = document.getElementById("invitee-email")
inviteForm.addEventListener("submitinvite", async (event) => {
    event.preventDefault()
    submitButton.textContent = "test"
    try {
        submitButton.textContent = "Inviting..."
        submitButton.disabled = true
    
        const response = await TPEN.activeProject.addMember(userEmail.value)
        if (!response) throw new Error("Invitation failed")
        submitButton.textContent = "Submit"
        submitButton.disabled = false
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
        console.log(error)
        /*setTimeout(() => {
            errorHTML.remove()
            }, 3000)
        errorHTML.innerHTML = error.message
        submitButton.textContent = "Submit"
        submitButton.disabled = false*/
    }
})
