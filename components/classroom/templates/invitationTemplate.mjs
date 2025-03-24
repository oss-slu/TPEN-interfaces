const username = 'John Doe';
const role = 'Student';

export const invitationTemplate = {
  templateName: "invitationTemplate",
  content: `
    <div>
      <h2>Welcome, ${username}!</h2>
      <p>You have been invited as a ${role}.</p>
    </div>
  `,
  type: "invitation"
};