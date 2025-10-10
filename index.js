import express from "express";
import dotenv from "dotenv";
import profileRoutes from "./routes/profile.routes.js";
import connectDB from "./config/db.js";
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'


dotenv.config(); // esto carga las variables de .env
const app = express();

app.use(express.json());
app.use(cors());

connectDB()


// Rutas
app.use('/api/profiles', profileRoutes);
app.use('/api/auth', authRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
