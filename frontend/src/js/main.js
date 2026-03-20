document.addEventListener("DOMContentLoaded", () => { //Esperar a que el html cargue por completo
  //IniciarSesion
  const loginForm = document.getElementById("loginForm");
  const errorContainer = document.getElementById("errorMessage"); // Referencia al nuevo div de recuperar contraseña

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Limpiar errores previos y ocultar el contenedor
      errorContainer.classList.add("hidden");
      errorContainer.innerHTML = "";

      const nombreUsuario = document.getElementById("username").value;
      const contrasena = document.getElementById("password").value;

      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            NombreUsuario: nombreUsuario,
            Contrasena: contrasena,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.usuario));
          window.location.href = "/dashboard.html";
        } else {
          // MOSTRAR ERROR SIN ALERT
          errorContainer.classList.remove("hidden");

          // Lógica específica para contraseña incorrecta
          if (data.message && data.message.toLowerCase().includes("contraseña")) {
            errorContainer.innerHTML = `
                            La contraseña es incorrecta. Inténtalo de nuevo. 
                            <br>
                            <a href="/recuperarpass.html" class="font-bold underline hover:text-red-800">¿Olvidaste tu contraseña?</a>
                        `;
          } else {
            // Error genérico (Usuario no existe, etc.)
            errorContainer.textContent = data.message || "Error al iniciar sesión";
          }
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        errorContainer.classList.remove("hidden");
        errorContainer.textContent = "No se pudo conectar con el servidor. Inténtalo más tarde.";
      }
    });
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------
  //RegistrarUsuario
  const registerForm = document.getElementById("registerForm");
  const registerError = document.getElementById("registerError");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Limpiar errores previos
      registerError.classList.add("hidden");
      registerError.textContent = "";

      const userData = {
        NombreUsuario: document.getElementById("reg_username").value,
        Contrasena: document.getElementById("reg_password").value,
        Nombre: document.getElementById("reg_nombre").value,
        Apellido: document.getElementById("reg_apellido").value,
        Email: document.getElementById("reg_email").value,
        TipoDocumento: document.getElementById("reg_tipoDoc").value,
        NumeroDocumento: parseInt(document.getElementById("reg_numDoc").value),
        Telefono: document.getElementById("reg_telefono").value,
        Pais: document.getElementById("reg_pais").value,
        Direccion: document.getElementById("reg_direccion").value,
        IDRol: 2,
        IDRol: 2,
      };

      try {
        const response = await fetch("http://localhost:3000/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          // En lugar de alert, podrías mostrar un mensaje de éxito verde antes de redirigir
          registerError.classList.remove("hidden", "bg-red-50", "text-red-600", "border-red-200");
          registerError.classList.add("bg-green-50", "text-green-600", "border-green-200");
          registerError.textContent = "¡Registro exitoso! Redirigiendo...";

          setTimeout(() => {
            window.location.href = "/index.html";
          }, 2000);
        } else {
          const errorData = await response.json();
          registerError.classList.remove("hidden");
          // Mostramos el error específico que viene del servidor
          registerError.textContent = errorData.error || "Error al crear la cuenta. Inténtalo de nuevo.";
        }
      } catch (error) {
        registerError.classList.remove("hidden");
        registerError.textContent = "Error de conexión con el servidor.";
      }
    });
  }

  //----------------------------------------------------------------------------------------------------------------------------------------------------------------
  //RecuperarContraseña
  const recoverForm = document.getElementById("recoverForm");
  const recoverMessage = document.getElementById("recoverMessage");

  if (recoverForm) {
    recoverForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("recoverEmail").value;

      // Simulación de envío
      recoverMessage.classList.remove("hidden", "bg-red-50", "text-red-600");
      recoverMessage.classList.add("bg-green-50", "text-green-600", "border", "border-green-200");
      recoverMessage.innerHTML = `Se ha enviado un enlace a ${email}. <br>Revisa tu bandeja de entrada.`;

      // Opcional: Deshabilitar el botón para que no lo pulsen mil veces
      const btn = recoverForm.querySelector("button");
      btn.disabled = true;
      btn.classList.add("opacity-50", "cursor-not-allowed");
    });
  }
});


