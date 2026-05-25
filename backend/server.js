const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const users = [];
const jwtSecret = process.env.JWT_SECRET || 'tp8-dev-secret';

app.use(express.json());
app.use(cors());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connecte'))
    .catch((err) => console.log(err.message));
} else {
  console.log('MONGO_URI absent: stockage en memoire active');
}

function createToken(user) {
  return jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = users.find((item) => item.id === payload.id);

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
}

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    return res.status(409).json({ message: 'Email deja utilise' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  };

  users.push(user);

  return res.status(201).json({
    token: createToken(user),
    user: { name: user.name, email: user.email },
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe obligatoires' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = users.find((item) => item.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
  }

  return res.json({
    token: createToken(user),
    user: { name: user.name, email: user.email },
  });
});

app.get('/api/users/me', authenticate, (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
  });
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'oualid', email: 'oualidkarmoun@gmail.com' },
    { id: 2, name: 'Sara', email: 'sara@example.com' },
  ]);
});
app.set("trust proxy", 1);
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Route API introuvable' });
  }

  return res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur lance sur le port ${PORT}`);
});
