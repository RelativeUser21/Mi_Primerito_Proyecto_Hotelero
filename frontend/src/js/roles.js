/**
 * Lógica de la página de gestión de roles
 */

import { showToast } from './toast.js';
import { confirmAction } from './modal.js';
import {
  getRoles,
  searchRoles,
  deleteRol,
  toggleRolStatus,
} from './api.js';
import { openRolForm } from './rolForm.js';

// Roles protegidos que no se pueden eliminar ni desactivar
const PROTECTED_ROLES = [1, 2]; // 1 = Administrador, 2 = Cliente

let currentPage = 1;
const LIMIT = 10;
let currentSearchQuery = '';

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

  // 2. Verificar que tenga permiso para acceder a roles
  const permisos = userData.permisos || [];
  if (!permisos.includes('roles')) {
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
  const nombreParaMostrar = userData.NombreUsuario || userData.nombre || "Invitado";
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
  await loadRoles(1);
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
  const crearBtn = document.getElementById('crearRolBtn');
  const searchBtn = document.getElementById('searchBtn');
  const resetBtn = document.getElementById('resetBtn');
  const searchInput = document.getElementById('searchInput');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');

  crearBtn.addEventListener('click', handleCreateRol);
  searchBtn.addEventListener('click', handleSearch);
  resetBtn.addEventListener('click', handleReset);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  prevPageBtn.addEventListener('click', handlePrevPage);
  nextPageBtn.addEventListener('click', handleNextPage);
}

/**
 * Carga roles desde la API
 */
