const database = require("../config/database");
const jwt = require("jsonwebtoken");

const login = async (email, contrasena) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido");
  }

  const query = `
        SELECT u.*, r.Nombre as RolNombre, r.IsActive as RolIsActive, r.Permisos
        FROM Usuarios u
        LEFT JOIN Roles r ON u.IDRol = r.IDRol
        WHERE u.Email = ?
    `;
  const [rows] = await database.query(query, [email]);

  if (rows.length === 0) return { error: "Usuario no encontrado" };

  const usuario = rows[0];

  if (usuario.IsActive === 0) {
    return { error: "Esta cuenta está desactivada" };
  }

  if (usuario.RolIsActive === 0) {
    return { error: "El rol asociado a esta cuenta está desactivado" };
  }

  if (contrasena !== usuario.Contrasena) {
    return { error: "Contraseña incorrecta" };
  }

  let permisos = [];
  if (usuario.Permisos) {
    try {
      permisos = typeof usuario.Permisos === "string" ? JSON.parse(usuario.Permisos) : usuario.Permisos;
    } catch (e) {
      permisos = [];
    }
  }

  const token = jwt.sign({ id: usuario.IDUsuario, rol: usuario.IDRol }, process.env.JWT_SECRET, { expiresIn: "2h" });

  return {
    token,
    usuario: {
      id: usuario.IDUsuario,
      nombre: usuario.Email,
      rol: usuario.IDRol,
      IDRol: usuario.IDRol,
      rolNombre: usuario.RolNombre,
      permisos: permisos,
    },
  };
};

module.exports = { login };
