import express from 'express';
import cors from 'cors'; 
import { fetchProjectData } from './groups/api/fetchProjectData.mjs';

const app = express();
const port = 3000;

app.use(cors());

app.get('/project/:id', async (req, res) => {
    const projectId = req.params.id;

    try {
        const project = await fetchProjectData(projectId);

        if (project) {
            res.json(project);
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
