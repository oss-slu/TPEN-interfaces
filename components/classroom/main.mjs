import { fetchProjectData } from "./fetchData.mjs";
import { extractUserRoles } from "./fetchUserRoles.mjs";
import { updateUI } from "./updateUI.mjs";
import { setupRoleSelectHandler, addPermissionInput, saveCustomRoleAndPermissions } from "./permissionsHandler.mjs";

// UI elements
const roleSelect = document.getElementById("roleSelect");
const customRoleContainer = document.getElementById("customRoleContainer");
const customRoleNameInput = document.getElementById("customRoleName");
const permissionsList = document.getElementById("permissionsList");
const addPermissionBtn = document.getElementById("addPermissionBtn");
const saveRoleBtn = document.getElementById("saveRoleBtn");

// Setup role select handler
setupRoleSelectHandler(roleSelect, customRoleContainer);

if (addPermissionBtn && permissionsList) {
    addPermissionBtn.addEventListener("click", () => addPermissionInput("", permissionsList));
}

// Event listener for clicking a project
document.getElementById("clickList").addEventListener("click", async function (event) {
    const LI = event.target.closest("#clickList li");
    if (!LI) return;

    const projectID = LI.getAttribute("tpen-project-id");
    console.log(`Project clicked: Fetching details for Project ID: ${projectID}`);

    if (!projectID) {
        console.error("No project ID found!");
        return;
    }

    try {
        const projectData = await fetchProjectData(projectID);
        if (!projectData) return;

        const userRoles = extractUserRoles(projectData);
        updateUI(projectData, userRoles);

        if (saveRoleBtn && roleSelect && customRoleNameInput && permissionsList) {
            saveRoleBtn.addEventListener("click", () => {
                saveCustomRoleAndPermissions(projectID, roleSelect, customRoleNameInput, permissionsList);
            });
        }
    } catch (error) {
        console.error("Error handling project click:", error);
    }
});