async function loadRoles(page = 1) {
  try {
    currentPage = page;
    const loading = document.getElementById('loadingState');
    const table = document.getElementById('rolesTable');
    const empty = document.getElementById('emptyState');
    const pagination = document.getElementById('paginationSection');

    loading.classList.remove('hidden');
    table.classList.add('hidden');
    empty.classList.add('hidden');
    pagination.classList.add('hidden');

    let response;
    if (currentSearchQuery) {
      response = await searchRoles(currentSearchQuery, page, LIMIT, token);
    } else {
      response = await getRoles(page, LIMIT, token);
    }

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
 * Renderiza la tabla de roles
 */
function renderTable(roles) {
  const tbody = document.getElementById('rolesTableBody');
  tbody.innerHTML = '';

  roles.forEach((rol) => {
    const isProtected = PROTECTED_ROLES.includes(rol.IDRol);
    const isInactive = rol.IsActive === 0;
    const row = document.createElement('tr');
    row.className = `border-b border-slate-200 hover:bg-slate-50 transition ${isInactive ? 'bg-slate-100 opacity-60' : ''}`;
    row.innerHTML = `
      <td class="p-4 ${isInactive ? 'opacity-50' : ''}">
        <div class="font-medium text-slate-800 ${isInactive ? 'line-through text-slate-500' : ''}">
          ${isProtected ? '🛡️' : '📋'} ${rol.Nombre}
        </div>
        ${isProtected ? '<div class="text-xs text-slate-500">Rol protegido</div>' : ''}
        ${isInactive ? '<div class="text-xs text-red-500 font-medium">Inactivo</div>' : ''}
      </td>
      <td class="p-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" class="status-toggle" data-rol-id="${rol.IDRol}"
            ${rol.IsActive === 1 ? 'checked' : ''}
            ${isProtected ? 'disabled' : ''}>
          <span class="text-sm ${rol.IsActive === 1 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}">
            ${rol.IsActive === 1 ? '✓ Activo' : '✗ Inactivo'}
          </span>
        </label>
      </td>
      <td class="p-4 text-center">
        <button class="edit-btn text-blue-600 hover:text-blue-800 font-bold ${isInactive ? 'opacity-50 cursor-not-allowed' : ''}" data-rol-id="${rol.IDRol}"
          ${isInactive ? 'disabled' : ''}>
          ✏️ Editar
        </button>
        <button class="delete-btn text-red-600 hover:text-red-800 font-bold ml-2 ${isProtected ? 'opacity-50 cursor-not-allowed' : ''}" 
          data-rol-id="${rol.IDRol}"
          ${isProtected ? 'disabled' : ''}>
          🗑️ Eliminar
        </button>
      </td>
    `;

    // Event listeners
    const editBtn = row.querySelector('.edit-btn');
    if (!isInactive) {
      editBtn.addEventListener('click', () => handleEditRol(rol));
    } else {
      editBtn.title = 'No se puede editar un rol inactivo';
    }
    
    const deleteBtn = row.querySelector('.delete-btn');
    if (!isProtected) {
      // Botón delete funciona incluso si inactivo (solo gris visualmente)
      deleteBtn.addEventListener('click', () => handleDeleteRol(rol.IDRol, rol.Nombre));
    } else {
      deleteBtn.title = 'No se pueden eliminar roles protegidos';
    }
    
    const toggle = row.querySelector('.status-toggle');
    if (!isProtected) {
      toggle.addEventListener('change', (e) => handleToggleStatus(rol.IDRol, e.target.checked));
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
  paginationInfo.textContent = `Mostrando ${start} a ${end} de ${total} roles`;

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
    btn.addEventListener('click', () => loadRoles(i));
    pageNumbers.appendChild(btn);
  }

  // Botones prev/next
  prevBtn.disabled = page === 1;
  nextBtn.disabled = page === pages;
}

/**
 * Maneja la creación de rol
 */
function handleCreateRol() {
  openRolForm('create', null, token, false, () => {
    currentSearchQuery = '';
    document.getElementById('searchInput').value = '';
    loadRoles(1);
  });
}

/**
 * Maneja la edición de rol
 */
function handleEditRol(rol) {
  const isProtected = PROTECTED_ROLES.includes(rol.IDRol);
  openRolForm('edit', rol, token, isProtected, () => {
    loadRoles(currentPage);
  });
}

/**
 * Maneja la eliminación de rol
 */
async function handleDeleteRol(rolId, nombreRol) {
  console.log('🗑️ handleDeleteRol called with:', {rolId, nombreRol});
  
  if (PROTECTED_ROLES.includes(rolId)) {
    console.warn('❌ Intento de eliminar rol protegido:', rolId);
    showToast('⚠️ No se pueden eliminar los roles Administrador o Cliente', 'error');
    return;
  }

  const confirmed = await confirmAction(
    '🗑️ Eliminar Rol',
    `¿Estás seguro de que deseas eliminar el rol "${nombreRol}"? Los usuarios con este rol serán afectados.`,
    async () => {
      try {
        console.log('✓ Usuario confirmó eliminación. Llamando API...');
        const result = await deleteRol(rolId, token);
        console.log('✅ Rol eliminado:', result);
        showToast(`✅ Rol eliminado exitosamente`, 'success');
        console.log('📄 Recargando tabla...');
        await loadRoles(currentPage);
      } catch (error) {
        console.error('❌ Error al eliminar rol:', error);
        showToast(`❌ ${error.message || 'Error al eliminar rol'}`, 'error');
      }
    }
  );
}

/**
 * Maneja el toggle de estado
 */
async function handleToggleStatus(rolId, isActive) {
  if (PROTECTED_ROLES.includes(rolId)) {
    showToast('⚠️ No se pueden desactivar los roles Administrador o Cliente', 'error');
    loadRoles(currentPage);
    return;
  }

  try {
    await toggleRolStatus(rolId, isActive, token);
    showToast(`✅ Estado actualizado`, 'success');
    loadRoles(currentPage);
  } catch (error) {
    showToast(`❌ ${error.message}`, 'error');
    loadRoles(currentPage);
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
  await loadRoles(1);
}

/**
 * Limpia la búsqueda
 */
async function handleReset() {
  currentSearchQuery = '';
  document.getElementById('searchInput').value = '';
  await loadRoles(1);
}

/**
 * Maneja página anterior
 */
async function handlePrevPage() {
  if (currentPage > 1) {
    await loadRoles(currentPage - 1);
  }
}

/**
 * Maneja página siguiente
 */
async function handleNextPage() {
  const totalPages = document.querySelectorAll('#pageNumbers button').length;
  if (currentPage < totalPages) {
    await loadRoles(currentPage + 1);
  }
}
