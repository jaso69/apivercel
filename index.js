const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Añade esto al principio del archivo

const app = express();

// Middleware para permitir CORS y parsear JSON
app.use(cors());
app.use(express.json());

// Configuración de la API Key (usa una variable de entorno)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
    console.error("❌ Error: DEEPSEEK_API_KEY no está definida.");
    process.exit(1); // Detiene la ejecución si no hay API Key
}

// Ruta para enviar consultas a DeepSeek API
app.post('/ask-deepseek', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "El campo 'prompt' es requerido." });
        }

        // Configura la llamada a la API de DeepSeek (ajusta la URL según su documentación)
        const response = await axios.post(
            'https://api.deepseek.com/v1/chat/completions', // Revisa la URL real en la doc de DeepSeek
            {
                model: "deepseek-chat", // Ajusta según el modelo que uses
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Error al llamar a DeepSeek:", error.response?.data || error.message);
        res.status(500).json({ 
            error: "Error al procesar la solicitud",
            details: error.response?.data || error.message 
        });
    }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de DeepSeek en Vercel funcionando ✅');
});

// Exporta la app para Vercel
module.exports = app;