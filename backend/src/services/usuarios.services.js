const database = require("../config/database");

const listUsuarios = async () => {
    try {
        // Asegúrate de que los nombres coincidan exactamente con tu CREATE TABLE
        const query = `
            SELECT u.*, r.Nombre as NombreRol 
            FROM Usuarios u
            LEFT JOIN Roles r ON u.IDRol = r.IDRol
        `;
        const [rows] = await database.query(query);
        return rows;
    } catch (error) {
        console.error("Error exacto en la database:", error.sqlMessage); // Esto te dirá el error real en la terminal
        throw error; 
    }
};

const getUsuarioById = async (id) => {
    const query = `
        SELECT u.*, r.Nombre as NombreRol 
        FROM Usuarios u
        LEFT JOIN Roles r ON u.IDRol = r.IDRol
        WHERE u.IDUsuario = ?
    `;
    const [rows] = await database.query(query, [id]);
    return rows[0]; // Retornamos solo el primer objeto, no el array
};

const createUsuario = async (data) => {
    const { 
        NombreUsuario, Contrasena, Nombre, Apellido, Email, 
        TipoDocumento, NumeroDocumento, Telefono, Pais, Direccion
    } = data;

    // Forzamos el IDRol a 2 (o el ID que corresponda a 'Cliente' en tu DB)
    const IDRol = 2; 
    //Nota: Aqui en el futuro hay que encriptar la contraseña
    const [result] = await database.query(
        `INSERT INTO Usuarios (NombreUsuario, Contrasena, Nombre, Apellido, Email, TipoDocumento, NumeroDocumento, Telefono, Pais, Direccion, IDRol) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [NombreUsuario, Contrasena, Nombre, Apellido, Email, TipoDocumento, NumeroDocumento, Telefono, Pais, Direccion, IDRol]
    );
    return result;
};


const updateUsuario = async (id, data) => {
    const { NombreUsuario, Nombre, Apellido, Email, TipoDocumento, NumeroDocumento, Telefono, Pais, Direccion, IDRol } = data;
    const [result] = await database.query(
        "UPDATE Usuarios SET NombreUsuario = ?, Nombre = ?, Apellido = ?, Email = ?, TipoDocumento = ?, numeroDocumento = ?, Telefono = ?, Pais = ?, Direccion = ?, IDRol = ? WHERE IDUsuario = ?",
        [NombreUsuario, Nombre, Apellido, Email, TipoDocumento, NumeroDocumento, Telefono, Pais, Direccion, IDRol, id]
    );
    return result;
};

const deleteUsuario = async (id) => {
    const [result] = await database.query("DELETE FROM Usuarios WHERE IDUsuario = ?", [id]);
    return result;
};


module.exports = { listUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario };