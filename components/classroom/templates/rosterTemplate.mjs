const students = [
    { name: 'John Doe', grade: 'A' },
    { name: 'Jane Smith', grade: 'B' }
];
const courseName = 'Math 101';

export const rosterTemplate = {
    templateName: "rosterTemplate",
    content: `
        <div>
        <h3>Roster for ${courseName}</h3>
        <ul>
            ${students.map((student, index) => `
            <li key=${index}>
                ${student.name} (Grade: ${student.grade})
            </li>
            `).join('')}
        </ul>
        </div>
    `,
    type: "roster"
};