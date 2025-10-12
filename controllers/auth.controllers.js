// controllers/auth.controllers.js
import * as authService from "../services/auth.service.js";

export const authController = {
  async register(req, res, next) {
    try {
      const { user, token } = await authService.register(req.body);
      res.status(201).json({
        message: "Usuario registrado exitosamente",
        user: {
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (e) {
      next(e);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);

      res.json({
        message: "Login exitoso",
      });
    } catch (e) {
      next(e);
    }
  },
};
