const yup = require("./settings");

const schemaAddUser = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().email().required(),
  senha: yup.string().required().min(8).max(15),
});

const schemaLoginUser = yup.object().shape({
  email: yup.string().email().required(),
  senha: yup.string().required().min(8).max(15),
});

const schemaAttUser = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().email().required(),
  senha: yup.string().min(8).max(15),
  cpf: yup.string().length(11).nullable(),
  telefone: yup.string().length(12).nullable(),
});

const schemaAddClient = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().email().required(),
  cpf: yup.string().required().length(11),
  telefone: yup.string().required().length(11),
  cep: yup.string().length(8).nullable(),
  logradouro: yup.string(),
  complemento: yup.string(),
  bairro: yup.string(),
  cidade: yup.string(),
  estado: yup.string(),
});

const schemaAddCharges = yup.object().shape({
  id_cliente: yup.number().required(),
  descricao: yup.string(),
  status: yup.string().required(),
  valor: yup.number().required(),
  vencimento: yup.string().required(),
});

const schemaAttCharges = yup.object().shape({
  descricao: yup.string(),
  status: yup.string(),
  valor: yup.number(),
  vencimento: yup.string(),
});

module.exports = {
  schemaAddUser,
  schemaLoginUser,
  schemaAttUser,
  schemaAddClient,
  schemaAddCharges,
  schemaAttCharges,
};
