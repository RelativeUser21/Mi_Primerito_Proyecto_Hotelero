/**
 * Módulo de utilidades para llamadas a la API
 * Centraliza todos los endpoints y manejo de errores
 */

const API_URL = 'http://localhost:3000/api';

/**
 * Función helper para hacer llamadas a la API
 * @param {String} endpoint - Ruta del endpoint (ej: '/usuarios')
 * @param {String} method - Método HTTP (GET, POST, PUT, DELETE, PATCH)
 * @param {Object} data - Datos a enviar (para POST/PUT/PATCH)
 * @param {String} token - Token JWT
 * @returns {Promise} Respuesta de la API
 */
async function apiCall(endpoint, method = 'GET', data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  console.log(`🌐 API Call: ${method} ${API_URL}${endpoint}`, {data, hasToken: !!token});

  const response = await fetch(`${API_URL}${endpoint}`, options);
  
  console.log(`📍 Response Status: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    const error = await response.json();
    console.error(`❌ API Error:`, {status: response.status, error});
    throw {
      status: response.status,
      message: error.error || error.message || 'Error en la solicitud',
    };
  }

  const result = await response.json();
  console.log(`✅ API Success:`, result);
  return result;
}

// ============ USUARIOS ============

/**
 * Obtiene lista de usuarios con paginación
 */
async function getUsuarios(page = 1, limit = 10, token) {
  return apiCall(`/usuarios?page=${page}&limit=${limit}`, 'GET', null, token);
}

/**
 * Busca usuarios por nombre o email
 */
async function searchUsuarios(query, page = 1, limit = 10, token) {
  return apiCall(`/usuarios/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, 'GET', null, token);
}

/**
 * Obtiene un usuario por ID
 */
async function getUsuarioById(id, token) {
  return apiCall(`/usuarios/${id}`, 'GET', null, token);
}

/**
 * Crea un nuevo usuario
 */
async function createUsuario(data, token) {
  return apiCall('/usuarios', 'POST', data, token);
}

/**
 * Actualiza un usuario
 */
async function updateUsuario(id, data, token) {
  return apiCall(`/usuarios/${id}`, 'PUT', data, token);
}

/**
 * Elimina un usuario
 */
async function deleteUsuario(id, token) {
  return apiCall(`/usuarios/${id}`, 'DELETE', null, token);
}

/**
 * Alterna el estado de un usuario
 */
async function toggleUsuarioStatus(id, isActive, token) {
  return apiCall(`/usuarios/${id}/status`, 'PATCH', { isActive }, token);
}

// ============ ROLES ============

/**
 * Obtiene lista de roles con paginación
 */
async function getRoles(page = 1, limit = 10, token) {
  return apiCall(`/roles?page=${page}&limit=${limit}`, 'GET', null, token);
}

/**
 * Busca roles por nombre
 */
async function searchRoles(query, page = 1, limit = 10, token) {
  return apiCall(`/roles/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, 'GET', null, token);
}

/**
 * Obtiene un rol por ID
 */
async function getRolById(id, token) {
  return apiCall(`/roles/${id}`, 'GET', null, token);
}

/**
 * Crea un nuevo rol
 */
async function createRol(data, token) {
  return apiCall('/roles', 'POST', data, token);
}

/**
 * Actualiza un rol
 */
async function updateRol(id, data, token) {
  return apiCall(`/roles/${id}`, 'PUT', data, token);
}

/**
 * Elimina un rol
 */
async function deleteRol(id, token) {
  return apiCall(`/roles/${id}`, 'DELETE', null, token);
}

/**
 * Alterna el estado de un rol
 */
async function toggleRolStatus(id, isActive, token) {
  return apiCall(`/roles/${id}/status`, 'PATCH', { isActive }, token);
}

export {
  apiCall,
  getUsuarios,
  searchUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  toggleUsuarioStatus,
  getRoles,
  searchRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol,
  toggleRolStatus,
};
