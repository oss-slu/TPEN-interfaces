/*import { MongoClient } from 'mongodb';

const connectionString = "mongodb+srv://rerum-test:Hot2Trot@rerum-test.cpjrcdd.mongodb.net/?retryWrites=true&w=majority";

export async function fetchProjectData(projectId) {
    const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // Access the 'tpen' database
        const database = client.db("tpen");

        // Access the 'projects' collection
        const collection = database.collection("projects");

        // Define a query to find the specific project by its string _id
        const query = { _id: projectId };

        // Fetch the project from the 'projects' collection
        const project = await collection.findOne(query);

        if (project) {
            console.log('Fetched Project:', project);
            return project;
        } else {
            console.log('Project not found');
            return null;
        }

    } catch (error) {
        console.error('Error fetching project data:', error);
    } finally {
        await client.close();
    }
}*/

// Bearer token to mock authentication 
const bearerToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9FVTBORFk0T1RVNVJrRXlOREl5TTBFMU1FVXdNMFUyT0RGQk9UaEZSa1JDTXpnek1FSTRNdyJ9.eyJodHRwOi8vc3RvcmUucmVydW0uaW8vYWdlbnQiOiJodHRwczovL3N0b3JlLnJlcnVtLmlvL3YxL2lkLzY1Zjg2MTVlYzQzYmQ2NjU2OGM2NjZmYSIsImh0dHA6Ly9yZXJ1bS5pby9hcHBfZmxhZyI6WyJ0cGVuIiwiZGxhIl0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vYXBwX2ZsYWciOlsidHBlbiIsImRsYSJdLCJodHRwOi8vcmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9hZG1pbiIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImh0dHA6Ly9kdW5iYXIucmVydW0uaW8vdXNlcl9yb2xlcyI6eyJyb2xlcyI6WyJkdW5iYXJfdXNlcl9wdWJsaWMiLCJnbG9zc2luZ191c2VyX3B1YmxpYyIsImxyZGFfdXNlcl9wdWJsaWMiLCJyZXJ1bV91c2VyX3B1YmxpYyIsInRwZW5fdXNlcl9hZG1pbiIsInRwZW5fdXNlcl9wdWJsaWMiXX0sImlzcyI6Imh0dHBzOi8vY3ViYXAuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDY1Zjg2MTVkNmM2YmViMjMxNWNlZjgyMiIsImF1ZCI6WyJodHRwczovL2N1YmFwLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9jdWJhcC5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzI4NTgyMTEyLCJleHAiOjE3Mjg1ODkzMTIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgdXBkYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBvZmZsaW5lX2FjY2VzcyIsImF6cCI6ImJCdWdGTVdIVW8xT2huU1pNcFlVWHhpM1kxVUpJN0tsIn0.mW8Q7BqwBxd1sOAkOAm616PAm335ULAHYjj3FHanROyjxKnUxZBbQ2NtLBrk9HfCD_fZJYeBFaRpqo6IpOXo9n6r1HrYj75Z5Zw0cl_mSwE1MMu_4x_QxJiIgXtgpEDCeuBg7Mnc0Ib5l0B84NR8qMMZ7Xt0dxCUtJdFzczU99jnYFYjcttmDhDBmPPiokXihru2PpZxoOcM97qt4WPH7hxWhNeFRL1KU3cLQ3uBL3Oj84YIU_PwbNQFn5QljkF9TpImZ0AONTbZKoEaiNqESvJa0-Mj-pmTcV7Qcm3V6RACfJf38GfSJYwPdF-Nr52jjYcUuxzzTSMoRk_miczhQg";

export async function fetchProjectData(projectId) {
  const apiUrl = `https://api.t-pen.org/project/${projectId}`;

  try {
    console.log("Bearer Token:", bearerToken);
    console.log("Fetching from API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get the error body
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
    }

    const projectData = await response.json();
    console.log("Project Data:", projectData);

    return projectData;

  } catch (error) {
    console.error("Error fetching project data:", error);
    return null;
  }
}
