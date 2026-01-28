// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

export function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      error: 'No autorizado: Token requerido' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ 
      error: 'Token inválido o expirado' 
    });
  }
}

export function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        error: `Rol no autorizado. Roles permitidos: ${rolesPermitidos.join(', ')}` 
      });
    }
    next();
  };
}

export function verificarEmpresa(req, res, next) {
  const empresaId = req.params.empresaId;
  
  // Super usuario tiene acceso a todo
  if (req.usuario.rol === 'super_usuario') {
    return next();
  }
  
  // Otros usuarios solo acceden a su empresa
  if (req.usuario.empresaId?.toString() === empresaId) {
    return next();
  }
  
  return res.status(403).json({ 
    error: 'No tienes acceso a esta empresa' 
  });
}

export function verificarPropietarioEmpresa(req, res, next) {
  if (req.usuario.rol === 'super_usuario') {
    return next();
  }
  
  if (req.usuario.rol !== 'empresa') {
    return res.status(403).json({ 
      error: 'Solo propietarios de empresa pueden realizar esta acción' 
    });
  }
  
  next();
}
