import Roles from "./roles.mjs"
const Permissions = {
    [Roles.OWNER]: ['*_*_*'],
    [Roles.LEADER]: [
        /* ACTION_SCOPE_ENTITY */
        'UPDATE_*_PROJECT',
        '*_*_MEMBER',
        '*_*_ROLE',
        '*_*_PERMISSION',
        '*_*_LAYER',
        '*_*_PAGE'
    ],
    [Roles.CONTRIBUTOR]: [
        /* ACTION_SCOPE_ENTITY */
        'READ_*_MEMBER',
        'UPDATE_TEXT_*',
        'UPDATE_ORDER_*',
        'UPDATE_SELECTOR_*',
        'CREATE_SELECTOR_*',
        'DELETE_*_LINE',
        'UPDATE_DESCRIPTION_LAYER',
        'CREATE_*_LAYER'
    ]
};

// Generate possible patterns to match
function generatePatterns(action, scope, entity) {
    return [
        `${action}_${scope}_${entity}`,
        `${action}_${scope}_*`,
        `${action}_*_${entity}`,
        `*_${scope}_${entity}`,
        `*_*_${entity}`,
        `*_${scope}_*`,
        `${action}_*_*`,
        '*_*_*'
    ];
};

/* validate whether a specific role can perform 
an action on a particular entity and scope. */
function checkPermissions(role, action, scope, entity) {
    if (!Permissions[role]) return false; // If role doesn't exist

    // Get the permissions for the specified role
    const rolePerms = Permissions[role];
    const patterns = generatePatterns(action, scope, entity);

    // Check if any pattern matches the role's permissions
    return patterns.some(pattern => rolePerms.includes(pattern));
};

module.exports = checkPermissions;