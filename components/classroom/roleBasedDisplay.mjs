import { Roles } from './groups/roles.mjs';

// Had to set the userRole in localStorage to CONTRIBUTOR
// because my role was GUEST
localStorage.setItem('userRole', 'CONTRIBUTOR');
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
        managementOptions.style.display = 'none';
        viewOptions.style.display = 'block';
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