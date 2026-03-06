import express from 'express';
import mysql from 'mysql2/promise';

const router = express.Router();
const dbConfig = { host: 'localhost', user: 'root', password: '', database: 'library_system' };

router.get('/books', async (req, res) => {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute('SELECT * FROM books ORDER BY created_at DESC');
    await db.end();
    res.json(rows);
});

router.post('/buy', async (req, res) => {
    const { bookId } = req.body;
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute('SELECT stock FROM books WHERE id = ?', [bookId]);
    
    if (rows[0]?.stock > 0) {
        await db.execute('UPDATE books SET stock = stock - 1 WHERE id = ?', [bookId]);
        await db.end();
        res.json({ success: true, message: 'Achat réussi!' });
    } else {
        await db.end();
        res.json({ success: false, message: 'Stock insuffisant' });
    }
});

export default router;
