const express = require("express");
require("dotenv").config();
const aotenticarApiKey = require("./autorizar")
const cors = require('cors');

const municipiosRouter = require("./routes/municipios");
const autenticarApiKey = require("./autorizar");

const app = express();
app.use(cors());
app.use(express.json());


// =====================
// Rotas principais
// =====================
app.use(autenticarApiKey);
app.use("/municipios", municipiosRouter);

// Rota raiz
app.get("/", (req, res) => {
  res.send("🌎 API de Municípios rodando! Acesse a documentação em /api-docs");
});

// =====================
// Servidor
// =====================
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log("✅ Servidor rodando em http://127.0.0.1:3000");
});
