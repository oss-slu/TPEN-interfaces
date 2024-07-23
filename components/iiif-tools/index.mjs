//https://iiif.io/api/content-state/1.0/#61-choice-of-encoding-mechanism
function encodeContentState(plainContentState) {
    let uriEncoded = encodeURIComponent(plainContentState);  // using built in function
    let base64 = btoa(uriEncoded);                           // using built in function
    let base64url = base64.replace(/\+/g, "-").replace(/\//g, "_");
    let base64urlNoPadding = base64url.replace(/=/g, "");
    return base64urlNoPadding;
}

function decodeContentState(encodedContentState) {
    let base64url = restorePadding(encodedContentState);
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    let base64Decoded = atob(base64);                        // using built in function
    let uriDecoded = decodeURIComponent(base64Decoded);      // using built in function
    return uriDecoded;
}

function restorePadding(s) {
    // The length of the restored string must be a multiple of 4
    let pad = s.length % 4;
    let padding = "";
    if (pad) {
        if (pad === 1) {
            throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
        }
        s += '===='.slice(0, 4 - pad);
    }
    return s + padding;
}

function fetchProject(projectID) {
    // TPEN_USER?.authorization ??
    const AUTH_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vc3RvcmUucmVydW0uaW8vYWdlbnQiOiJodHRwOi8vc3RvcmUucmVydW0uaW8vdjEvaWQvNjBiMTVjNjExMWFlYjU0ZWQwMWU5OTQxIiwiaHR0cDovL3JlcnVtLmlvL2FwcF9mbGFnIjpbImRsYSIsImdsb3NzaW5nIiwidHBlbiJdLCJodHRwOi8vZHVuYmFyLnJlcnVtLmlvL2FwcF9mbGFnIjpbImRsYSIsImdsb3NzaW5nIiwidHBlbiJdLCJodHRwOi8vcmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9hZG1pbiIsImR1bmJhcl91c2VyX2N1cmF0b3IiLCJnbG9zc2luZ191c2VyX2FkbWluIiwibHJkYV91c2VyX2luc3RydWN0b3IiLCJ0cGVuX3VzZXJfYWRtaW4iLCJ0cGVuX3VzZXJfcHVibGljIl19LCJodHRwOi8vZHVuYmFyLnJlcnVtLmlvL3VzZXJfcm9sZXMiOnsicm9sZXMiOlsiZHVuYmFyX3VzZXJfYWRtaW4iLCJkdW5iYXJfdXNlcl9jdXJhdG9yIiwiZ2xvc3NpbmdfdXNlcl9hZG1pbiIsImxyZGFfdXNlcl9pbnN0cnVjdG9yIiwidHBlbl91c2VyX2FkbWluIiwidHBlbl91c2VyX3B1YmxpYyJdfSwiaXNzIjoiaHR0cHM6Ly9jdWJhcC5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjBiMTVjNjAyMGZmOWYwMDY5NDE5MDgyIiwiYXVkIjpbImh0dHBzOi8vY3ViYXAuYXV0aDAuY29tL2FwaS92Mi8iLCJodHRwczovL2N1YmFwLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MjE3NTE5MzQsImV4cCI6MTcyMTc1OTEzNCwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCB1cGRhdGU6Y3VycmVudF91c2VyX21ldGFkYXRhIG9mZmxpbmVfYWNjZXNzIiwiYXpwIjoiYkJ1Z0ZNV0hVbzFPaG5TWk1wWVVYeGkzWTFVSkk3S2wifQ.Qk6MS1CPqERToQOxXinS1RPxiJAyboe3XreLjXglCnPC72i4IubvzZpG52uVuJc4YaTsIfJI7lVQuesiNY9YqrvzCwlNlQebWBf1DCePEFVHZb-8xFv-CaImJKO4gK6dfNVg4AfLC5hTDDC-AUFTz7KvbV19fyjoGrfX23FnlRPLiIraQp4Zwa7pPCLlJTCarp32WkLnGwCD9xnkhrhHI3KyXXhDJWliWLpiKE_PvxJqgDxLGNmJKixyzKdTLzXvu4roRwr8zR4_UDrpkGkE4lcsaDxuY-BzW8t0Z3rBB9FOm3squ6axHN6P6AnyyaPItl7gB9uddVpgb-YGrQbi3w"
    return fetch(`https://dev.api.t-pen.org/project/${projectID}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AUTH_TOKEN}`
        }
    })
        .then(response => response.ok ? response : Promise.reject(response))
        .then(response => response.json())
        .catch(error => userMessage(`${error.status}: ${error.statusText}`))
}

/**
 * Pop up a modal message to the interface for the user to interact with or dismiss.
 * @param {String} message 
 */
function userMessage(message) {
    const modal = document.createElement('tpen-modal')
    modal.style = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border: 1px solid black;`
    modal.innerText = message
    document.body.appendChild(modal)
}

export { encodeContentState, decodeContentState, fetchProject, userMessage }
