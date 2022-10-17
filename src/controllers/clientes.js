const knex = require("../database/connection");
const { schemaAddClient } = require("../validations/schemas");

const addClient = async (req, res) => {
  const {
    nome,
    email,
    cpf,
    telefone,
    cep,
    logradouro,
    complemento,
    bairro,
    cidade,
    estado,
  } = req.body;

  try {
    await schemaAddClient.validate(req.body);

    const checkEmailExists = await knex("clientes")
      .where("email", email)
      .first();

    if (checkEmailExists) {
      return res.status(400).json({ mensagem: "O email informado já existe" });
    }

    const checkPhoneExists = await knex("clientes")
      .where("telefone", telefone)
      .first();

    if (checkPhoneExists) {
      return res
        .status(400)
        .json({ mensagem: "O telefone informado já existe" });
    }

    const checkCPFExists = await knex("clientes").where("cpf", cpf).first();

    if (checkCPFExists) {
      return res.status(400).json({ mensagem: "O CPF informado já existe" });
    }

    const insertClient = await knex("clientes").insert({
      nome,
      email,
      cpf,
      telefone,
      cep,
      logradouro,
      complemento,
      bairro,
      cidade,
      estado,
    });

    if (!insertClient) {
      return res
        .status(500)
        .json({ mensagem: "O cliente não foi cadastrado." });
    }

    const registeredClient = await knex("clientes")
      .where("email", email)
      .first();

    return res.status(201).json(registeredClient);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const listClient = async (req, res) => {
  try {
    await knex.raw(`
      update clientes set status = 'Em dia'
         from cobrancas
	      where clientes.id = cobrancas.id_cliente;
      `);
    await knex.raw(`
        update clientes set status = 'Inadimplente'
        from cobrancas
        where clientes.id = cobrancas.id_cliente
          and cobrancas.status = 'Vencida';
      `);

    const listClients = await knex("clientes").orderBy("id");
    return res.status(200).json(listClients);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const deleteClient = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: "Id não informado!" });
  }

  try {
    const customerDeleted = await knex("clientes").del().where("id", id);

    if (!customerDeleted) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível exclir o cliente!" });
    }

    return res.status(200).json({ mensagem: "Cliente excluido com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const attClient = async (req, res) => {
  const { id } = req.params;
  const {
    nome,
    email,
    cpf,
    telefone,
    cep,
    logradouro,
    complemento,
    bairro,
    cidade,
    estado,
  } = req.body;

  try {
    await schemaAddClient.validate(req.body);

    const client = await knex("clientes").where("id", id).first();

    if (!client) {
      return res.status(404).json({ mensagem: "Cliente não encontrado!" });
    }

    if (client.email !== email) {
      const checkEmailExists = await knex("clientes")
        .where("email", email)
        .first();

      if (checkEmailExists) {
        return res
          .status(400)
          .json({ mensagem: "O email informado já existe" });
      }
    }

    if (client.telefone !== telefone) {
      const checkPhoneExists = await knex("clientes")
        .where("telefone", telefone)
        .first();

      if (checkPhoneExists) {
        return res
          .status(400)
          .json({ mensagem: "O telefone informado já existe" });
      }
    }

    if (client.cpf !== cpf) {
      const checkCPFExists = await knex("clientes").where("cpf", cpf).first();

      if (checkCPFExists) {
        return res.status(400).json({ mensagem: "O CPF informado já existe" });
      }
    }

    const updatedClient = await knex("clientes")
      .update({
        nome,
        email,
        cpf,
        telefone,
        cep,
        logradouro,
        complemento,
        bairro,
        cidade,
        estado,
      })
      .where("id", id);

    if (!updatedClient) {
      return res.status(500).json({
        mensagem: "Não foi possivel atualizar os dados do Cliente.",
      });
    }
    return res.status(200).json({ mensagem: "Cliente editado com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const getClient = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: "Id não informado!" });
  }

  try {
    const client = await knex("clientes").where("id", id).first();

    if (!client) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível obter o cliente!" });
    }

    return res.status(200).json(client);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const getResumeClient = async (req, res) => {
  try {
    await knex.raw(`
      update clientes set status = 'Em dia'
         from cobrancas
	      where clientes.id = cobrancas.id_cliente;
      `);
    await knex.raw(`
        update clientes set status = 'Inadimplente'
        from cobrancas
        where clientes.id = cobrancas.id_cliente
         and cobrancas.status = 'Vencida';
      `);

    const clients = await knex("clientes").select(
      "nome",
      "id",
      "cpf",
      "status"
    );

    const clientesEmDia = [];
    const clientesInadimplentes = [];

    clients.forEach((cliente) => {
      if (cliente.status === "Em dia") {
        clientesEmDia.push(cliente);
      } else if (cliente.status === "Inadimplente") {
        clientesInadimplentes.push(cliente);
      }
    });

    const response = {
      clientesEmDia: {
        lista: clientesEmDia,
        quantidade: clientesEmDia.length,
      },
      clientesInadimplentes: {
        lista: clientesInadimplentes,
        quantidade: clientesInadimplentes.length,
      },
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  addClient,
  listClient,
  deleteClient,
  attClient,
  getClient,
  getResumeClient,
};
