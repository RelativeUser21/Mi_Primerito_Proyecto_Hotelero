// Mover Archivo
const express = require("express");

const router = express.Router();

const PaquetesController = require("../controllers/paquetes.controller");

// GET todos los paquetes
router.get("/", PaquetesController.listar);

// GET paquetes por estado (DEBE ir antes de /:id)
router.get("/estado/:estado", PaquetesController.obtenerPorEstado);

// GET paquete por id
router.get("/:id", PaquetesController.obtener);

// POST crear paquete
router.post("/", PaquetesController.crear);

// PUT actualizar paquete
router.put("/:id", PaquetesController.actualizar);

// DELETE eliminar paquete
router.delete("/:id", PaquetesController.eliminar);

module.exports = router;