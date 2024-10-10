import { MongoClient } from 'mongodb';

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
}
