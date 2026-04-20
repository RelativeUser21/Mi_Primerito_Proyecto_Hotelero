/**
 * Lógica de la página de gestión de usuarios
 */

import { showToast } from './toast.js';
import { confirmAction } from './modal.js';
import {
  getUsuarios,
  searchUsuarios,
  deleteUsuario,
  toggleUsuarioStatus,
} from './api.js';
import { openUsuarioForm } from './usuarioForm.js';

let currentPage = 1;
const LIMIT = 10;
let currentSearchQuery = '';
let allRoles = {};

// Variables para el DOM
let token = '';
let userData = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Verificar sesión
  token = localStorage.getItem('token');
  userData = JSON.parse(localStorage.getItem('user'));

  if (!token || !userData) {
    window.location.href = '/index.html';
    return;
  }

  // 2. Verificar que tenga permiso para acceder a usuarios
  const permisos = userData.permisos || [];
  if (!permisos.includes('usuarios')) {
    window.location.href = '/src/pages/dashboard.html';
    return;
  }

  // 3. Cargar sidebar
  const sidebarContainer = document.getElementById('sidebar-container');
  if (sidebarContainer) {
    fetch('/src/components/header.html')
      .then(response => response.text())
      .then(html => {
        sidebarContainer.innerHTML = html;
        initializeSidebar(userData);
      })
      .catch(error => console.error('Error cargando sidebar:', error));
  }

  // 4. Inicializar
  initializePage();
});

// Función para obtener el nombre del rol basado en IDRol
function getRolName(rolId) {
  const rolesById = {
    1: 'Administrador',
    2: 'Cliente',
    3: 'Gerente',
    4: 'Recepcionista'
  };

  if (rolId === null || rolId === undefined) return 'Desconocido';

  if (typeof rolId === 'object') {
    rolId = rolId.IDRol ?? rolId.rol ?? rolId.id ?? rolId.Nombre;
  }

  const asNumber = Number(rolId);
  if (Number.isFinite(asNumber) && rolesById[asNumber]) {
    return rolesById[asNumber];
  }

  if (typeof rolId === 'string') {
    const trimmed = rolId.trim();
    const normalized = trimmed.toLowerCase();
    const rolesByName = {
      administrador: 'Administrador',
      admin: 'Administrador',
      cliente: 'Cliente',
      usuario: 'Usuario',
      gerente: 'Gerente',
      recepcionista: 'Recepcionista'
    };
    if (rolesByName[normalized]) return rolesByName[normalized];

    if (trimmed && !Number.isFinite(Number(trimmed))) return trimmed;
  }

  return 'Desconocido';
}

// Función para aplicar permisos y mostrar/ocultar secciones
function applyRolePermissions(userData) {
  // Obtener permisos del usuario (array)
  const permisos = userData.permisos || [];
  
  // Mapeo de permisos a IDs de elementos en sidebar
  const permisoElementMap = {
    'dashboard': 'link-dashboard',
    'usuarios': 'link-usuarios',
    'roles': 'link-roles',
    'habitaciones': 'link-habitaciones',
    'servicios': 'link-servicios',
    'reservas': 'link-reservas'
  };

  // Mostrar/ocultar elementos según permisos
  Object.entries(permisoElementMap).forEach(([permiso, elementId]) => {
    const elemento = document.getElementById(elementId);
    if (elemento) {
      if (permisos.includes(permiso)) {
        elemento.classList.remove('hidden');
        elemento.style.display = 'block';
      } else {
        elemento.classList.add('hidden');
        elemento.style.display = 'none';
      }
    }
  });
}

