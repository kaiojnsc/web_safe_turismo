require('dotenv').config();

const express = require('express');
const cors = require('cors');

const conectarBanco = require('./database');
const authRoutes = require('./routes/authRoutes');
const pontoTuristicoRoutes = require('./routes/pontoTuristicoRoutes');
const eventoRoutes = require('./routes/eventoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

conectarBanco();

app.use(authRoutes);
app.use(pontoTuristicoRoutes);
app.use(eventoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
