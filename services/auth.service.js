// services/auth.service.js
import User from "../models/user.js";
import { generateToken } from "../config/jwt.js";

export async function register(data) {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new Error("El email ya está registrado.");

  const user = new User(data);
  await user.save();

  const token = generateToken(user);
  return { user, token };
}

export async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Usuario no encontrado.");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Contraseña incorrecta.");

  const token = generateToken(user);
  return { user, token };
}
