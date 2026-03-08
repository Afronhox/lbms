import express from 'express';
import multer from 'multer';
import mysql from 'mysql2/promise';

const router = express.Router();
// ... configuration du pool et de multer ...

// 1. Récupérer tous les livres
router.get('/books', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM books ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ... Ajoutez les autres routes (POST /add, DELETE /delete, etc.) ...

export default router; // C'est cet export que server.js va lire sans erreur