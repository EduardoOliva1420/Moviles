// test-saas.js - Pruebas rápidas del sistema SaaS
// Ejecutar con: node test-saas.js

const BASE_URL = 'http://localhost:5000/api/saas';

async function testRegistroSuperUsuario() {
  console.log('\n📝 Test 1: Registrar Super Usuario');
  try {
    const response = await fetch(`${BASE_URL}/register/super-usuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@auralearn.com',
        password: 'Admin123!',
        nombre: 'Juan',
        apellido: 'García'
      })
    });
    const data = await response.json();
    console.log('✅ Respuesta:', data);
    return data.token;
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

async function testRegistroEmpresa() {
  console.log('\n📝 Test 2: Registrar Empresa');
  try {
    const response = await fetch(`${BASE_URL}/register/empresa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@empresa.com',
        password: 'Empresa123!',
        nombre: 'Carlos',
        apellido: 'López',
        empresaNombre: 'Tech Solutions',
        empresaRut: '12.345.678-9',
        empresaTelefono: '+56912345678',
        empresaDireccion: 'Av. Principal 123',
        empresaCiudad: 'Santiago',
        empresaPais: 'Chile',
        tipoPlan: 'profesional'
      })
    });
    const data = await response.json();
    console.log('✅ Respuesta:', data);
    return { token: data.token, empresaId: data.empresaId };
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

async function testLogin(email, password) {
  console.log('\n📝 Test 3: Login');
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password
      })
    });
    const data = await response.json();
    console.log('✅ Respuesta:', data);
    return data.token;
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

async function runTests() {
  console.log('🚀 Iniciando pruebas del sistema SaaS...');
  
  // Probar registro de empresa
  const empresaData = await testRegistroEmpresa();
  
  if (empresaData) {
    const token = empresaData.token;
    const empresaId = empresaData.empresaId;
    
    // Probar login
    const loginToken = await testLogin('admin@empresa.com', 'Empresa123!');
    
    if (loginToken) {
      console.log('\n📝 Test 4: Invitar Encargado de Capacitación');
      try {
        const response = await fetch(`${BASE_URL}/empresas/${empresaId}/invitar-encargado`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email: 'encargado@empresa.com',
            nombre: 'María',
            apellido: 'López'
          })
        });
        const data = await response.json();
        console.log('✅ Respuesta:', data);
      } catch (err) {
        console.log('❌ Error:', err.message);
      }
    }
  }
  
  console.log('\n✅ Pruebas completadas');
  process.exit(0);
}

runTests();
