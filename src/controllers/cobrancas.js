const knex = require("../database/connection");

const {
  schemaAddCharges,
  schemaAttCharges,
} = require("../validations/schemas");

const listCharges = async (req, res) => {
  try {
    await knex.raw(
      `UPDATE cobrancas 
      SET status = 'Vencida' 
      WHERE vencimento::date < NOW()::date 
      AND status != 'Pago';`
    );

    const listOfCharges = await knex("cobrancas")
      .join("clientes", "clientes.id", "=", "cobrancas.id_cliente")
      .select("cobrancas.*", "clientes.nome")
      .orderBy("id");

    return res.status(200).json(listOfCharges);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const resumeCharge = async (req, res) => {
  try {
    await knex.raw(
      `UPDATE cobrancas 
      SET status = 'Vencida' 
      WHERE vencimento::date < now()::date 
      AND status != 'Pago';`
    );

    const listOfCharges = await knex("cobrancas")
      .join("clientes", "clientes.id", "=", "cobrancas.id_cliente")
      .select(
        "cobrancas.id",
        "cobrancas.valor",
        "cobrancas.status",
        "clientes.nome"
      )
      .orderBy("id");

    if (!listOfCharges)
      return res
        .status(404)
        .json({ mensagem: "Não foi possível encontrar nenhuma cobrança" });

    const cobrancasPagas = [];
    const cobrancasPendentes = [];
    const cobrancasVencidas = [];

    let valorTotalPagos = 0;
    let valorTotalPendentes = 0;
    let valorTotalVencidos = 0;

    listOfCharges.forEach((cobranca) => {
      if (cobranca.status === "Pago") {
        cobrancasPagas.push(cobranca);
        valorTotalPagos += Number(cobranca.valor);
      }
      if (cobranca.status === "Pendente") {
        cobrancasPendentes.push(cobranca);
        valorTotalPendentes += Number(cobranca.valor);
      }
      if (cobranca.status === "Vencida") {
        cobrancasVencidas.push(cobranca);
        valorTotalVencidos += Number(cobranca.valor);
      }
    });
    const resposta = {
      CobrancasPagas: {
        lista: cobrancasPagas,
        total: valorTotalPagos,
        quantidade: cobrancasPagas.length,
      },
      CobrancasVencidas: {
        lista: cobrancasVencidas,
        total: valorTotalVencidos,
        quantidade: cobrancasVencidas.length,
      },
      CobrancasPendentes: {
        lista: cobrancasPendentes,
        total: valorTotalPendentes,
        quantidade: cobrancasPendentes.length,
      },
    };

    return res.status(200).json(resposta);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const listChargesClient = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: "Id não informado!" });
  }

  try {
    await knex.raw(
      `UPDATE cobrancas 
      SET status = 'Vencida' 
      WHERE vencimento::date < now()::date 
      AND status != 'Pago';`
    );
    const charge = await knex("cobrancas").where("id_cliente", id);
    return res.status(200).json(charge);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const editCharge = async (req, res) => {
  const { id } = req.params;
  const { descricao, status, valor, vencimento } = req.body;

  if (!id) {
    return res.status(400).json({ mensagem: "Id não informado!" });
  }

  try {
    await schemaAttCharges.validate(req.body);

    const updatedCharge = await knex("cobrancas")
      .update({ descricao, status, valor, vencimento })
      .where("id", id);

    if (!updatedCharge) {
      return res
        .status(200)
        .json({ mensagem: "Não foi possível atualizar a cobrança" });
    }

    return res
      .status(200)
      .json({ mensagem: "Cobrança atualizada com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const deleteCharge = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: "Id não informado!" });
  }

  try {
    const consultCharge = await knex("cobrancas").where("id", id).first();
    if (!consultCharge) {
      return res
        .status(404)
        .json({ mensagem: "Não foi possível encontrar a cobrança!" });
    }
    const dateCurrent = new Date().setHours(0, 0, 0, 0);

    const chargeCanBeDeleted =
      consultCharge.vencimento.setHours(0, 0, 0, 0) >= dateCurrent;

    if (consultCharge.status === "Pendente" && chargeCanBeDeleted) {
      const deletedCharge = await knex("cobrancas").del().where("id", id);
      if (!deletedCharge) {
        return res
          .status(400)
          .json({ mensagem: "Não foi possível exclir a cobrança!" });
      }
      return res
        .status(200)
        .json({ mensagem: "Cobrança excluída com sucesso." });
    }

    return res.status(406).json({
      mensagem: "Esta cobranças não pode ser excluída!",
    });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const addCharge = async (req, res) => {
  const { id_cliente, descricao, status, valor, vencimento } = req.body;

  try {
    await schemaAddCharges.validate(req.body);

    const charge = await knex("cobrancas")
      .insert({
        id_cliente,
        descricao,
        status,
        valor,
        vencimento,
      })
      .returning("*");

    if (!charge) {
      return res
        .status(500)
        .json({ mensagem: "A cobrança não foi cadastrada." });
    }

    return res.status(201).json(charge);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  listChargesClient,
  editCharge,
  deleteCharge,
  addCharge,
  listCharges,
  resumeCharge,
};
