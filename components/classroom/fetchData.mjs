document.getElementById('projectForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vc3RvcmUucmVydW0uaW8vYWdlbnQiOiJodHRwczovL3N0b3JlLnJlcnVtLmlvL3YxL2lkLzY3MDk4Njc0OGFlMjk4ZGY3OGVmOGM1YSIsImh0dHA6Ly9yZXJ1bS5pby9hcHBfZmxhZyI6WyJ0cGVuIl0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vYXBwX2ZsYWciOlsidHBlbiJdLCJodHRwOi8vcmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImlzcyI6Imh0dHBzOi8vY3ViYXAuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDY3MDk4NjczOTJlOTg1NDY5Yzc5OWY1YyIsImF1ZCI6WyJodHRwczovL2N1YmFwLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9jdWJhcC5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzI4ODAzODI1LCJleHAiOjE3Mjg4MTEwMjUsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgdXBkYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBvZmZsaW5lX2FjY2VzcyIsImF6cCI6ImJCdWdGTVdIVW8xT2huU1pNcFlVWHhpM1kxVUpJN0tsIn0.KgjTK1MsYQ79sEQFwrjwgIV7IsMPRpiEQzDEiAnPevSIDf8IuiVeEX5BvJ7FXI834CSN35o1MJK9ox67ZfnAxwKWxwut18SZi4xVxAVqdSbkO5OiMdH4bFdJPgwLDs9BQY3pW748lk_kPI3T28VzH1qTU4nVbz9-jdUGzXovprwuweuuYJPhVpFZSpVjWAuJLImzN4qRqe-e01cpzVM2gGkGJrE6FwcB74QKjOK7MnW-nAtqi-UVEqCj_GFctHTFxyAk9CWIf1bwr6k0FhD9GeEkcbLX41xZyLt2PEEVrimrvFT9e0DisIuqvX56ahofwZK4dX8j5PNWzv7mkHIOFA'
    const projectId = document.getElementById('projectId').value;
    const errorMessage = document.getElementById('error-msg');

    try {
        const response = await fetch(`https://api.tpen.io/projects/${projectId}`, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });

        if (!response.ok) {
            window.location.href = `rabc.html?id=${projectId}`;
        } else if (response.status === 404) {
            errorMessage.style.display = 'block';
        } else {
            console.error('Error fetching project:', response.statusText);
        }
    } catch (error) {
        console.error('Error', error);
        errorMessage.style.display = 'block';
    }
});