// Función para inicializar elementos del Sidebar
function initializeSidebar(userData) {
  const nombreParaMostrar = userData.nombre || userData.Email || "Invitado";
  const rolNombre = getRolName(userData.rolNombre ?? userData.IDRol ?? userData.rol);
  
  // Mostrar nombre en el sidebar
  const sidebarUserName = document.getElementById('sidebarUserName');
  if (sidebarUserName) {
    sidebarUserName.textContent = nombreParaMostrar;
  }

  // Mostrar rol en el sidebar
  const sidebarUserRole = document.getElementById('sidebarUserRole');
  if (sidebarUserRole) {
    sidebarUserRole.textContent = `Rol: ${rolNombre}`;
  }

  // Aplicar permisos del rol (controla todos los links incluyendo admin)
  applyRolePermissions(userData);

  // Event listeners para los links de admin
  const linkUsuarios = document.getElementById('link-usuarios');
  const linkRoles = document.getElementById('link-roles');

  if (linkUsuarios) {
    linkUsuarios.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/src/pages/usuarios.html';
    });
  }

  if (linkRoles) {
    linkRoles.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/src/pages/roles.html';
    });
  }

  // Botón de Perfil en el Sidebar
  const sidebarProfileBtn = document.getElementById('sidebarProfileBtn');
  if (sidebarProfileBtn) {
    sidebarProfileBtn.addEventListener('click', () => {
      window.location.href = '/src/pages/perfil.html';
    });
  }

  // Botón de Cerrar Sesión en el Sidebar
  const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = '/index.html';
    });
  }

  // Inicializar toggle del sidebar
  initializeSidebarToggle();
}

// Función para inicializar el toggle del sidebar
function initializeSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');
  const toggleIcon = document.getElementById('toggleIcon');
  const brandText = document.getElementById('brandText');
  const userInfo = document.getElementById('userInfo');
  const logoutText = document.querySelector('.logoutText');
  const profileText = document.querySelector('.profileText');
  const buttonsContainer = document.getElementById('sidebarButtonsContainer');
  const navTexts = document.querySelectorAll('.navText');

  if (!sidebar || !toggleBtn) return; // Si no existen los elementos, salir

  let isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

  // Aplicar estado inicial
  function applySidebarState() {
    if (isCollapsed) {
      sidebar.style.width = '80px';
      brandText?.classList.add('hidden');
      userInfo?.classList.add('hidden');
      logoutText?.classList.add('hidden');
      profileText?.classList.add('hidden');
      buttonsContainer?.classList.add('flex-col');
      buttonsContainer?.classList.remove('gap-2');
      buttonsContainer?.classList.add('gap-1');
      navTexts.forEach(text => text?.classList.add('hidden'));
      toggleIcon.textContent = '▶';
      document.body.classList.add('sidebar-collapsed');
    } else {
      sidebar.style.width = '288px';
      brandText?.classList.remove('hidden');
      userInfo?.classList.remove('hidden');
      logoutText?.classList.remove('hidden');
      profileText?.classList.remove('hidden');
      buttonsContainer?.classList.remove('flex-col');
      buttonsContainer?.classList.remove('gap-1');
      buttonsContainer?.classList.add('gap-2');
      navTexts.forEach(text => text?.classList.remove('hidden'));
      toggleIcon.textContent = '◀';
      document.body.classList.remove('sidebar-collapsed');
    }
  }

  // Aplicar estado inicial
  applySidebarState();

  // Event listener para el toggle
  toggleBtn.addEventListener('click', () => {
    isCollapsed = !isCollapsed;
    localStorage.setItem('sidebarCollapsed', isCollapsed);
    applySidebarState();
  });
}

/**
 * Inicializa la página
 */
async function initializePage() {
  setupEventListeners();
  await loadUsuarios(1);
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
  const crearBtn = document.getElementById('crearUsuarioBtn');
  const searchBtn = document.getElementById('searchBtn');
  const resetBtn = document.getElementById('resetBtn');
  const searchInput = document.getElementById('searchInput');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');

  crearBtn.addEventListener('click', handleCreateUsuario);
  searchBtn.addEventListener('click', handleSearch);
  resetBtn.addEventListener('click', handleReset);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  prevPageBtn.addEventListener('click', handlePrevPage);
  nextPageBtn.addEventListener('click', handleNextPage);
}

/**
 * Carga usuarios desde la API
 */
