import { Roles } from './groups/roles.mjs';

export function updateUIBasedOnRoles(roles) {
    const managementOptions = document.getElementById('managementOptions');
    const viewOptions = document.getElementById('viewOptions');

    if (!roles || roles.length === 0) {
        managementOptions.style.display = 'none';
        viewOptions.style.display = 'none';
        return;
    }

    if (roles.includes(Roles.CONTRIBUTOR)) {
        managementOptions.style.display = 'none';
        viewOptions.style.display = 'block';
    }

    if (roles.includes(Roles.OWNER) || roles.includes(Roles.LEADER)) {
        managementOptions.style.display = 'block';
    } else {
        managementOptions.style.display = 'none';
    }

    viewOptions.style.display = 'block'; // Default visible for all roles
}