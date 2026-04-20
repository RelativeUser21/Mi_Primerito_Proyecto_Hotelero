let datosOriginales = {};

// Función para obtener el nombre del rol
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

// Función para mostrar datos en modo vista
function displayProfileViewData(data) {
  const campos = {
    'viewNombre': 'Nombre',
    'viewApellido': 'Apellido',
    'viewEmail': 'Email',
    'viewEmail': 'Email',
    'viewTipoDocumento': 'TipoDocumento',
    'viewNumeroDocumento': 'NumeroDocumento',
    'viewTelefono': 'Telefono',
    'viewPais': 'Pais',
    'viewDireccion': 'Direccion'
  };

  Object.entries(campos).forEach(([elementId, dataKey]) => {
    const elemento = document.getElementById(elementId);
    if (elemento) {
      elemento.textContent = data[dataKey] || '-';
    }
  });

  // Mostrar rol
  const viewRol = document.getElementById('viewRol');
  if (viewRol) {
    viewRol.textContent = data.NombreRol || getRolName(data.rolNombre ?? data.IDRol ?? data.rol);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✓ DOMContentLoaded iniciado");
  
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user"));

  console.log("Token:", token ? "✓ Existe" : "✗ No existe");
  console.log("User Data:", userData);

  if (!token || !userData) {
    window.location.href = "/index.html";
    return;
  }

  // Cargar y renderizar el Sidebar
  const sidebarContainer = document.getElementById("sidebar-container");
  if (sidebarContainer) {
    try {
      const response = await fetch("/src/components/header.html");
      const html = await response.text();
      sidebarContainer.innerHTML = html;
      initializeSidebar(userData);
      console.log("✓ Sidebar cargado");
    } catch (error) {
      console.error("✗ Error cargando sidebar:", error);
    }
  }

  const userId = userData.IDUsuario || userData.id;
  console.log("User ID:", userId);

  // --- 1. CARGAR DATOS DE LA API ---
  try {
    console.log(`Fetching: http://localhost:3000/api/usuarios/${userId}`);
    
    const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    console.log("Response Status:", response.status);
    console.log("Response OK:", response.ok);

    const data = await response.json();
    console.log("Data recibida:", data);

    if (response.ok) {
      datosOriginales = data;
      console.log("✓ Datos cargados exitosamente");

      // Rellenar vista y formulario con datos de la API
      displayProfileViewData(data);
      fillFormWithData(data);
    } else {
      console.error("✗ Error en respuesta:", data);
      alert("Error al cargar los datos del perfil");
    }
  } catch (error) {
    console.error("✗ Error en fetch:", error);
    alert("Error de conexión al servidor");
  }

  // --- 2. MANEJO DE VISTA Y EDICIÓN ---
  const profileViewMode = document.getElementById("profileViewMode");
  const profileForm = document.getElementById("profileForm");
  const editProfileBtn = document.getElementById("editProfileBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn") || createCancelButton();

  function createCancelButton() {
    const btn = document.createElement('button');
    btn.id = "cancelEditBtn";
    btn.type = "button";
    btn.className = "flex-1 bg-slate-400 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition duration-200";
    btn.textContent = "❌ Cancelar";
    return btn;
  }

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      profileViewMode.classList.add("hidden");
      profileForm.classList.remove("hidden");
      fillFormWithData(datosOriginales);
    });
  }

  // Agregar botón de cancelar al formulario si no existe
  const formButtonsDiv = profileForm?.querySelector('div[class*="border-t"]');
  if (formButtonsDiv && !document.getElementById("cancelEditBtn")) {
    const saveBtn = profileForm.querySelector('button[type="submit"]');
    if (saveBtn) {
      saveBtn.insertAdjacentElement('beforebegin', cancelEditBtn);
    }
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      profileForm.classList.add("hidden");
      profileViewMode.classList.remove("hidden");
    });
  }

  // --- 3. ACTUALIZAR DATOS (PUT) ---
  if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("Formulario enviado");

      // Validar campos obligatorios
      const nombreUsuario = document.getElementById("NombreUsuario").value.trim();
      const nombre = document.getElementById("Nombre").value.trim();
      const apellido = document.getElementById("Apellido").value.trim();
      const email = document.getElementById("Email").value.trim();
      const tipoDocumento = document.getElementById("TipoDocumento").value.trim();
      const numeroDocumento = document.getElementById("NumeroDocumento").value.toString().trim();

      if (!nombreUsuario || !nombre || !apellido || !email || !tipoDocumento || !numeroDocumento) {
        alert("Por favor, completa todos los campos obligatorios (marcados con *)");
        return;
      }

      const updatedData = {
        ...datosOriginales,
        Email: email,
        Nombre: nombre,
        Apellido: apellido,
        Email: email,
        TipoDocumento: tipoDocumento,
        NumeroDocumento: numeroDocumento,
        Telefono: document.getElementById("Telefono").value.trim() || null,
        Pais: document.getElementById("Pais").value.trim() || null,
        Direccion: document.getElementById("Direccion").value.trim() || null,
        IDRol: datosOriginales.IDRol,
      };

      try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          alert("¡Perfil actualizado correctamente!");
          datosOriginales = updatedData;
          console.log("✓ Datos actualizados");
          
          // Volver a la vista
          displayProfileViewData(updatedData);
          fillFormWithData(updatedData);
          profileForm.classList.add("hidden");
          profileViewMode.classList.remove("hidden");
        } else {
          const errorData = await response.json();
          console.error("✗ Error al actualizar:", errorData);
          alert("Error al actualizar el perfil");
        }
      } catch (error) {
        console.error("✗ Error de conexión:", error);
        alert("Error de conexión al actualizar");
      }
    });
  }

  // --- 4. BORRAR CUENTA ---
  const deleteBtn = document.getElementById("deleteAccountBtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      if (confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción NO se puede deshacer.")) {
        try {
          const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` },
          });

          if (response.ok) {
            alert("Cuenta eliminada correctamente.");
            localStorage.clear();
            window.location.href = "/index.html";
          } else {
            alert("Error al eliminar la cuenta");
          }
        } catch (error) {
          console.error("✗ Error al eliminar:", error);
          alert("Error de conexión al eliminar");
        }
      }
    });
  }
});

// Función para llenar el formulario con datos de la API
function fillFormWithData(data) {
  const campos = [
    "Email", "Nombre", "Apellido", "Email", 
    "TipoDocumento", "NumeroDocumento", "Telefono", "Pais", "Direccion"
  ];

  campos.forEach(campo => {
    const elemento = document.getElementById(campo);
    if (elemento) {
      elemento.value = data[campo] || "";
      console.log(`✓ ${campo} = ${data[campo] || "(vacío)"}`);
    }
  });
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
  
  const sidebarUserName = document.getElementById("sidebarUserName");
  if (sidebarUserName) {
    sidebarUserName.textContent = nombreParaMostrar;
  }

  // Mostrar rol en el sidebar
  const sidebarUserRole = document.getElementById("sidebarUserRole");
  if (sidebarUserRole) {
    sidebarUserRole.textContent = `Rol: ${rolNombre}`;
  }

  // Aplicar permisos del rol (controla todos los links incluyendo admin)
  applyRolePermissions(userData);

  // Event listeners para los links de admin
  const linkUsuarios = document.getElementById("link-usuarios");
  const linkRoles = document.getElementById("link-roles");

  if (linkUsuarios) {
    linkUsuarios.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "/src/pages/usuarios.html";
    });
  }

  if (linkRoles) {
    linkRoles.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "/src/pages/roles.html";
    });
  }

  // Botón de Perfil en el Sidebar
  const sidebarProfileBtn = document.getElementById("sidebarProfileBtn");
  if (sidebarProfileBtn) {
    sidebarProfileBtn.addEventListener("click", () => {
      window.location.href = "/src/pages/perfil.html";
    });
  }

  // Aplicar permisos del rol para secciones de cliente
  const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");
  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "/index.html";
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
