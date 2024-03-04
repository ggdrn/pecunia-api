const express = require("express");
const ViteExpress = require("vite-express");
const cors = require('cors');

// import express from "express";
// import cors from "cors"
// import ViteExpress from "vite-express";

const app = express()

var corsOptions = {
  origin: "http://localhost:8000"
};

// var corsOptions2 = {
//   origin: "http://localhost:8082"
// };

require('dotenv').config({ path: './.env' })

app.use(cors(corsOptions));
// app.use(cors(corsOptions2));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

// const gmail = require("./app/config/gmail.config")

// MiddlewareMiddleware de autenticação
// const autenticacaoMiddleware = require("./app/middleware")

// app.use(autenticacaoMiddleware);

// simple route
app.get("/" /* , autenticacaoMiddleware,*/, (req, res) => {
  res.json({ message: `Welcome to ${process.env.APP_NAME} application. Version: ${process.env.APP_VERSION}` });
});

// importando as rotas
require("./app/routes/emails.routes")(app);
require("./app/routes/genimi.routes")(app);

const PORT = process.env.PORT || 3000;

ViteExpress.listen(app, PORT, () => console.log("Server is listening..." + PORT));
