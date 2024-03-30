// Import of Important Modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./docs/api.documentation.json');
require('dotenv').config();

// Middlewares:
const app = express();
app.use(cors());
app.use(express.json());

// DB CONNECTION:
const port = process.env.PORT;
const dbURI = process.env.DB_URI;
mongoose.connect(dbURI)
    .then((res) => app.listen(port, () => {
        console.log(`Successfully Connected to DB. Server is listening to port ${port}`);
    }))
    .catch((err) => {
        console.log("Failed to establish connection to the DB.");
    });

// ROUTERS:


// ROUTES:
app.get('/api', (req, res) => {
    res.status(200).send("Server is running.")
});

// Swagger UI Docs Route:
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))