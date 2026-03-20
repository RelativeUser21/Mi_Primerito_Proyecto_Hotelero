const authService = require("../services/auth.services");

const login = async (req, res) => {
    const { NombreUsuario, Contrasena } = req.body;
    try {
        const result = await authService.login(NombreUsuario, Contrasena);
        
        if (result.error) {
            return res.status(401).json({ message: result.error });
        }

        res.json({ message: "Login exitoso", token: result.token, usuario: result.usuario });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
};

module.exports = { login };