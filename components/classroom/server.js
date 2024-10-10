import express from 'express';
import cors from 'cors'; // Import the CORS package
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken'; // Ensure this is installed

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to check for Authorization header
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    // Verify token (implement your verification logic here)
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
};

// Route to get project by ID
app.get('/project/:id', authenticateJWT, async (req, res) => {
    const projectId = req.params.id;

    try {
        const project = await fetch(`https://api.t-pen.org/project/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${req.headers['authorization'].split(' ')[1]}`,
            },
        });

        if (!project.ok) {
            if (project.status === 404) {
                return res.status(404).json({ error: 'Project not found' });
            } else if (project.status === 403) {
                return res.status(403).json({ error: 'Forbidden access' });
            } else {
                return res.status(500).json({ error: 'An error occurred' });
            }
        }

        const projectData = await project.json();
        return res.status(200).json(projectData);

    } catch (error) {
        console.error('Error fetching project data:', error);
        return res.status(500).json({ error: 'An internal server error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
