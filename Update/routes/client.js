import express from 'express';
import mysql from 'mysql2/promise';

const router = express.Router();
const dbConfig = { host: 'localhost', user: 'root', password: '', database: 'library_system' };

// 1. Récupérer les livres pour les clients (uniquement ceux en stock ?)
router.get('/books', async (req, res) => {
    try {
        const db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute('SELECT * FROM books WHERE stock > 0 ORDER BY created_at DESC');
        await db.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors du chargement du catalogue" });
    }
});

// 2. Gérer l'achat (Diminuer le stock)
router.post('/buy', async (req, res) => {
    const { bookId } = req.body;
    try {
        const db = await mysql.createConnection(dbConfig);
        
        // Vérifier le stock actuel
        const [rows] = await db.execute('SELECT stock, title FROM books WHERE id = ?', [bookId]);
        
        if (rows.length > 0 && rows[0].stock > 0) {
            await db.execute('UPDATE books SET stock = stock - 1 WHERE id = ?', [bookId]);
            await db.end();
            res.json({ success: true, message: `Merci d'avoir acheté "${rows[0].title}" !` });
        } else {
            await db.end();
            res.status(400).json({ success: false, message: "Désolé, ce livre est en rupture de stock." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de la transaction." });
    }
});

export default router;