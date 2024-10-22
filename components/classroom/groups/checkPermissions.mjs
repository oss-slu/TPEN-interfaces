import Roles from "./roles.mjs"
import {Permissions} from "./permissions.mjs"

function hasPermission(role, action, scope, entity){ //function checks if role definition meets permissions
    if (!Permissions[Roles[role]]) return false; //if role does not exist, return false

    let rolePermissions = Permissions[Roles[role]];
    
    if(rolePermissions.includes(`${action}_${scope}_${entity}`)){ //if role has a permission with all 3 inputs
        return true;
    }
    if(rolePermissions.includes('*_*_*')){ //if role has a permission that applies to all inputs
        return true;
    }
    if(rolePermissions.includes(`*_${scope}_${entity}`)){ //if role has a permission with specified scope and entity, and any action
        return true;
    }
    if(rolePermissions.includes(`${action}_*_${entity}`)){//if role has a permission with specified action and entity, and any scope
        return true;
    }

    return false; //if none of the if conditions satisfy
}

module.exports = hasPermission;