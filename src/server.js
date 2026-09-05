require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createHandler } = require('graphql-http/lib/use/express');

const conectarBanco = require('./database');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const pontoTuristicoRoutes = require('./routes/pontoTuristicoRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const areaDeRiscoRoutes = require('./routes/areaDeRiscoRoutes');
const estabelecimentoRoutes = require('./routes/estabelecimentoRoutes');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const criarContexto = require('./graphql/context');

const app = express();

app.use(cors());
app.use(express.json());

conectarBanco();

app.use(authRoutes);
app.use(usuarioRoutes);
app.use(pontoTuristicoRoutes);
app.use(eventoRoutes);
app.use(areaDeRiscoRoutes);
app.use(estabelecimentoRoutes);

app.all(
  '/graphql',
  createHandler({
    schema,
    rootValue: resolvers,
    context: criarContexto
  })
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
