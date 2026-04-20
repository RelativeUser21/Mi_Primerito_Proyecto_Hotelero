const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear formularios

// Carpeta pública para archivos estáticos (imágenes de habitaciones, etc.)
app.use(express.static(path.join(__dirname, '../public')));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// --- Importación de Rutas ---
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/password-reset", require("./routes/passwordReset.routes"));
app.use("/api/usuarios", require("./routes/usuarios.routes"));
app.use("/api/roles", require("./routes/roles.routes"));
// app.use("/api/clientes", require("./routes/clientes.routes")); 

// Middleware SPA: Servir index.html para rutas no API
app.use((req, res, next) => {
    // Si no es una ruta de API y no es un archivo estático, servir index.html
    if (!req.path.startsWith('/api') && req.path !== '/index.html') {
        const ext = path.extname(req.path);
        if (!ext || ext === '.html') {
            return res.sendFile(path.join(__dirname, '../../frontend/index.html'));
        }
    }
    next();
});

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

module.exports = app;