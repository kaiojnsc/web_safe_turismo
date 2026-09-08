require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createHandler } = require('graphql-http/lib/use/express');

const { conectarBanco, fecharBanco } = require('./database');
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

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database: 'MongoDB',
    timestamp: new Date().toISOString()
  });
});

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

const iniciarServidor = async () => {
  try {
    await conectarBanco();

    const server = app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`GraphQL: http://localhost:${PORT}/graphql`);
      console.log(`Health: http://localhost:${PORT}/health`);
    });

    const encerrar = async (sinal) => {
      console.log(`${sinal} recebido. Encerrando servidor...`);
      server.close(async () => {
        await fecharBanco();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => encerrar('SIGINT'));
    process.on('SIGTERM', () => encerrar('SIGTERM'));
  } catch (error) {
    console.error('Não foi possível iniciar a aplicação:', error.message);
    process.exit(1);
  }
};

iniciarServidor();

module.exports = app;
