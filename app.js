require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const connectDb = require('./dbConfig');
const Estudiantes = require('./models/Estudiantes');

const PORT = 3000;

// Intermediarios
app.use(bodyParser.json());

// Controladores
app.get('/estudiantes/', async (req, res) => {
    const estudiantes = await Estudiantes.find().select('nombre edad');
    res.json({
        estudiantes,
        cantidad: estudiantes.length
    });
});

app.post('/estudiantes/', async (req, res) => {
    const { nombre, edad } = req.body;
    await Estudiantes.create({ nombre, edad });
    res.json({ nombre, edad });
});


app.get('/estudiantes/:id', async (req, res) => {
    try {
        const estudiante = await Estudiantes.findById(req.params.id).select('nombre edad');
        res.json(estudiante);
    } catch (error) {
        console.log(error);
        res.json({});
    }
});

app.put('/estudiantes/:id', async (req, res) => {
    try {
        const { nombre, edad } = req.body;
        const estudiante = await Estudiantes.findByIdAndUpdate(req.params.id,{ nombre, edad });
        res.json(estudiante);
    } catch (error) {
        console.log(error);
        res.json({});
    }
});

app.delete('/estudiantes/:id', async (req, res) => {
    try {
        const estudiante = await Estudiantes.findByIdAndRemove(req.params.id,{useFindAndModify: false})
        res.json(estudiante);
    } catch (error) {
        console.log(error);
        res.json({});
    }
});

connectDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Ejecutando en el puerto ${PORT}`);
    });
});