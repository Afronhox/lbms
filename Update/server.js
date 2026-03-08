import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

// Import des routes avec extension .js obligatoire pour ESM
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import clientRoutes from './routes/client.js';

// Configuration __dirname pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de la session
app.use(session({
    secret: 'bibliotech_secret_key',
    resave: false,
    saveUninitialized: false, // Plus propre pour éviter de créer des sessions vides
    cookie: { secure: false }
}));

// --- SERVIR LES FICHIERS STATIQUES ---
// Fichiers du frontend (index.html, admin.html, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Dossier pour les images uploadées (accessible via /uploads/nom_image.jpg)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// --- ROUTES API ---
// Note : Le préfixe ici définit l'URL de départ pour chaque router
app.use('/api/auth', authRoutes);
app.use('/api', adminRoutes);    // Exemple: /api/books, /api/add
app.use('/api/client', clientRoutes);

// --- LANCEMENT DU SERVEUR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur BiblioTech lancé sur http://localhost:${PORT}`);
});