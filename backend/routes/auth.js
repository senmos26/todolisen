import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Charger le fichier .env
dotenv.config();
const router = express.Router();

// Route pour l'inscription
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    // Hash du mot de passe avant l'enregistrement
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Échec de l\'inscription de l\'utilisateur' });
  }
});

// Route pour la connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche de l'utilisateur dans la base de données
    const utilisateur = await User.findOne({ email });
    if (!utilisateur) {
      return res.status(400).json({ message: 'Utilisateur introuvable' });
    }

    // Comparaison des mots de passe
    const isMatch = await bcrypt.compare(password, utilisateur.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Création du payload pour le JWT
    const payload = { _id: utilisateur._id, username: utilisateur.username };

    // Génération du token JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Réponse avec le token
    res.status(200).json({
      message: 'Connexion réussie',
      token, // Inclure le token dans la réponse
      user: payload // Inclure les informations utilisateur
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Échec de la connexion' });
  }
});

// Route pour la déconnexion
router.post('/logout', (req, res) => {
  // La déconnexion est gérée côté client en supprimant le token du localStorage
  res.status(200).json({ message: 'Déconnexion réussie' });
});

export default router;
