// main.js

import { getProjectIDFromURL } from './groups/utils/project.js';
import { Roles } from "./groups/roles.mjs";
import { Permissions } from "./groups/permissions.mjs";
import { Action, Scope, Entity } from './groups/permissions_parameters.mjs';
import TPEN from '../../TPEN/index.mjs';

const ROLE_HIERARCHY = [Roles.OWNER, Roles.LEADER, Roles.CONTRIBUTOR];
const PROJECT_FORM = document.getElementById('projectForm');

PROJECT_FORM.TPEN = new TPEN();
TPEN.attachAuthentication(PROJECT_FORM);

// Function to fetch project data from the TPEN API
async function fetchProjectData(projectId) {
    const token = TPEN.getAuthorization();
    const apiUrl = `${PROJECT_FORM.TPEN.servicesURL}/project/${PROJECT_FORM.TPEN.activeProject._id}`;
    
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const projectData = await response.json();
        displayProjectData(projectData);
    } catch (error) {
        console.error('Error fetching project data:', error);
        document.getElementById('error-msg').textContent = 'Error';
        document.getElementById('error-msg').style.display = 'block';
    }
}

// Function to display project data in the HTML
function displayProjectData(data) {
    document.getElementById('project-info').textContent = `Project ID: ${data._id}`;
    document.getElementById('project-name').textContent = `Project Name: ${data.name}`;
    document.getElementById('project-creator').textContent = `Project Creator: ${data.creator}`;
}

// On page load, fetch the project data
window.onload = () => {
    const projectId = getProjectIDFromURL();
    if (projectId) {
        fetchProjectData(projectId);
    } else {
        console.log('Project ID not found in URL');
    }
};

PROJECT_FORM.addEventListener('submit', async function (event) {
    event.preventDefault();
    const projectID = document.getElementById('project-id').value;
    location.href = '?projectID=' + projectID;  // Redirect to the same page with the projectID in the query string
});

clickList.addEventListener('click', function (event) {
    const LI = event.target.closest('LI');
    if (LI) {
        location.href = '?projectID=' + event.target.getAttribute('tpen-project-id');
    }
});

// identifies the highest privilege role from a list of user roles and returns the top-ranked valid role
function getHighestPrivilegeRole(userRoles) {
    const validRoles = [];

    // Loop through each role in userRoles
    for (let i = 0; i < userRoles.length; i++) {
        const role = userRoles[i];

        // Check if the role is in ROLE_HIERARCHY
        if (ROLE_HIERARCHY.includes(role)) {
            validRoles.push(role); // Add to validRoles if it's a recognized role
        } else {
            console.warn(`403 Forbidden: Invalid role "${role}" detected. Access denied.`);
            // Display the error message if the role is invalid
            const errorMsgElement = document.getElementById('error-msg');
            errorMsgElement.textContent = `403 Forbidden: Invalid role "${role}" detected. Access denied.`;
            errorMsgElement.style.display = 'block';
            return null; // Exit the function early if an invalid role is found
        }
    }

    // Find the highest privilege role in validRoles based on ROLE_HIERARCHY
    for (let i = 0; i < ROLE_HIERARCHY.length; i++) {
        if (validRoles.includes(ROLE_HIERARCHY[i])) {
            return ROLE_HIERARCHY[i]; // Return the first (highest privilege) valid role found
        }
    }

    // Return null if no valid roles are found
    return null;
}


// checks if a user, based on their multiple roles, has permission to perform a specified action
function userHasMultipleRoles(userRoles, action, scope, entity) {
    const errorMsgElement = document.getElementById('error-msg');
    
    // Loop through all roles to check if any role has permission
    for (let i = 0; i < userRoles.length; i++) {
        try {
            if (Permissions(userRoles[i], action, scope, entity)) {
                return true; // Allow access if any role has permission
            }
        } catch (error) {
            // If an error is thrown (invalid role or no permission), log it and display it
            console.warn(error.message);
            errorMsgElement.textContent = error.message;
            errorMsgElement.style.display = 'block';
        }
    }

    // If none of the roles allowed access, display a 403 error message
    errorMsgElement.textContent = "403 Forbidden: None of the user's roles permit this action.";
    errorMsgElement.style.display = 'block';
    return false; // Indicate that access was not granted
}