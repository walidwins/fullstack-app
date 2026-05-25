const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connecté'))
.catch(err => console.log(err));

// API Route
app.get('/api/users', (req, res) => {
    res.json([
        { id: 1, name: 'Ahmed' },
        { id: 2, name: 'Sara' }
    ]);
});

// React Build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// React Router
app.get((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});