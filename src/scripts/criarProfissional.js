// Cria (ou promove) uma conta PROFISSIONAL (administrador do SafeTour).
// Não existe cadastro público de profissional: use este script no servidor.
//
// Uso:
//   npm run criar-profissional -- "Nome" email@exemplo.com
// A senha é pedida pela variável PROFISSIONAL_SENHA (nunca fica no código):
//   PowerShell:  $env:PROFISSIONAL_SENHA="..."; npm run criar-profissional -- "Nome" email@exemplo.com
//   Bash:        PROFISSIONAL_SENHA="..." npm run criar-profissional -- "Nome" email@exemplo.com
//
// Se o e-mail já existir, a conta é promovida a "profissional" (a senha atual é mantida,
// a menos que PROFISSIONAL_SENHA seja informada). Nenhum dado é apagado.
require('dotenv').config();

const bcrypt = require('bcryptjs');

const { conectarBanco, fecharBanco } = require('../database');
const Usuario = require('../models/Usuario');

const main = async () => {
  const [nome, email] = process.argv.slice(2);
  const senha = process.env.PROFISSIONAL_SENHA;

  if (!nome || !email) {
    console.error('Uso: npm run criar-profissional -- "Nome" email@exemplo.com');
    process.exit(1);
  }

  if (senha && senha.length < 8) {
    console.error('Use uma senha com pelo menos 8 caracteres em PROFISSIONAL_SENHA.');
    process.exit(1);
  }

  await conectarBanco();

  const emailNormalizado = email.trim().toLowerCase();
  const existente = await Usuario.findOne({ email: emailNormalizado });

  if (existente) {
    existente.perfil = 'profissional';

    if (senha) {
      existente.senha = await bcrypt.hash(senha, 10);
    }

    await existente.save();
    console.log(`Conta ${emailNormalizado} agora possui o perfil profissional.`);
  } else {
    if (!senha) {
      console.error('Defina PROFISSIONAL_SENHA para criar uma conta nova.');
      process.exit(1);
    }

    await Usuario.create({
      nome: nome.trim(),
      email: emailNormalizado,
      senha: await bcrypt.hash(senha, 10),
      perfil: 'profissional'
    });
    console.log(`Conta profissional ${emailNormalizado} criada.`);
  }
};

main()
  .catch((erro) => {
    console.error('Erro:', erro.message);
    process.exitCode = 1;
  })
  .finally(fecharBanco);
