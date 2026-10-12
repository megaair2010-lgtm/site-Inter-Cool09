console.log("BYBIT KEY:", process.env.BYBIT_API_KEY ? "OK" : "MISSING");
console.log("BYBIT SECRET:", process.env.BYBIT_API_SECRET ? "OK" : "MISSING");

import express from "express";
import axios from "axios";
import crypto from "crypto";

const app = express();

console.log("BYBIT_KEY =", process.env.BYBIT_KEY);
console.log("BYBIT_SECRET =", process.env.BYBIT_SECRET);


app.get("/", (req, res) => {
  res.send("API Quantum Bot Bybit rodando 🚀");
});

app.get("/saldo", async (req, res) => {
  const API_KEY = process.env.BYBIT_KEY;
  const API_SECRET = process.env.BYBIT_SECRET;

  if (!API_KEY || !API_SECRET) {
    return res.status(500).json({ error: "API Bybit não configurada" });
  }

  try {
    const timestamp = Date.now().toString();
    const recvWindow = "5000";

    const query = `api_key=${API_KEY}&timestamp=${timestamp}&recv_window=${recvWindow}`;

    const signature = crypto
      .createHmac("sha256", API_SECRET)
      .update(query)
      .digest("hex");

    const response = await axios.get(
      `https://api.bybit.com/v5/account/wallet-balance?accountType=UNIFIED&${query}&sign=${signature}`
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar saldo",
      details: err.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API Bybit rodando na porta", PORT);
});
