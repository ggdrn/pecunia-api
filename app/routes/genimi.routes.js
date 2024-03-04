module.exports = app => {
  const gemini = require("../controllers/gemini.controller");

  let router = require("express").Router();

 // Retrieve all administrador
 router.get("/processa-conta", gemini.findAll);

  app.use('/api/genimi', router);
};