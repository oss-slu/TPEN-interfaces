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
    const AUTH_TOKEN = window?.TPEN_USER?.authorization
    // const AUTH_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vc3RvcmUucmVydW0uaW8vYWdlbnQiOiJodHRwOi8vc3RvcmUucmVydW0uaW8vdjEvaWQvNjBiMTVjNjExMWFlYjU0ZWQwMWU5OTQxIiwiaHR0cDovL3JlcnVtLmlvL2FwcF9mbGFnIjpbImRsYSIsImdsb3NzaW5nIiwidHBlbiIsImxyZGEiXSwiaHR0cDovL2R1bmJhci5yZXJ1bS5pby9hcHBfZmxhZyI6WyJkbGEiLCJnbG9zc2luZyIsInRwZW4iLCJscmRhIl0sImh0dHA6Ly9yZXJ1bS5pby91c2VyX3JvbGVzIjp7InJvbGVzIjpbImR1bmJhcl91c2VyX2FkbWluIiwiZHVuYmFyX3VzZXJfY3VyYXRvciIsImdsb3NzaW5nX3VzZXJfYWRtaW4iLCJscmRhX3VzZXJfaW5zdHJ1Y3RvciIsInRwZW5fdXNlcl9hZG1pbiIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9hZG1pbiIsImR1bmJhcl91c2VyX2N1cmF0b3IiLCJnbG9zc2luZ191c2VyX2FkbWluIiwibHJkYV91c2VyX2luc3RydWN0b3IiLCJ0cGVuX3VzZXJfYWRtaW4iLCJ0cGVuX3VzZXJfcHVibGljIl19LCJuaWNrbmFtZSI6ImN1YmFwIiwibmFtZSI6ImN1YmFwQHNsdS5lZHUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvMTgwZWUxYjBjZjc3Yzc2MjcxMzgwMDdiMWY1ZWViNDk_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2VudGVyZm9yZGlnaXRhbGh1bWFuaXRpZXMuZ2l0aHViLmlvJTJGcmVydW0tY29uc29ydGl1bSUyRmxvZ28ucG5nIiwidXBkYXRlZF9hdCI6IjIwMjQtMTAtMTZUMTk6NTA6NDQuNzEwWiIsImlzcyI6Imh0dHBzOi8vY3ViYXAuYXV0aDAuY29tLyIsImF1ZCI6ImJCdWdGTVdIVW8xT2huU1pNcFlVWHhpM1kxVUpJN0tsIiwiaWF0IjoxNzI5MTA4MjQ5LCJleHAiOjE3MjkxNDQyNDksInN1YiI6ImF1dGgwfDYwYjE1YzYwMjBmZjlmMDA2OTQxOTA4MiIsInNpZCI6ImUwUmtYbFU0ckRRUk1sTlpBU2JjeEstVkNsSkNMNTNOIiwibm9uY2UiOiJCbS1tcHdLT0tiRGx6UkY0a0VOMnBHdjVWRWpTVG5pUCJ9.WZQxCJA7ksqia8MEbsKXHpk6Y4N8mRnXQF2rbNsXKBraEaofPTfTrsFTkUS-WKLJ21r11YNbKqB7i-IHki1066wXz-zoJhTOAVworNDMTbgs_g0FpSIisEV4uSVg8LzKO-vOBswDV_nED8gaxdPp_K-ehy41dSDeYjywxGqOTUhSCG-3RQlO_x6eSg8atKd1SE4fbTixiCJm_i6674Iz4zs3cRmQCRdvhm-qfcDCqAy77Vpbnb9ptmjHptfeufPNUZJ4cCx1rqpPnFqLNcbEqs8Jg5Oag7sPAN-1DPnpu9ZYuJnPRFt0Q0qAanM6aSpb_ebmoB-JwvJKB4oktboGVQ"
    return fetch(`//127.0.0.1:3009/project/${projectID}`,{
    // return fetch(`https://dev.api.t-pen.org/project/${projectID}`,{
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
