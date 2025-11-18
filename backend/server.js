const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto que le asigne Render

app.use(cors());
app.use(bodyParser.json());

// CONEXIÓN A BASE DE DATOS (Soporta Local y Nube)
// Si existen variables de entorno (Render), las usa. Si no, usa las locales.
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin', // Tu contraseña local
    database: process.env.DB_NAME || 'gestion_mascotas',
    port: process.env.DB_PORT || 3306
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la BD:', err);
        return;
    }
    console.log('Conectado a MySQL exitosamente.');
});

// --- RUTAS (Igual que antes) ---
app.get('/mascotas', (req, res) => {
    const { especie } = req.query;
    let sql = 'SELECT * FROM mascotas';
    let params = [];
    if (especie) { sql += ' WHERE especie = ?'; params.push(especie); }
    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/mascotas/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM mascotas WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Mascota no encontrada' });
        res.json(results[0]);
    });
});

app.post('/mascotas', (req, res) => {
    const { nombre, especie, edad, dueno } = req.body;
    const sql = 'INSERT INTO mascotas (nombre, especie, edad, dueno) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, especie, edad, dueno], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, nombre, especie, edad, dueno });
    });
});

app.put('/mascotas/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, especie, edad, dueno } = req.body;
    const sql = 'UPDATE mascotas SET nombre = ?, especie = ?, edad = ?, dueno = ? WHERE id = ?';
    db.query(sql, [nombre, especie, edad, dueno, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Mascota actualizada correctamente' });
    });
});

app.delete('/mascotas/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM mascotas WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Mascota eliminada correctamente' });
    });
});

app.get('/mascotas/calculos/promedio-edad', (req, res) => {
    db.query('SELECT AVG(edad) as promedioEdad FROM mascotas', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ promedio: results[0].promedioEdad || 0 });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});