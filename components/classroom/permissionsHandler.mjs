// Import required enums and the TPEN API module
import { Action, Scope, Entity } from './groups/permissions_parameters.mjs';  // Action, Scope, and Entity are enums
import TPEN from '../../api/TPEN.mjs';  // TPEN API for project-related requests

/**
 * This function adds an input field for a permission to the list of permissions.
 * @param {string} value - The default value to populate in the input field (optional).
 * @param {HTMLElement} permissionsList - The container where the new permission input should be appended.
 */
export function addPermissionInput(value = "", permissionsList) {
    // Create a new list item (li) and input element for permission input
    const li = document.createElement("li");
    const input = document.createElement("input");

    // Configure input field
    input.type = "text";
    input.value = value;
    input.placeholder = "e.g., UPDATE_TEXT_PROJECT";
    input.pattern = `(${Object.values(Action).join('|')}|\\*)_(${Object.values(Scope).join('|')}|\\*)_(${Object.values(Entity).join('|')}|\\*)`;  // Regex for valid permission format
    input.title = "Format: ACTION_SCOPE_ENTITY (e.g., READ_TEXT_PAGE)";
    input.required = true;

    // Create a button to remove the permission input
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => li.remove();  // Remove the permission input when clicked

    // Append input and remove button to the list item, then append to the permissions list
    li.appendChild(input);
    li.appendChild(removeBtn);
    permissionsList.appendChild(li);
}

/**
 * This function sets up a handler for the role selection dropdown.
 * If "CUSTOM" is selected, it shows the custom role name input and permissions section.
 * @param {HTMLElement} roleSelect - The role select dropdown element.
 * @param {HTMLElement} customRoleContainer - The container for custom role settings.
 */
export function setupRoleSelectHandler(roleSelect, customRoleContainer) {
    roleSelect.addEventListener("change", () => {
        if (roleSelect.value === "CUSTOM") {
            // Show custom role input and permissions section if custom role is selected
            customRoleContainer.style.display = "block";
            permissionsSection.style.display = "block";  // Ensure permissions section is visible
        } else {
            // Hide custom role input and permissions section if a predefined role is selected
            customRoleContainer.style.display = "none";
            permissionsSection.style.display = "none";  // Hide permissions section
            document.getElementById("customRoleName").value = "";  // Clear custom role input
        }
    });
}

/**
 * This function saves the custom role and permissions to the project.
 * It validates inputs, formats, and sends a request to save the changes.
 * @param {string} projectId - The ID of the project to which the role and permissions will be added.
 * @param {HTMLElement} roleSelect - The role select dropdown element.
 * @param {HTMLElement} customRoleNameInput - The input field for custom role name.
 * @param {HTMLElement} permissionsList - The list of permissions for the custom role.
 */
export async function saveCustomRoleAndPermissions(projectId, roleSelect, customRoleNameInput, permissionsList) {
    // Check if project ID is provided
    if (!projectId) {
        console.error("Project ID is missing!");
        alert("No project selected. Please select a project.");
        return;
    }

    // Determine the role name (either custom or predefined)
    const roleName = roleSelect.value === "CUSTOM" ? customRoleNameInput.value.trim() : roleSelect.value;
    if (!roleName) {
        alert("Please enter a custom role name.");
        return;
    }

    // Collect and validate the permissions list
    const permissions = [...permissionsList.querySelectorAll("input")]
        .map(input => input.value.trim())
        .filter(val => val);

    // Regex pattern for valid permission format
    const validPattern = new RegExp(`^(${Object.values(Action).join('|')}|\\*)_(${Object.values(Scope).join('|')}|\\*)_(${Object.values(Entity).join('|')}|\\*)$`);
    if (!permissions.every(perm => validPattern.test(perm))) {
        alert("Invalid permission format. Use ACTION_SCOPE_ENTITY (e.g., READ_TEXT_PROJECT).");
        return;
    }

    try {
        // Fetch project data to retrieve current roles
        const token = TPEN.getAuthorization();  // Get authorization token from TPEN API
        const response = await fetch(`${TPEN.servicesURL}/project/${projectId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // Parse the project data
        const projectData = await response.json();
        if (!projectData || !projectData.roles) {
            console.error("Failed to fetch project roles.");
            alert("Could not retrieve project data.");
            return;
        }

        // Add the new role and its permissions to the project data
        projectData.roles[roleName] = permissions;

        // Send the updated project roles back to the server
        const updateResponse = await fetch(`${TPEN.servicesURL}/project/${projectId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ roles: projectData.roles })
        });

        // Handle server response
        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            throw new Error(`Failed to update project roles: ${errorText}`);
        }

        // Successfully saved the custom role and permissions
        alert("Custom role saved successfully!");
        console.log("Updated Project Roles:", projectData.roles);
    } catch (error) {
        console.error("Error saving custom role:", error);
        alert("Failed to save role.");
    }
}