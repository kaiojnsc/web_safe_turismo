const mongoose = require('mongoose');

let conectado = false;

const conectarBanco = async () => {
  if (conectado && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'safetour';

  if (!uri) {
    throw new Error('MONGODB_URI não foi definida no arquivo .env');
  }

  try {
    await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1
    });

    conectado = true;
    console.log(`MongoDB conectado com sucesso! Banco: ${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (error) {
    conectado = false;
    console.error('Erro ao conectar ao MongoDB:', error.message);
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  conectado = false;
  console.warn('MongoDB desconectado.');
});

mongoose.connection.on('error', (error) => {
  console.error('Erro na conexão com MongoDB:', error.message);
});

const fecharBanco = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    conectado = false;
  }
};

module.exports = { conectarBanco, fecharBanco };
