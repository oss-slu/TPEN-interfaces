import { Page } from '@nakedjsx/core/page'
import TPEN from "../../api/TPEN.mjs"
//import { eventDispatcher } from "../../api/events.mjs" //idk if we need this

const BodyContent =
    () =>
    <>
        <div class="header">
            <h1>TPEN Classroom Interface</h1>
            {/*<div class="hamburger-menu" onclick="toggleMenu()">&#9776</div>*/}
            <div class="navbar" id="navbar">
                <ul>
                    <li><a href="./index.html" aria-label="home">Home</a></li>
                </ul>
            </div>
        </div>
        <div css="text-align:center">
            <h1>Project Members</h1>
            <div id="invite-section-container">
                <h2>Invite New Members to __project-name__</h2>
                <form id="invite-form">
                    <label for="invitee-email">Invitee's Email: </label>
                    <input type="email" name="invitee-email" id="invitee-email" required/>
                    <button type="submit" id="submit" class="submit-btn">Submit</button>
                    <p id="error" class="error-message"></p>
                </form>
            </div>
            <p>current roster should displayed here along with roles</p>
        </div>
    </>

    //build command: npx nakedjsx classroom --out out --css-common classroom/styles.css --pretty
    //run from components folder


Page.Create('en');
Page.AppendHead(<title>Manage Roster</title>);
Page.AppendJs(
    //implement hamburger menu functionality here later
    function sendInvite(){
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
                //renderProjectCollaborators()
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
                console.log("Error")
                /*setTimeout(() => {
                    errorHTML.remove()
                }, 3000)
                errorHTML.innerHTML = error.message
                submitButton.textContent = "Submit"
                submitButton.disabled = false*/
            }

        })
    });
Page.AppendBody(<BodyContent />);
Page.Render();