async function loadUsuarios(page = 1) {
  try {
    currentPage = page;
    const loading = document.getElementById('loadingState');
    const table = document.getElementById('usuariosTable');
    const empty = document.getElementById('emptyState');
    const pagination = document.getElementById('paginationSection');

    loading.classList.remove('hidden');
    table.classList.add('hidden');
    empty.classList.add('hidden');
    pagination.classList.add('hidden');

    let response;
    if (currentSearchQuery) {
      response = await searchUsuarios(currentSearchQuery, page, LIMIT, token);
    } else {
      response = await getUsuarios(page, LIMIT, token);
    }

    // Obtener lista de roles
    const rolesResponse = await fetch('http://localhost:3000/api/roles?page=1&limit=100', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const rolesData = await rolesResponse.json();
    rolesData.data.forEach((rol) => {
      allRoles[rol.IDRol] = rol.Nombre;
    });

    if (response.data.length === 0) {
      loading.classList.add('hidden');
      empty.classList.remove('hidden');
      return;
    }

    renderTable(response.data);
    renderPagination(response);

    loading.classList.add('hidden');
    table.classList.remove('hidden');
    pagination.classList.remove('hidden');
  } catch (error) {
    document.getElementById('loadingState').classList.add('hidden');
    showToast(`❌ Error: ${error.message}`, 'error');
  }
}

/**
 * Renderiza la tabla de usuarios
 */
function renderTable(usuarios) {
  const tbody = document.getElementById('usuariosTableBody');
  tbody.innerHTML = '';

  usuarios.forEach((usuario) => {
    const isInactive = usuario.IsActive === 0;
    const isSuperUser = usuario.IDUsuario === 1;
    const row = document.createElement('tr');
    
    row.className = `border-b border-slate-200 hover:bg-slate-50 transition ${isInactive ? 'bg-slate-100 opacity-60' : ''} ${isSuperUser ? 'bg-yellow-50 border-yellow-200' : ''}`;
    
    // Generar opciones de roles dinámicamente
    const rolesOptions = Object.entries(allRoles)
      .map(([id, nombre]) => `<option value="${id}" ${usuario.IDRol == id ? 'selected' : ''}>${nombre}</option>`)
      .join('');
    
    row.innerHTML = `
      <td class="p-4 ${isInactive ? 'opacity-50' : ''}">
        <div class="font-medium text-slate-800 ${isInactive ? 'line-through text-slate-500' : ''}">
          ${isSuperUser ? '👑 ' : ''}${usuario.Nombre} ${usuario.Apellido}
          ${isSuperUser ? '<span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded ml-2 font-bold">Super Usuario</span>' : ''}
        </div>
        <div class="text-sm text-slate-500">${usuario.Email}</div>
        ${isInactive ? '<div class="text-xs text-red-500 font-medium">Inactivo</div>' : ''}
      </td>
      <td class="p-4 text-slate-700 ${isInactive ? 'opacity-50' : ''}">
        ${usuario.Email}
      </td>
      <td class="p-4 ${isInactive ? 'opacity-50' : ''}">
        <select class="rol-select p-2 border border-slate-300 rounded text-sm" 
          data-usuario-id="${usuario.IDUsuario}"
          ${isInactive || isSuperUser ? 'disabled' : ''}>
          ${rolesOptions}
        </select>
      </td>
      <td class="p-4">
        <label class="flex items-center gap-2 ${isSuperUser ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}">
          <input type="checkbox" class="status-toggle" data-usuario-id="${usuario.IDUsuario}"
            ${usuario.IsActive === 1 ? 'checked' : ''}
            ${isSuperUser ? 'disabled' : ''}>
          <span class="text-sm ${usuario.IsActive === 1 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}">
            ${usuario.IsActive === 1 ? '✓ Activo' : '✗ Inactivo'}
          </span>
        </label>
      </td>
      <td class="p-4 text-center ${isInactive ? 'opacity-50 cursor-not-allowed' : ''}">
        <button class="edit-btn text-blue-600 hover:text-blue-800 font-bold" 
          data-usuario-id="${usuario.IDUsuario}"
          ${isInactive || isSuperUser ? 'disabled' : ''}
          title="${isSuperUser ? 'No se puede editar al Super Usuario' : (isInactive ? 'No se puede editar un usuario inactivo' : '')}">
          ✏️ Editar
        </button>
        <button class="delete-btn text-red-600 hover:text-red-800 font-bold ml-2" 
          data-usuario-id="${usuario.IDUsuario}"
          ${isSuperUser ? 'disabled' : ''}
          title="${isSuperUser ? 'No se puede eliminar al Super Usuario' : ''}">
          🗑️ Eliminar
        </button>
      </td>
    `;

    // Event listeners
    const editBtn = row.querySelector('.edit-btn');
    if (!isInactive && !isSuperUser) {
      editBtn.addEventListener('click', () => handleEditUsuario(usuario.IDUsuario));
    } else if (isInactive && !isSuperUser) {
      editBtn.title = 'No se puede editar un usuario inactivo';
    }
    
    if (!isSuperUser) {
      row.querySelector('.delete-btn').addEventListener('click', () => handleDeleteUsuario(usuario.IDUsuario, `${usuario.Nombre} ${usuario.Apellido}`));
      row.querySelector('.status-toggle').addEventListener('change', (e) => handleToggleStatus(usuario.IDUsuario, e.target.checked));
    }
    
    if (!isSuperUser) {
      row.querySelector('.rol-select').addEventListener('change', (e) => handleChangeRol(usuario.IDUsuario, e.target.value));
    }

    tbody.appendChild(row);
  });
}

/**
 * Renderiza la paginación
 */
function renderPagination(response) {
  const { page, pages, total, limit } = response;
  const paginationInfo = document.getElementById('paginationInfo');
  const pageNumbers = document.getElementById('pageNumbers');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');

  // Información
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  paginationInfo.textContent = `Mostrando ${start} a ${end} de ${total} usuarios`;

  // Botones de página
  pageNumbers.innerHTML = '';
  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement('button');
    btn.className = `py-2 px-3 rounded text-sm font-medium transition ${
      i === page
        ? 'bg-blue-600 text-white'
        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
    }`;
    btn.textContent = i;
    btn.addEventListener('click', () => loadUsuarios(i));
    pageNumbers.appendChild(btn);
  }

  // Botones prev/next
  prevBtn.disabled = page === 1;
  nextBtn.disabled = page === pages;
}

