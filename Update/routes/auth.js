import express from 'express';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

const router = express.Router();

// Utilisation d'un Pool (beaucoup plus stable et rapide que createConnection)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'library_system',
    waitForConnections: true,
    connectionLimit: 10
});

// --- 1. INSCRIPTION (REGISTER) ---
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Vérification si les champs sont remplis
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insertion dans la base de données (le rôle est forcé à "client" par sécurité)
        await pool.execute(
            'INSERT INTO users (username, password, role) VALUES (?, ?, "client")', 
            [username, hashedPassword]
        );

        res.json({ success: true, message: 'Compte créé avec succès !' });
    } catch (error) {
        // Gestion de l'erreur "Nom d'utilisateur déjà pris" (Code SQL 1062)
        if (error.errno === 1062) {
            return res.status(400).json({ success: false, message: 'Ce nom d\'utilisateur est déjà utilisé.' });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'inscription.' });
    }
});

// --- 2. CONNEXION (LOGIN) ---
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Identifiants manquants.' });
        }

        // On cherche l'utilisateur
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        
        if (rows.length > 0) {
            const user = rows[0];
            // Comparaison du mot de passe haché
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                // Initialisation de la session (nécessite express-session dans server.js)
                req.session.userId = user.id;
                req.session.role = user.role;
                req.session.username = user.username;

                return res.json({ 
                    success: true, 
                    role: user.role,
                    message: `Bienvenue, ${user.username} !`,
                    // On renvoie le lien de redirection pour que le JS client puisse l'utiliser
                    redirect: user.role === 'admin' ? '/admin.html' : '/client.html'
                });
            }
        }

        // Si l'utilisateur n'existe pas ou le mot de passe est faux
        res.status(401).json({ success: false, message: 'Identifiants incorrects.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
});

export default router;