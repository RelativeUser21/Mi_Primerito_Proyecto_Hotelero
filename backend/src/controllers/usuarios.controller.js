const usuarioService = require("../services/usuarios.services");

const list = async (req, res) => {
  try {
    const usuarios = await usuarioService.listUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al listar usuarios" });
  }
};

const getById = async (req, res) => {
    try {
        const usuarios = await usuarioService.getUsuarioById(req.params.id);
        if (!usuarios) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuario" });
    }
};

const create = async (req, res) => {
  try {
    await usuarioService.createUsuario(req.body);
    res.status(201).json({ message: "Usuario creada con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el Usuario" });
  }
};

const update = async (req, res) => {
    try {
        await usuarioService.updateUsuario(req.params.id, req.body);
        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
};

const remove = async (req, res) => {
    try {
        await usuarioService.deleteUsuario(req.params.id);
        res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
};

module.exports = { list, getById, create, update, remove};