// routes/saas.routes.js
import { Router } from 'express';
import {
  registroSuperUsuario,
  registroEmpresa,
  invitarEncargado,
  invitarColaborador,
  obtenerColaboradores,
  obtenerEmpresas,
  obtenerEmpresa,
  actualizarSuscripcion,
  login
} from '../controllers/saas.controllers.js';
import {
  verificarToken,
  verificarRol,
  verificarEmpresa,
  verificarPropietarioEmpresa
} from '../middlewares/authMiddleware.js';

const router = Router();

// ========================
// AUTENTICACIÓN PÚBLICA
// ========================

// Registro de super usuario (solo administrador del sistema)
router.post('/register/super-usuario', registroSuperUsuario);

// Registro de empresa
router.post('/register/empresa', registroEmpresa);

// Login
router.post('/login', login);

// ========================
// EMPRESAS (SUPER USUARIO)
// ========================

// Obtener todas las empresas
router.get('/super-admin/empresas', verificarToken, verificarRol(['super_usuario']), obtenerEmpresas);

// Obtener detalles de empresa específica
router.get('/super-admin/empresas/:empresaId', verificarToken, verificarRol(['super_usuario']), obtenerEmpresa);

// ========================
// GESTIÓN DE USUARIOS (EMPRESA Y ENCARGADO)
// ========================

// Invitar encargado de capacitación
router.post('/empresas/:empresaId/invitar-encargado', 
  verificarToken, 
  verificarEmpresa,
  verificarRol(['empresa', 'super_usuario']),
  invitarEncargado
);

// Invitar colaborador
router.post('/empresas/:empresaId/invitar-colaborador', 
  verificarToken, 
  verificarEmpresa,
  verificarRol(['encargado_capacitacion', 'empresa', 'super_usuario']),
  invitarColaborador
);

// Obtener colaboradores de empresa
router.get('/empresas/:empresaId/colaboradores', 
  verificarToken, 
  verificarEmpresa,
  obtenerColaboradores
);

// ========================
// GESTIÓN DE SUSCRIPCIONES
// ========================

// Actualizar suscripción
router.put('/empresas/:empresaId/suscripcion', 
  verificarToken, 
  verificarEmpresa,
  verificarPropietarioEmpresa,
  actualizarSuscripcion
);

// Obtener detalles de empresa (para cualquier usuario de la empresa)
router.get('/empresas/:empresaId', 
  verificarToken, 
  verificarEmpresa,
  obtenerEmpresa
);

export default router;
