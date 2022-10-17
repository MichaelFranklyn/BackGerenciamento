const knex = require("../database/connection");
const securePassword = require("secure-password");
const pwd = securePassword();
const { schemaAddUser, schemaAttUser } = require("../validations/schemas");

const addUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    await schemaAddUser.validate(req.body);

    const checkEmailExists = await knex("usuarios")
      .where("email", email)
      .first();

    if (checkEmailExists) {
      return res.status(400).json({ mensagem: "O email informado já existe" });
    }

    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");

    const insertUser = await knex("usuarios").insert({
      nome,
      email,
      senha: hash,
    });

    if (!insertUser) {
      return res
        .status(500)
        .json({ mensagem: "O usuário não foi cadastrado." });
    }

    const userRegistered = await knex("usuarios")
      .select("id", "nome", "email")
      .where("email", email)
      .first();

    return res.status(201).json(userRegistered);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const attUser = async (req, res) => {
  const { user } = req;
  let { nome, email, senha, cpf, telefone } = req.body;

  try {
    await schemaAttUser.validate(req.body);

    const checkUserExists = await knex("usuarios").where("id", user.id).first();

    if (!checkUserExists) {
      return res
        .status(400)
        .json({ mensagem: "Não foi posssível encontrar esse usuário" });
    }

    if (email !== user.email) {
      const checkEmailExists = await knex("usuarios").where({ email }).first();

      if (checkEmailExists) {
        return res
          .status(404)
          .json({ mensagem: "O e-mail informado já existe." });
      }
    }

    if (senha) {
      senha = (await pwd.hash(Buffer.from(senha))).toString("hex");
    }

    const userUpdated = await knex("usuarios")
      .where("id", user.id)
      .update({ nome, email, senha, cpf, telefone });

    if (!userUpdated) {
      return res
        .status(400)
        .json({ mensagem: "Não foi posssível atualizar esse usuário" });
    }

    return res.status(200).json({ mensagem: "O usuário foi atualizado" });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const profileUser = (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = {
  addUser,
  attUser,
  profileUser,
};
