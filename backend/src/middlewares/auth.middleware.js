const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "No se proporcionó un token." });
    }

    try {
        // Quitamos la palabra 'Bearer ' si viene incluida
        const pureToken = token.split(" ")[1] || token;
        const decoded = jwt.verify(pureToken, process.env.JWT_SECRET || "clave_secreta_provisional");
        
        req.user = decoded; // Guardamos los datos del usuario en la petición
        next(); // ¡Todo bien! Puedes pasar al controlador
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado." });
    }
};

module.exports = { verifyToken };