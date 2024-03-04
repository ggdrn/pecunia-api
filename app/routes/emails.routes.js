module.exports = app => {
  const emails = require("../controllers/emails.controller");

  let router = require("express").Router();

 // Retrieve all administrador
 router.get("/listagem", emails.findAll);

  app.use('/api/emails', router);
};