document.getElementById('projectForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vc3RvcmUucmVydW0uaW8vYWdlbnQiOiJodHRwczovL3N0b3JlLnJlcnVtLmlvL3YxL2lkLzY3MDk4Njc0OGFlMjk4ZGY3OGVmOGM1YSIsImh0dHA6Ly9yZXJ1bS5pby9hcHBfZmxhZyI6WyJ0cGVuIl0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vYXBwX2ZsYWciOlsidHBlbiJdLCJodHRwOi8vcmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImlzcyI6Imh0dHBzOi8vY3ViYXAuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDY3MDk4NjczOTJlOTg1NDY5Yzc5OWY1YyIsImF1ZCI6WyJodHRwczovL2N1YmFwLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9jdWJhcC5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzI4ODUxNTcyLCJleHAiOjE3Mjg4NTg3NzIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgdXBkYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBvZmZsaW5lX2FjY2VzcyIsImF6cCI6ImJCdWdGTVdIVW8xT2huU1pNcFlVWHhpM1kxVUpJN0tsIn0.4jcJCJkc9bxo8VLaRhSbuB9fQxlOurhXE82tZ26TDU5Vp7QR7Y8qxBSm8f7hjvJe48gf4gvZD68KXCUabezAqlVe5MuUTLSnhmqfEHV5VJTmeIBmljCyrUowvrZWlzEMWV3EjdC-Cq4t8jVeFtr9DTOsHqx9k1sRaKIrkCCN1Ww8LFWqgW4ycL7cLg6lVARDKSjec-NB8kQwXPo-eaOPAcEgizUxx91teVufmrFX_9h8eR5HvdhEd9BWKdqGC9Ezjfqa1NLaJ_zDzsNe73xLgTH6BaO2EMPfvXw8ZWOhQdBGNQ_vGhCaU2WiOgeK7H24q9V2nhpGKWjCiWmGtdM8PA';
    const projectId = document.getElementById('projectId').value;
    const errorMsg = document.getElementById('error-msg');

    try {
        const response = await fetch(`https://dev.api.t-pen.org/project/${projectId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Project not found');
        }
        
        const projectData = await response.json();
        displayProjectData(projectData);
        window.location.href = 'rabc.html';
    } catch (error) {
        errorMsg.style.display = 'block';
    }

    function displayProjectData(data) {
        document.getElementById('projectId').textContent = `Project ID: ${data._id}`;
        document.getElementById('projectName').textContent = `Project Name: ${data.name}`;
        document.getElementById('projectCreator').textContent = `Project Creator: ${data.creator}`;
    }
});