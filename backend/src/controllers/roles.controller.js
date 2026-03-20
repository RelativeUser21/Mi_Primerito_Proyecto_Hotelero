const rolesService = require("../services/roles.services");

const list = async (req, res) => {
  try {
    const roles = await rolesService.listRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: "Error al listar roles" });
  }
};

const create = async (req, res) => {
  try {
    await rolesService.createRol(req.body);
    res.status(201).json({ message: "Rol creado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear rol" });
  }
};

module.exports = { list, create };
