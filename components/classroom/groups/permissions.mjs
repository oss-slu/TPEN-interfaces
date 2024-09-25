const perms = {
    OWNER: {
        '*': {
            '*': ['*']
        }
    },
    LEADER: {
        /* ACTION_SCOPE_ENTITY */
        UPDATE: {
            '*': ['PROJECT']
        },
        '*': {
            '*': ['MEMBER', 'ROLE', 'PERMISSION', 'LAYER', 'PAGE']
        }
    },
    CONTRIBUTOR: {
        /* ACTION_SCOPE_ENTITY */
        UPDATE: {
            'TEXT': ['*'],
            'ORDER': ['*'],
            'SELECTOR': ['*'],
            'DESCRIPTION': ['LAYER']
        },
        CREATE: {
            'SELECTOR': ['*']
        },
        READ: {
            '*': ['MEMBER']
        },
        DELETE: {
            '*': ['LINE']
        },
        CREATE: {
            '*': ['LAYER']
        }
    }
}

/* validate whether a specific role can perform 
an action on a particular entity and scope. */
export default function checkPermissions(role, action, scope, entity) {
    if (!perms[role]) return false; // Role doesn't exist

    // Check for role-specific permissions
    const rolePerms = perms[role];

    // Check if the action is allowed for that role
    const actionPerms = rolePerms[action] || rolePerms['*'];
    if (!actionPerms) return false; // No permission for this action

    // Check if the scope is allowed for that action
    const scopePerms = actionPerms[scope] || actionPerms['*'];
    if (!scopePerms) return false; // No permission for this scope

    // Check if the entity is allowed in that scope
    if (scopePerms.includes(entity) || scopePerms.includes('*')) {
        return true;
    } else {
        return false;
    }
}