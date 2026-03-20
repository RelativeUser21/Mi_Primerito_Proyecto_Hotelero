const database = require("../config/database");

const listRoles = async () => {
    const [rows] = await database.query("SELECT * FROM Roles WHERE IsActive = 1");
    return rows;
};

const createRol = async (data) => {
    const { Nombre, Estado } = data;
    const [result] = await database.query(
        "INSERT INTO Roles (Nombre, Estado, IsActive) VALUES (?, ?, 1)",
        [Nombre, Estado]
    );
    return result;
};

const updateRol = async (id, data) => {
    const { Nombre, Estado } = data;
    const [result] = await database.query(
        "UPDATE Roles SET Nombre = ?, Estado = ? WHERE IDRol = ?",
        [Nombre, Estado, id]
    );
    return result;
};

const deleteRol = async (id) => {
    const [result] = await database.query("UPDATE Roles SET IsActive = 0 WHERE IDRol = ?", [id]); // Nota: En roles es mejor usar "borrado lógico" (IsActive = 0) para no romper usuarios que ya tengan ese rol.
    return result;
};

module.exports = { listRoles, createRol, updateRol, deleteRol};