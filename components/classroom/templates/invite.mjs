import TPEN from "../../../api/TPEN.mjs";
//import { renderProjectCollaborators } from "../../collaborators/index.mjs";

document.addEventListener("DOMContentLoaded", async () => { //copied sarah's code just to test the functionality, maybe put this method in fetchData?
    const projectId = new URLSearchParams(window.location.search).get("projectID");
  
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
  
      if (!projectData || !projectData._id) {
        throw new Error("Invalid or missing project data");
      }
  
      console.log("Project Data:", projectData);

      document.getElementById("title").innerText = projectData.title+" Project Roster";
      
      //renderProjectCollaborators() //how can we get this to work with the existing function?
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
}

const inviteForm = document.getElementById("invite-form")
const submitButton = document.getElementById("submit")
const userEmail = document.getElementById("invitee-email")
inviteForm.addEventListener("submit", async (event) => {
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