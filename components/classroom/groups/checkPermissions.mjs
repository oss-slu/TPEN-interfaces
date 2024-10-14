import Permissions from "./permissions.mjs"

function hasPermission(role, action, scope, entity){ //function checks if role definition meets permissions
    if (!Permissions[role]) return false; //if role does not exist, return false

    let rolePermissions = Permissions[role];

    let permsArray = [];

    for(let i=0; i<rolePermissions.length; i++){ //building a two-dimensional array (i is number of permissions, j is action-scope-entity)
        const arr = rolePermissions[numPerms].split("_");
        for(let j=0; j<arr.length; j++){
            permsArray[i][j] = arr[j];
        }
    }
    
    for(let i=0; i<rolePermissions.length;i++){//now traversing that array
        if(permsArray[i][0]==action||permsArray[i][0]=="*"){
            if(permsArray[i][1]==scope||permsArray[i][1]=="*"){
                if(permsArray[i][2]==entity||permsArray[i][2]=="*"){
                    return true;
                }
            }
        }

    }
    return false; //if none of the if conditions satisfy
}

module.exports = hasPermission;