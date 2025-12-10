const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 1. App Setup
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2. Database Setup (SQLite)
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error('DB Connection Error:', err.message);
    else console.log('Connected to SQLite database.');
});

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    filepath TEXT,
    original_name TEXT,
    file_size INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// 3. File Upload Configuration (Multer)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Save as: timestamp-originalName (to avoid overwriting)
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// Filter to accept only PDF
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

// 4. API Endpoints

// GET /documents - List all files
app.get('/documents', (req, res) => {
    db.all("SELECT * FROM documents ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST /documents/upload - Upload a file
app.post('/documents/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a valid PDF file.' });
    }

    const { filename, path: filepath, size, originalname } = req.file;

    const sql = `INSERT INTO documents (filename, filepath, original_name, file_size) VALUES (?, ?, ?, ?)`;
    db.run(sql, [filename, filepath, originalname, size], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'File uploaded successfully' });
    });
});

// GET /documents/:id - Download a file
app.get('/documents/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM documents WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'File not found' });

        const filePath = path.join(__dirname, row.filepath);
        res.download(filePath, row.original_name);
    });
});

// DELETE /documents/:id - Delete a file
app.delete('/documents/:id', (req, res) => {
    const id = req.params.id;
    
    // First, get the file path to delete from disk
    db.get("SELECT * FROM documents WHERE id = ?", [id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'File not found' });

        // Delete from Disk
        fs.unlink(row.filepath, (unlinkErr) => {
            if (unlinkErr && unlinkErr.code !== 'ENOENT') {
                console.error("Failed to delete local file:", unlinkErr);
            }

            // Delete from Database
            db.run("DELETE FROM documents WHERE id = ?", [id], (dbErr) => {
                if (dbErr) return res.status(500).json({ error: dbErr.message });
                res.json({ message: 'Document deleted successfully' });
            });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
