import express from 'express';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

const router = express.Router();
const dbConfig = {
    host: 'localhost', user: 'root', password: '', database: 'library_system'
};

// REGISTER (TOUJOURS CLIENT)
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const db = await mysql.createConnection(dbConfig);
        await db.execute('INSERT INTO users (username, password, role) VALUES (?, ?, "client")', [username, hashedPassword]);
        await db.end();
        res.json({ success: true, message: 'Compte créé!' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Nom d\'utilisateur existe déjà' });
    }
});

// LOGIN (DÉTECTE ROLE)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        await db.end();
        
        if (rows.length && await bcrypt.compare(password, rows[0].password)) {
            req.session.userId = rows[0].id;
            req.session.role = rows[0].role;
            res.json({ 
                success: true, 
                role: rows[0].role,
                redirect: rows[0].role === 'admin' ? '/admin.html' : '/client.html'
            });
        } else {
            res.status(401).json({ success: false, message: 'Identifiants incorrects' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

export default router;
