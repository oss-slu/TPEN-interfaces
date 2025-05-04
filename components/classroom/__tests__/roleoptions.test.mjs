function buildButtonsForRoles(roles, projectId = "testProject123") {
  let buttonsHTML = "";

  if (roles.includes("OWNER") || roles.includes("LEADER")) {
    buttonsHTML += `
      <button id="inviteBtn">Invite New Members</button>
      <button id="manageRosterBtn">Manage Roster</button>
      <button id="manageRolesBtn">Manage Roles</button>
      <button id="gradebookBtn">Gradebook</button>
    `;
  }

  if (roles.includes("CONTRIBUTOR")) {
    buttonsHTML += `
      <button id="uploadAssignmentsBtn">Upload Assignments</button>
      <button id="transcriptionBtn">Transcription</button>
      <button id="gradesBtn">Grades</button>
    `;
  }

  if (!buttonsHTML) {
    buttonsHTML = "<p id='noPermissions'>You have no special permissions in this project.</p>";
  }

  const container = document.createElement('div');
  container.innerHTML = buttonsHTML;
  document.body.appendChild(container);
}

describe('Button display based on user roles', () => {
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = '';
  });

  test('OWNER should see management buttons', () => {
    buildButtonsForRoles(['OWNER']);

    expect(document.getElementById('inviteBtn')).toBeTruthy();
    expect(document.getElementById('manageRosterBtn')).toBeTruthy();
    expect(document.getElementById('manageRolesBtn')).toBeTruthy();
    expect(document.getElementById('gradebookBtn')).toBeTruthy();

    expect(document.getElementById('uploadAssignmentsBtn')).toBeFalsy();
    expect(document.getElementById('transcriptionBtn')).toBeFalsy();
    expect(document.getElementById('gradesBtn')).toBeFalsy();
    expect(document.getElementById('noPermissions')).toBeFalsy();
  });

  test('CONTRIBUTOR should see contributor buttons', () => {
    buildButtonsForRoles(['CONTRIBUTOR']);

    expect(document.getElementById('uploadAssignmentsBtn')).toBeTruthy();
    expect(document.getElementById('transcriptionBtn')).toBeTruthy();
    expect(document.getElementById('gradesBtn')).toBeTruthy();

    expect(document.getElementById('inviteBtn')).toBeFalsy();
    expect(document.getElementById('manageRosterBtn')).toBeFalsy();
    expect(document.getElementById('manageRolesBtn')).toBeFalsy();
    expect(document.getElementById('gradebookBtn')).toBeFalsy();
    expect(document.getElementById('noPermissions')).toBeFalsy();
  });

  test('LEADER should see management buttons', () => {
    buildButtonsForRoles(['LEADER']);

    expect(document.getElementById('inviteBtn')).toBeTruthy();
    expect(document.getElementById('manageRosterBtn')).toBeTruthy();
    expect(document.getElementById('manageRolesBtn')).toBeTruthy();
    expect(document.getElementById('gradebookBtn')).toBeTruthy();

    expect(document.getElementById('uploadAssignmentsBtn')).toBeFalsy();
    expect(document.getElementById('transcriptionBtn')).toBeFalsy();
    expect(document.getElementById('gradesBtn')).toBeFalsy();
    expect(document.getElementById('noPermissions')).toBeFalsy();
  });

  test('Unknown role should see no special permissions message', () => {
    buildButtonsForRoles(['VIEWER']);

    expect(document.getElementById('inviteBtn')).toBeFalsy();
    expect(document.getElementById('uploadAssignmentsBtn')).toBeFalsy();
    expect(document.getElementById('noPermissions')).toBeTruthy();
  });

  test('Multiple roles (OWNER and CONTRIBUTOR) should see all buttons', () => {
    buildButtonsForRoles(['OWNER', 'CONTRIBUTOR']);

    expect(document.getElementById('inviteBtn')).toBeTruthy();
    expect(document.getElementById('manageRosterBtn')).toBeTruthy();
    expect(document.getElementById('manageRolesBtn')).toBeTruthy();
    expect(document.getElementById('gradebookBtn')).toBeTruthy();
    expect(document.getElementById('uploadAssignmentsBtn')).toBeTruthy();
    expect(document.getElementById('transcriptionBtn')).toBeTruthy();
    expect(document.getElementById('gradesBtn')).toBeTruthy();
    expect(document.getElementById('noPermissions')).toBeFalsy();
  });
});