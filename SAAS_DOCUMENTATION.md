# Documentación del Modelo SaaS - AuraLearn

## 📋 Descripción General

Este documento describe la arquitectura del modelo **SaaS Multi-tenant** implementado en AuraLearn, que permite gestionar diferentes tipos de usuarios organizados jerárquicamente dentro de empresas.

---

## 👥 Tipos de Usuarios

### 1. **Super Usuario**
- **Rol**: `super_usuario`
- **Descripción**: Administrador del sistema general
- **Permisos**:
  - Ver todas las empresas
  - Gestionar empresas
  - Ver todos los usuarios
  - Gestionar usuarios

**Ejemplo de Registro** (POST `/api/saas/register/super-usuario`):
```json
{
  "email": "admin@auralearn.com",
  "password": "SuperAdmin123!",
  "nombre": "Juan",
  "apellido": "Administrador"
}
```

---

### 2. **Empresa (Propietario)**
- **Rol**: `empresa`
- **Descripción**: Propietario/Administrador de una empresa
- **Permisos**:
  - Ver su empresa
  - Gestionar encargados de capacitación
  - Gestionar colaboradores
  - Gestionar suscripción

**Ejemplo de Registro** (POST `/api/saas/register/empresa`):
```json
{
  "email": "admin@empresa.com",
  "password": "EmpresaAdmin123!",
  "nombre": "Carlos",
  "apellido": "García",
  "empresaNombre": "Tech Solutions Inc.",
  "empresaRut": "12.345.678-9",
  "empresaTelefono": "+56912345678",
  "empresaDireccion": "Av. Principal 123, Santiago",
  "empresaCiudad": "Santiago",
  "empresaPais": "Chile",
  "tipoPlan": "profesional"
}
```