/**
 * Maneja la creación de usuario
 */
function handleCreateUsuario() {
  openUsuarioForm('create', null, token, () => {
    currentSearchQuery = '';
    document.getElementById('searchInput').value = '';
    loadUsuarios(1);
  });
}

/**
 * Maneja la edición de usuario
 */
async function handleEditUsuario(usuarioId) {
  try {
    const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const usuario = await response.json();
    openUsuarioForm('edit', usuario, token, () => {
      loadUsuarios(currentPage);
    });
  } catch (error) {
    showToast(`❌ Error al cargar usuario: ${error.message}`, 'error');
  }
}

/**
 * Maneja la eliminación de usuario
 */
async function handleDeleteUsuario(usuarioId, nombreUsuario) {
  const confirmed = await confirmAction(
    '🗑️ Eliminar Usuario',
    `¿Estás seguro de que deseas eliminar a ${nombreUsuario}? Esta acción no se puede deshacer.`,
    async () => {
      try {
        await deleteUsuario(usuarioId, token);
        showToast(`✅ Usuario eliminado exitosamente`, 'success');
        loadUsuarios(currentPage);
      } catch (error) {
        showToast(`❌ Error: ${error.message}`, 'error');
      }
    }
  );
}

/**
 * Maneja el toggle de estado
 */
async function handleToggleStatus(usuarioId, isActive) {
  try {
    await toggleUsuarioStatus(usuarioId, isActive, token);
    showToast(`✅ Estado actualizado`, 'success');
    loadUsuarios(currentPage);
  } catch (error) {
    showToast(`❌ Error: ${error.message}`, 'error');
    loadUsuarios(currentPage);
  }
}

/**
 * Maneja el cambio de rol
 */
async function handleChangeRol(usuarioId, newRol) {
  try {
    await fetch(`http://localhost:3000/api/usuarios/${usuarioId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ IDRol: newRol }),
    });
    showToast(`✅ Rol actualizado`, 'success');
    loadUsuarios(currentPage);
  } catch (error) {
    showToast(`❌ Error: ${error.message}`, 'error');
    loadUsuarios(currentPage);
  }
}

/**
 * Maneja la búsqueda
 */
async function handleSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (query === '') {
    showToast('Por favor, ingresa un término de búsqueda', 'info');
    return;
  }
  currentSearchQuery = query;
  await loadUsuarios(1);
}

/**
 * Limpia la búsqueda
 */
async function handleReset() {
  currentSearchQuery = '';
  document.getElementById('searchInput').value = '';
  await loadUsuarios(1);
}

/**
 * Maneja página anterior
 */
async function handlePrevPage() {
  if (currentPage > 1) {
    await loadUsuarios(currentPage - 1);
  }
}

/**
 * Maneja página siguiente
 */
async function handleNextPage() {
  const totalPages = document.querySelectorAll('#pageNumbers button').length;
  if (currentPage < totalPages) {
    await loadUsuarios(currentPage + 1);
  }
}
