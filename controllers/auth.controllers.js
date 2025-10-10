// controllers/auth.controllers.js
const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    res.json({
      message: 'Login exitoso',
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { register, login };