**Respuesta**:
```json
{
  "id": "507f1f77bcf86cd799439012",
  "email": "admin@empresa.com",
  "nombre": "Carlos",
  "rol": "empresa",
  "empresaId": "507f1f77bcf86cd799439013",
  "empresa": {
    "nombre": "Tech Solutions Inc.",
    "suscripcion": {
      "tipo": "profesional",
      "estado": "activa",
      "colaboradoresDisponibles": 25,
      "colaboradoresActuales": 0
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. **Encargado de Capacitación**
- **Rol**: `encargado_capacitacion`
- **Descripción**: Responsable de gestionar la capacitación en la empresa
- **Permisos**:
  - Ver su empresa
  - Gestionar colaboradores
  - Crear planes de capacitación
  - Ver reportes

**Invitación** (POST `/api/saas/empresas/{empresaId}/invitar-encargado`):
```json
{
  "email": "encargado@empresa.com",
  "nombre": "María",
  "apellido": "López"
}
```

**Respuesta**:
```json
{
  "id": "507f1f77bcf86cd799439014",
  "email": "encargado@empresa.com",
  "nombre": "María",
  "rol": "encargado_capacitacion",
  "empresaId": "507f1f77bcf86cd799439013",
  "estado": "pendiente_activacion",
  "contrasenaTemporal": "abc123xyz"
}
```

---

### 4. **Colaborador**
- **Rol**: `colaborador`
- **Descripción**: Empleado que recibe capacitación
- **Permisos**:
  - Ver su perfil
  - Editar su perfil
  - Generar recomendaciones

**Invitación** (POST `/api/saas/empresas/{empresaId}/invitar-colaborador`):
```json
{
  "email": "colaborador@empresa.com",
  "nombre": "Pedro",
  "apellido": "Rodríguez"
}
```

**Respuesta**:
```json
{
  "id": "507f1f77bcf86cd799439015",
  "email": "colaborador@empresa.com",
  "nombre": "Pedro",
  "rol": "colaborador",
  "empresaId": "507f1f77bcf86cd799439013",
  "estado": "pendiente_activacion",
  "contrasenaTemporal": "xyz789abc"
}
```

---

## 🏢 Modelos de Datos

### User Schema
```javascript
{
  nombre: String,
  apellido: String,
  email: String (unique),
  password: String (hashed),
  rol: Enum['super_usuario', 'empresa', 'encargado_capacitacion', 'colaborador'],
  estado: Enum['activo', 'pendiente_activacion', 'inactivo'],
  empresaId: ObjectId (ref: Empresa),
  permisos: [String],
  perfilCompleto: Boolean,
  perfilId: ObjectId (ref: Profile),
  fechaCreacion: Date,
  fechaActualizacion: Date
}
```

### Empresa Schema
```javascript
{
  nombre: String,
  descripcion: String,
  rut: String (unique),
  telefono: String,
  direccion: String,
  ciudad: String,
  pais: String,
  suscripcion: {
    tipo: Enum['basica', 'profesional', 'empresarial'],
    estado: Enum['activa', 'pausada', 'cancelada'],
    fechaInicio: Date,
    fechaFin: Date,
    colaboradoresDisponibles: Number,
    colaboradoresActuales: Number,
    precio: Number
  },
  usuarioAdminId: ObjectId (ref: User),
  encargadosCapacitacion: [ObjectId] (ref: User),
  colaboradores: [ObjectId] (ref: User),
  estado: Enum['activa', 'inactiva', 'cancelada'],
  fechaCreacion: Date,
  fechaActualizacion: Date
}
```

### Profile Schema
```javascript
{
  usuarioId: ObjectId (ref: User, unique),
  basic: {
    name, email, age, gender[], country, state, city
  },
  education: [{
    level, field, languages, certifications
  }],
  experience: [{
    previousJob, projects[], tools
  }],
  softSkills: {
    comunicacionEfectiva, trabajoEnEquipo, resolucionDeProblemas,
    adaptabilidad, gestionDelTiempo (1-5)
  },
  digitalSkills: {
    herramientas_dig_bas, herramientas_trabajo, capacidad_analisis,
    gestion_proyecto, compe_dig_bas (1-5)
  },
  jobInformation: {
    actualPosition, timeInJob, functionsJob[], technicalReq[], improveAreas[]
  },
  learningMethod: {
    modalidad_preferida, tiempo_disponible, metodo_aprendizaje[], certificaciones[]
  },
  targetPosition: String,
  fechaCreacion: Date,
  fechaActualizacion: Date
}
```

---

## 🔐 Middlewares de Autenticación

### `verificarToken(req, res, next)`
- Valida que el token JWT sea válido
- Extrae los datos del usuario y los asigna a `req.usuario`

### `verificarRol(rolesPermitidos)`
- Verifica que el usuario tenga uno de los roles permitidos

### `verificarEmpresa(req, res, next)`
- Super usuario accede a cualquier empresa
- Otros usuarios solo acceden a su propia empresa

### `verificarPropietarioEmpresa(req, res, next)`
- Solo el propietario de la empresa puede realizar ciertas acciones

---

## 📡 Endpoints Principales

### Autenticación
- **POST** `/api/saas/register/super-usuario` - Registrar super usuario
- **POST** `/api/saas/register/empresa` - Registrar nueva empresa
- **POST** `/api/saas/login` - Login de cualquier usuario

### Empresas (Super Usuario)
- **GET** `/api/saas/super-admin/empresas` - Obtener todas las empresas
- **GET** `/api/saas/super-admin/empresas/{empresaId}` - Detalles de empresa

### Gestión de Usuarios
- **POST** `/api/saas/empresas/{empresaId}/invitar-encargado` - Invitar encargado
- **POST** `/api/saas/empresas/{empresaId}/invitar-colaborador` - Invitar colaborador
- **GET** `/api/saas/empresas/{empresaId}/colaboradores` - Listar colaboradores

### Suscripciones
- **PUT** `/api/saas/empresas/{empresaId}/suscripcion` - Actualizar plan

---

## 💰 Planes de Suscripción

| Plan | Colaboradores | Precio |
|------|--------------|--------|
| Básica | 5 | $99/mes |
| Profesional | 25 | $299/mes |
| Empresarial | 100 | $999/mes |

---

## 🔄 Flujo de Registro Completo

### 1. Registro de Empresa
```
POST /api/saas/register/empresa
→ Crea usuario con rol 'empresa'
→ Crea empresa con suscripción
→ Retorna token JWT
```

### 2. Invitar Encargado
```
POST /api/saas/empresas/{empresaId}/invitar-encargado
→ Crea usuario con rol 'encargado_capacitacion'
→ Genera contraseña temporal
→ Asigna a la empresa
→ Encargado debe cambiar contraseña en primer login
```

### 3. Invitar Colaborador
```
POST /api/saas/empresas/{empresaId}/invitar-colaborador
→ Valida límite de colaboradores
→ Crea usuario con rol 'colaborador'
→ Incrementa contador en empresa
→ Genera contraseña temporal
```

### 4. Colaborador Completa Perfil
```
POST /api/profiles/completar
→ Requiere autenticación (Bearer token)
→ Valida schema de perfil completo
→ Genera recomendaciones con AuraLearn
```

---

## 📊 Estadísticas y Reportes

### Para Super Usuario
- Ver todas las empresas activas
- Monitorear uso de colaboradores por plan
- Trackear ingresos por suscripciones

### Para Empresa
- Ver estado de suscripción
- Listar colaboradores y su progreso
- Reportes de capacitación

### Para Encargado
- Ver colaboradores asignados
- Monitorear completitud de perfiles
- Acceso a recomendaciones generadas

---

## 🛡️ Seguridad

- **Hashing de contraseña**: bcrypt (10 salt rounds)
- **Autenticación**: JWT con expiración de 24h
- **Email único**: Evita duplicados
- **RUT único por empresa**: Evita registro duplicado
- **Validación de roles**: Autorización en cada endpoint

---

## 📝 Variables de Entorno Requeridas

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5000
OPENAI_API_KEY=sk-...
```

---

## 🚀 Próximas Etapas

- [ ] Implementar pagos con Stripe/PayPal
- [ ] Sistema de notificaciones por email
- [ ] Dashboard analítico completo
- [ ] Exportación de reportes en PDF
- [ ] Integración con sistemas de RRHH
- [ ] API de webhooks para eventos
- [ ] Sistema de soporte y ticketing
