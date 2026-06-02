const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const router = express.Router();

const BINANCE_API_KEY = process.env.BINANCE_API_KEY;
const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET;
const BINANCE_TESTNET = process.env.BINANCE_TESTNET === 'true';
const BINANCE_URL = BINANCE_TESTNET 
  ? 'https://testnet.binance.vision/api'
  : 'https://api.binance.com/api';

const firmarPeticion = (params) => {
  const queryString = new URLSearchParams(params).toString();
  const signature = crypto
    .createHmac('sha256', BINANCE_API_SECRET)
    .update(queryString)
    .digest('hex');
  return `${queryString}&signature=${signature}`;
};

// Obtener dirección de depósito para USDT en BSC
router.get('/direccion-deposito', auth, async (req, res) => {
  try {
    const timestamp = Date.now();
    const params = {
      coin: 'USDT',
      network: 'BSC',
      timestamp
    };

    const signedRequest = firmarPeticion(params);

    const response = await axios.get(`${BINANCE_URL}/v3/capital/deposit/address`, {
      headers: {
        'X-MBX-APIKEY': BINANCE_API_KEY
      },
      params: signedRequest
    });

    res.json({
      direccion: response.data.address,
      network: 'Binance Smart Chain (BSC)',
      mensaje: 'Envía USDT en Binance Smart Chain (BSC) a esta dirección'
    });
  } catch (error) {
    console.error('Error Binance:', error.response?.data || error.message);
    res.status(500).json({ 
      mensaje: 'Error al obtener dirección de depósito',
      error: error.message 
    });
  }
});

module.exports = router;
