const knex = require("../database/connection");
const jwt = require("jsonwebtoken");

const checkLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }

  try {
    const token = authorization.replace("Bearer ", "").trim();
    const { id } = await jwt.verify(token, process.env.SEGREDO_JWT);

    const userFound = await knex("usuarios")
      .select("id", "nome", "email", "cpf", "telefone")
      .where("id", id)
      .first();

    if (!userFound) {
      return res
        .status(404)
        .json({ mensagem: "O usuário não foi encontrado." });
    }

    req.user = userFound;

    next();
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = { checkLogin };
