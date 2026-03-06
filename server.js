import express from 'express';
import cors from 'cors';
import session from 'express-session';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/client.js';
import adminRoutes from './routes/admin.js';
import mysql from 'mysql2/promise';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'bibliotech_secret_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Connexion DB globale
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'library_system'
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/admin', adminRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 BiblioTech sur http://localhost:${PORT}`);
    console.log(`📱 Login: http://localhost:${PORT}`);
});
