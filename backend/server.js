const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// CONFIGURACIÓN DE LA BASE DE DATOS
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Usuario por defecto de XAMPP/MySQL
    password: 'admin',      // <--- PON TU CONTRASEÑA AQUÍ SI TIENES
    database: 'gestion_mascotas'
});

db.connect(err => {
    if (err) { console.error('Error BD:', err); return;}
    console.log('Conectado a MySQL');
});

// RUTAS CRUD
// 1. Listar y Filtrar
app.get('/mascotas', (req, res) => {
    const { especie } = req.query;
    let sql = 'SELECT * FROM mascotas';
    let params = [];
    if (especie) { sql += ' WHERE especie = ?'; params.push(especie); }
    db.query(sql, params, (err, results) => {
        if(err) return res.status(500).send(err);
        res.json(results);
    });
});

// 2. Crear
app.post('/mascotas', (req, res) => {
    const { nombre, especie, edad, dueno } = req.body;
    db.query('INSERT INTO mascotas (nombre, especie, edad, dueno) VALUES (?,?,?,?)', 
    [nombre, especie, edad, dueno], (err, result) => {
        if(err) return res.status(500).send(err);
        res.json({ id: result.insertId, ...req.body });
    });
});

// 3. Actualizar
app.put('/mascotas/:id', (req, res) => {
    const { nombre, especie, edad, dueno } = req.body;
    db.query('UPDATE mascotas SET nombre=?, especie=?, edad=?, dueno=? WHERE id=?', 
    [nombre, especie, edad, dueno, req.params.id], (err) => {
        if(err) return res.status(500).send(err);
        res.json({ message: 'Actualizado' });
    });
});

// 4. Eliminar
app.delete('/mascotas/:id', (req, res) => {
    db.query('DELETE FROM mascotas WHERE id=?', [req.params.id], (err) => {
        if(err) return res.status(500).send(err);
        res.json({ message: 'Eliminado' });
    });
});

// 5. EXTRA: Promedio de Edad
app.get('/mascotas/calculos/promedio-edad', (req, res) => {
    db.query('SELECT AVG(edad) as promedio FROM mascotas', (err, results) => {
        if(err) return res.status(500).send(err);
        res.json({ promedio: results[0].promedio });
    });
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));