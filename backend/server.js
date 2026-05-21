const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connecté"))
.catch(err => console.log(err));

app.get('/api/test', (req, res) => {
    res.json({
        message: "API fonctionne"
    });
});

/*
-----------------------------------
Frontend React build
-----------------------------------
*/

app.use(express.static(
    path.join(__dirname, '../frontend/build')
));

app.get('/login', (req, res) => {
    res.sendFile(
        path.join(__dirname, '../frontend/build/index.html')
    );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});