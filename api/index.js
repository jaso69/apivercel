const express = require('express');
const axios = require('axios');
const cors = require('cors');
const serverless = require('serverless-http'); // <-- Necesario para Vercel
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// Ruta para enviar consultas a DeepSeek API
app.post('/ask-deepseek', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "El campo 'prompt' es requerido." });
    }

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 9000, // <= Tiempo máximo antes de abortar la petición (menos que 10s de Vercel)
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error al llamar a DeepSeek:", error.response?.data || error.message);
    res.status(500).json({
      error: "Error al procesar la solicitud",
      details: error.response?.data || error.message,
    });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de DeepSeek en Vercel funcionando ✅');
});

// Exporta como handler para Vercel
module.exports = serverless(app);
