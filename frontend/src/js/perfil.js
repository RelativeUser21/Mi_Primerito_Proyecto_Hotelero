let datosOriginales = {};

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user"));

  if (!token || !userData) {
    window.location.href = "/dashboard.html";
    return;
  }

  // El ID lo sacamos del objeto que guardamos en el login
  // Ajusta si tu DB usa IDUsuario o id
  const userId = userData.IDUsuario || userData.id;
  // --- 1. CARGAR DATOS (GET) ---
  try {
    const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (response.ok) {
      // ¡IMPORTANTE! Guardamos TODO el objeto original aquí
      datosOriginales = data;

      // Rellenamos los inputs que existen en el HTML
      document.getElementById("NombreUsuario").value = data.NombreUsuario || "";
      document.getElementById("Apellido").value = data.Apellido || "";
      document.getElementById("Email").value = data.Email || "";
      document.getElementById("Telefono").value = data.Telefono || "";
      document.getElementById("Pais").value = data.Pais || "";
      document.getElementById("Direccion").value = data.Direccion || "";
    }
  } catch (error) {
    console.error(error);
  }

  // --- 2. ACTUALIZAR DATOS (PUT) ---
  const profileForm = document.getElementById("profileForm");
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // JUNTAMOS los datos originales con los nuevos del formulario
    const updatedData = {
      // Campos que NO están en el formulario pero existen en la DB
      ...datosOriginales,

      // Campos que SÍ están y queremos actualizar
      NombreUsuario: document.getElementById("NombreUsuario").value,
      Apellido: document.getElementById("Apellido").value,
      Email: document.getElementById("Email").value,
      Telefono: document.getElementById("Telefono").value,
      Pais: document.getElementById("Pais").value,
      Direccion: document.getElementById("Direccion").value,

      // Forzamos que el IDRol no cambie (usamos el que ya tenía)
      IDRol: datosOriginales.IDRol,
    };

    // Ahora sí, enviamos el objeto completo al servidor
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("¡Perfil actualizado sin perder datos!");
        // Actualizamos nuestro objeto local para futuras ediciones
        datosOriginales = updatedData;
      }
    } catch (error) {
      alert("Error de conexión");
    }
  });

  // --- 3. BORRAR CUENTA (DELETE) ---
  document.getElementById("deleteAccountBtn").addEventListener("click", async () => {
    if (confirm("¿Estás seguro? Esta acción no se puede deshacer.")) {
      try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          alert("Cuenta eliminada.");
          localStorage.clear();
          window.location.href = "/";
        }
      } catch (error) {
        alert("No se pudo eliminar la cuenta.");
      }
    }
  });
});
