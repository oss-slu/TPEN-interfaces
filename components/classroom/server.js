import express from 'express';
import cors from 'cors';  // Import CORS middleware
import { fetchProjectData } from './fetchProjectData.mjs';  // Import the data fetching function

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Define an API endpoint to fetch project data by ID
app.get('/project/:id', async (req, res) => {
    const projectId = req.params.id;

    try {
        const project = await fetchProjectData(projectId);

        if (project) {
            res.json(project);  // Send project data as JSON
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        console.error('Error fetching project data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
