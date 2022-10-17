const express = require("express");
const route = express();

const { addUser, attUser, profileUser } = require("./controllers/users");

const { checkLogin } = require("./intermediary/checkLogin");

const { loginUser } = require("./controllers/login");

const {
  addClient,
  listClient,
  deleteClient,
  attClient,
  getClient,
  getResumeClient,
} = require("./controllers/clientes");

const {
  listChargesClient,
  editCharge,
  deleteCharge,
  addCharge,
  listCharges,
  resumeCharge,
} = require("./controllers/cobrancas");

route.post("/usuarios", addUser);
route.post("/login", loginUser);

route.use(checkLogin);

route.put("/usuario", attUser);
route.get("/usuario", profileUser);

route.post("/cliente", addClient);
route.get("/clientes", listClient);
route.delete("/excluircliente/:id", deleteClient);
route.put("/cliente/:id", attClient);
route.get("/cliente/:id", getClient);
route.get("/resumo/clientes", getResumeClient);

route.post("/cobranca", addCharge);
route.get("/cobrancas", listCharges);
route.get("/cobrancas/:id", listChargesClient);
route.put("/cobrancas/:id", editCharge);
route.delete("/cobrancas/:id", deleteCharge);
route.get("/resumo/cobrancas", resumeCharge);

module.exports = route;
