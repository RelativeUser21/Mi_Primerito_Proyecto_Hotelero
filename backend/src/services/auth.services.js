const database = require("../config/database");
const jwt = require("jsonwebtoken");

const login = async (nombreUsuario, contrasena) => {
    // 1. Buscar el usuario
    const [rows] = await database.query(
        "SELECT * FROM Usuarios WHERE NombreUsuario = ?", 
        [nombreUsuario]
    );

    if (rows.length === 0) return { error: "Usuario no encontrado" };

    const usuario = rows[0];

    // 2. Verificar contraseña (aquí comparamos directo por ahora)
    if (contrasena !== usuario.Contrasena) {
        return { error: "Contraseña incorrecta" };
    }

    // 3. Generar Token (el "pase" para el front)
    const token = jwt.sign(
        { id: usuario.IDUsuario, rol: usuario.IDRol },
        process.env.JWT_SECRET || "clave_secreta_provisional",
        { expiresIn: "2h" }
    );

    return { token, usuario: { id: usuario.IDUsuario, nombre: usuario.NombreUsuario, rol: usuario.IDRol } };
};

module.exports = { login };