const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const router = express.Router();

// Generar código referido único
const generarCodigoReferido = () => {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
};

// REGISTRO
router.post('/registro', async (req, res) => {
  try {
    const { nombres, apellidos, documentoNumero, correo, telefono, contraseña, codigoReferidoPor } = req.body;

    // Validaciones
    if (!nombres || !apellidos || !documentoNumero || !correo || !telefono || !contraseña) {
      return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ $or: [{ correo }, { documentoNumero }] });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const codigoReferido = generarCodigoReferido();
    const nuevoUsuario = new User({
      nombres,
      apellidos,
      documentoNumero,
      correo,
      telefono,
      contraseña,
      codigoReferido,
      codigoReferidoPor: codigoReferidoPor || null,
      saldoUSDT: 0
    });

    await nuevoUsuario.save();

    // Si viene con código referido, actualizar comisión
    if (codigoReferidoPor) {
      const usuarioReferidor = await User.findOne({ codigoReferido: codigoReferidoPor });
      if (usuarioReferidor) {
        usuarioReferidor.comisionReferidos += 0;
        await usuarioReferidor.save();
      }
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: nuevoUsuario._id, correo: nuevoUsuario.correo },
      process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro_aqui',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensaje: '✅ Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombres: nuevoUsuario.nombres,
        apellidos: nuevoUsuario.apellidos,
        correo: nuevoUsuario.correo,
        codigoReferido: nuevoUsuario.codigoReferido,
        saldoUSDT: nuevoUsuario.saldoUSDT
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Correo y contraseña requeridos' });
    }

    const usuario = await User.findOne({ correo }).select('+contraseña');
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const esValido = await usuario.compararContraseña(contraseña);
    if (!esValido) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario._id, correo: usuario.correo },
      process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro_aqui',
      { expiresIn: '7d' }
    );

    res.json({
      mensaje: '✅ Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        saldoUSDT: usuario.saldoUSDT,
        codigoReferido: usuario.codigoReferido
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
});

module.exports = router;
