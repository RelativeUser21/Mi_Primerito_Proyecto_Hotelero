// Mover Archivo
const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");

router.get("/estadisticas", dashboardController.estadisticas);

router.get("/total-reservas", dashboardController.totalReservas);

router.get("/ingresos", dashboardController.ingresos);

router.get("/reservas-hoy", dashboardController.reservasHoy);

router.get("/habitaciones-disponibles", dashboardController.habitacionesDisponibles);

module.exports = router;