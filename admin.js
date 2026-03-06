import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });
const dbConfig = { host: 'localhost', user: 'root', password: '', database: 'library_system' };

router.get('/books', async (req, res) => {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute('SELECT * FROM books ORDER BY created_at DESC');
    await db.end();
    res.json(rows);
});

router.post('/add', upload.single('image'), async (req, res) => {
    const { title, price, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const db = await mysql.createConnection(dbConfig);
    await db.execute('INSERT INTO books (title, price, stock, image) VALUES (?, ?, ?, ?)', [title, price, stock, image]);
    await db.end();
    res.json({ success: true, message: 'Livre ajouté!' });
});

router.post('/update', upload.single('image'), async (req, res) => {
    const { id, title, price, stock } = req.body;
    const db = await mysql.createConnection(dbConfig);
    if (req.file) {
        await db.execute('UPDATE books SET title=?, price=?, stock=?, image=? WHERE id=?', [title, price, stock, `/uploads/${req.file.filename}`, id]);
    } else {
        await db.execute('UPDATE books SET title=?, price=?, stock=? WHERE id=?', [title, price, stock, id]);
    }
    await db.end();
    res.json({ success: true, message: 'Livre modifié!' });
});

router.delete('/delete/:id', async (req, res) => {
    const db = await mysql.createConnection(dbConfig);
    await db.execute('DELETE FROM books WHERE id = ?', [req.params.id]);
    await db.end();
    res.json({ success: true, message: 'Livre supprimé!' });
});

router.get('/book/:id', async (req, res) => {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute('SELECT * FROM books WHERE id = ?', [req.params.id]);
    await db.end();
    res.json(rows[0]);
});

export default router;
