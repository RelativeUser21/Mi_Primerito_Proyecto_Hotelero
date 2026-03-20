document.addEventListener("DOMContentLoaded", () => {
  // 1. Verificar sesión de forma silenciosa
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user"));

  // Si no hay token o datos, redirigir sin alertas molestas
  if (!token || !userData) {
    window.location.href = "/index.html";
    return; // Detiene la ejecución del resto del código
  }

  // 2. Mostrar el nombre de usuario correctamente
  // Usamos || 'Usuario' como respaldo por si el campo viene vacío
  const nombreParaMostrar = userData.NombreUsuario || userData.nombre || "Invitado";
  const welcomeElement = document.getElementById("welcomeName");

  if (welcomeElement) {
    welcomeElement.textContent = `Hola, ${nombreParaMostrar}`;
  }

  // 3. Control de Roles (Asegúrate que 'IDRol' sea el nombre que viene de tu DB)
  const adminCard = document.getElementById("adminCard");
  if (adminCard && (userData.IDRol === 1 || userData.rol === 1)) {
    adminCard.classList.remove("hidden");
  }

  // 4. Botón de Cerrar Sesión
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "/index.html";
    });
  }
});
