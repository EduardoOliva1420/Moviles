// controllers/saas.controllers.js
import User from "../models/user.js";
import Empresa from '../models/empresa.js';
import jwt from 'jsonwebtoken';

// Planes disponibles
const PLANES = {
  basica: { colaboradores: 5, precio: 99 },
  profesional: { colaboradores: 25, precio: 299 },
  empresarial: { colaboradores: 100, precio: 999 }
};

// Generar token JWT
function generarToken(usuario) {
  return jwt.sign(
    { 
      id: usuario._id, 
      email: usuario.email, 
      rol: usuario.rol,
      empresaId: usuario.empresaId
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// ========================
// REGISTRO SUPER USUARIO
// ========================
export async function registroSuperUsuario(req, res) {
  try {
    const { email, password, nombre, apellido } = req.body;

    // Validar que el email no exista
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Crear super usuario
    const usuario = new User({
      email,
      password,
      nombre,
      apellido,
      rol: 'super_usuario',
      estado: 'activo',
      permisos: [
        'ver_todas_empresas',
        'gestionar_empresas',
        'ver_todos_usuarios',
        'gestionar_usuarios'
      ]
    });

    await usuario.save();

    const token = generarToken(usuario);

    res.status(201).json({
      id: usuario._id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ========================
// REGISTRO EMPRESA
// ========================
export async function registroEmpresa(req, res) {
  try {
    const { 
      email, 
      password, 
      nombre, 
      apellido, 
      empresaNombre, 
      empresaRut, 
      empresaTelefono, 
      empresaDireccion,
      empresaCiudad,
      empresaPais,
      tipoPlan 
    } = req.body;

    // Validar que el email no exista
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Validar que el RUT no exista
    const empresaExistente = await Empresa.findOne({ rut: empresaRut });
    if (empresaExistente) {
      return res.status(400).json({ error: 'El RUT ya está registrado' });
    }

    // Validar plan
    if (!PLANES[tipoPlan]) {
      return res.status(400).json({ error: 'Plan no válido' });
    }

    // Crear usuario empresa
    const usuario = new User({
      email,
      password,
      nombre,
      apellido,
      rol: 'empresa',
      estado: 'activo',
      permisos: [
        'ver_su_empresa',
        'gestionar_encargados',
        'gestionar_colaboradores',
        'gestionar_suscripcion'
      ]
    });

    await usuario.save();

    // Crear empresa
    const plan = PLANES[tipoPlan];
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 1);

    const empresa = new Empresa({
      nombre: empresaNombre,
      rut: empresaRut,
      telefono: empresaTelefono,
      direccion: empresaDireccion,
      ciudad: empresaCiudad,
      pais: empresaPais,
      usuarioAdminId: usuario._id,
      suscripcion: {
        tipo: tipoPlan,
        estado: 'activa',
        colaboradoresDisponibles: plan.colaboradores,
        colaboradoresActuales: 0,
        precio: plan.precio,
        fechaFin
      }
    });

    await empresa.save();

    // Actualizar usuario con empresaId
    usuario.empresaId = empresa._id;
    await usuario.save();

    const token = generarToken(usuario);

    res.status(201).json({
      id: usuario._id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      empresaId: empresa._id,
      empresa: {
        id: empresa._id,
        nombre: empresa.nombre,
        suscripcion: empresa.suscripcion
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ========================
// INVITAR ENCARGADO DE CAPACITACIÓN
// ========================
export async function invitarEncargado(req, res) {
  try {
    const { email, nombre, apellido } = req.body;
    const { empresaId } = req.params;

    // Validar que la empresa exista
    const empresa = await Empresa.findById(empresaId);
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    // Validar que el email no exista
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Generar contraseña temporal
    const contrasenaTemporal = Math.random().toString(36).substring(2, 15);

    // Crear usuario encargado
    const usuario = new User({
      email,
      password: contrasenaTemporal,
      nombre,
      apellido,
      rol: 'encargado_capacitacion',
      estado: 'pendiente_activacion',
      empresaId: empresa._id,
      permisos: [
        'ver_su_empresa',
        'gestionar_colaboradores',
        'crear_planes_capacitacion',
        'ver_reportes'
      ]
    });

    await usuario.save();

    // Agregar a la empresa
    empresa.encargadosCapacitacion.push(usuario._id);
    await empresa.save();

    res.status(201).json({
      id: usuario._id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      empresaId: empresa._id,
      estado: 'pendiente_activacion',
      contrasenaTemporal: contrasenaTemporal,
      mensaje: 'Se ha enviado una invitación al encargado de capacitación'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ========================
// INVITAR COLABORADOR
// ========================
export async function invitarColaborador(req, res) {
  try {
    const { email, nombre, apellido } = req.body;
    const { empresaId } = req.params;

    // Validar que la empresa exista
    const empresa = await Empresa.findById(empresaId);
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    // Validar límite de colaboradores
    if (empresa.suscripcion.colaboradoresActuales >= empresa.suscripcion.colaboradoresDisponibles) {
      return res.status(400).json({ 
        error: 'Límite de colaboradores alcanzado. Actualiza tu suscripción.' 
      });
    }

    // Validar que el email no exista
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Generar contraseña temporal
    const contrasenaTemporal = Math.random().toString(36).substring(2, 15);

    // Crear usuario colaborador
    const usuario = new User({
      email,
      password: contrasenaTemporal,
      nombre,
      apellido,
      rol: 'colaborador',
      estado: 'pendiente_activacion',
      empresaId: empresa._id,
      permisos: [
        'ver_su_perfil',
        'editar_su_perfil',
        'generar_recomendaciones'
      ]
    });

    await usuario.save();

    // Agregar a la empresa y actualizar contador
    empresa.colaboradores.push(usuario._id);
    empresa.suscripcion.colaboradoresActuales += 1;
    await empresa.save();

    res.status(201).json({
      id: usuario._id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      empresaId: empresa._id,
      estado: 'pendiente_activacion',
      contrasenaTemporal: contrasenaTemporal,
      mensaje: 'Colaborador invitado exitosamente'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ========================
// OBTENER COLABORADORES DE EMPRESA
// ========================
export async function obtenerColaboradores(req, res) {
  try {
    const { empresaId } = req.params;

    const empresa = await Empresa.findById(empresaId)
      .populate({
        path: 'colaboradores',
        select: 'nombre apellido email estado perfilCompleto'
      });

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    res.json({
      total: empresa.colaboradores.length,
      limite: empresa.suscripcion.colaboradoresDisponibles,
      colaboradores: empresa.colaboradores
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ========================
// OBTENER TODAS LAS EMPRESAS (SUPER USUARIO)
// ========================
export async function obtenerEmpresas(req, res) {
  try {
    const empresas = await Empresa.find()
      .populate('usuarioAdminId', 'nombre apellido email')
      .populate('encargadosCapacitacion', 'nombre apellido email');

    res.json({
      total: empresas.length,
      empresas: empresas.map(e => ({
        id: e._id,
        nombre: e.nombre,
        rut: e.rut,
        ciudad: e.ciudad,
        pais: e.pais,
        suscripcion: e.suscripcion,
        usuarioAdmin: e.usuarioAdminId,
        encargados: e.encargadosCapacitacion.length,
        colaboradores: e.colaboradores.length,
        estado: e.estado
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ========================
// OBTENER DETALLES DE EMPRESA
// ========================
export async function obtenerEmpresa(req, res) {
  try {
    const { empresaId } = req.params;

    const empresa = await Empresa.findById(empresaId)
      .populate('usuarioAdminId', 'nombre apellido email')
      .populate('encargadosCapacitacion', 'nombre apellido email estado')
      .populate('colaboradores', 'nombre apellido email estado perfilCompleto');

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    res.json({
      id: empresa._id,
      nombre: empresa.nombre,
      descripcion: empresa.descripcion,
      rut: empresa.rut,
      telefono: empresa.telefono,
      direccion: empresa.direccion,
      ciudad: empresa.ciudad,
      pais: empresa.pais,
      suscripcion: empresa.suscripcion,
      usuarioAdmin: empresa.usuarioAdminId,
      encargados: empresa.encargadosCapacitacion,
      colaboradores: empresa.colaboradores,
      estado: empresa.estado,
      fechaCreacion: empresa.fechaCreacion
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ========================
// ACTUALIZAR SUSCRIPCIÓN
// ========================
export async function actualizarSuscripcion(req, res) {
  try {
    const { empresaId } = req.params;
    const { tipoPlan } = req.body;

    // Validar plan
    if (!PLANES[tipoPlan]) {
      return res.status(400).json({ error: 'Plan no válido' });
    }

    const empresa = await Empresa.findById(empresaId);
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    const plan = PLANES[tipoPlan];
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 1);

    empresa.suscripcion = {
      ...empresa.suscripcion,
      tipo: tipoPlan,
      colaboradoresDisponibles: plan.colaboradores,
      precio: plan.precio,
      fechaFin
    };

    await empresa.save();

    res.json({
      mensaje: 'Suscripción actualizada exitosamente',
      suscripcion: empresa.suscripcion
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ========================
// LOGIN
// ========================
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ error: 'Email o contraseña incorrectos' });
    }

    const esValido = await usuario.comparePassword(password);
    if (!esValido) {
      return res.status(400).json({ error: 'Email o contraseña incorrectos' });
    }

    const token = generarToken(usuario);

    res.json({
      id: usuario._id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      empresaId: usuario.empresaId,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
