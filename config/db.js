import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI no definido en .env");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(" MongoDB conectado correctamente");
  } catch (error) {
    console.error(" Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
