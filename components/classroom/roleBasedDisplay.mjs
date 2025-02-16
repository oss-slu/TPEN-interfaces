import { Roles } from './groups/roles.mjs';

const userRoles = localStorage.getItem('userRole');
console.log(userRoles);

export function updateUIBasedOnRoles(roles) {
    const managementOptions = document.getElementById('managementOptions');
    const viewOptions = document.getElementById('viewOptions');

    if (!roles || roles.length === 0) {
        managementOptions.style.display = 'none';
        viewOptions.style.display = 'none';
        return;
    }

    // Hide management options for Contributors
    if (roles.includes(Roles.CONTRIBUTOR)) {
        managementOptions.style.display = 'none'; // Ensure Contributors can't see management options
        viewOptions.style.display = 'block'; // Allow Contributors to see their options
        return;
    }

    // Show management options for OWNER and LEADER
    if (roles.includes(Roles.OWNER) || roles.includes(Roles.LEADER)) {
        managementOptions.style.display = 'block';
    } else {
        managementOptions.style.display = 'none';
    }

    viewOptions.style.display = 'block'; // Default visible for all roles
}

updateUIBasedOnRoles(userRoles);