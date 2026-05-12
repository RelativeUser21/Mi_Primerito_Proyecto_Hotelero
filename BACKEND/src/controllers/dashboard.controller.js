// Mover Archivo
const DashboardService = require("../services/dashboard.service");

const estadisticas = async (req, res) => {
    try {
        const data = await DashboardService.estadisticas();
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Error en dashboard.controller.estadisticas:", error);
        return res.status(500).json({
            success: false,
            error: "Error obteniendo estadísticas",
            detalle: error.message
        });
    }
};

const totalReservas = async (req, res) => {
    try {
        const total = await DashboardService.getTotalReservas();
        return res.status(200).json({
            success: true,
            total
        });
    } catch (error) {
        console.error("Error en dashboard.controller.totalReservas:", error);
        return res.status(500).json({
            success: false,
            error: "Error obteniendo total de reservas",
            detalle: error.message
        });
    }
};

const ingresos = async (req, res) => {
    try {
        const ingresosTotales = await DashboardService.getIngresosTotales();
        return res.status(200).json({
            success: true,
            ingresosTotales
        });
    } catch (error) {
        console.error("Error en dashboard.controller.ingresos:", error);
        return res.status(500).json({
            success: false,
            error: "Error obteniendo ingresos totales",
            detalle: error.message
        });
    }
};

const reservasHoy = async (req, res) => {
    try {
        const reservasHoy = await DashboardService.getReservasHoy();
        return res.status(200).json({
            success: true,
            reservasHoy
        });
    } catch (error) {
        console.error("Error en dashboard.controller.reservasHoy:", error);
        return res.status(500).json({
            success: false,
            error: "Error obteniendo reservas de hoy",
            detalle: error.message
        });
    }
};

const habitacionesDisponibles = async (req, res) => {
    try {
        const disponibles = await DashboardService.getHabitacionesDisponibles();
        return res.status(200).json({
            success: true,
            disponibles
        });
    } catch (error) {
        console.error("Error en dashboard.controller.habitacionesDisponibles:", error);
        return res.status(500).json({
            success: false,
            error: "Error obteniendo habitaciones disponibles",
            detalle: error.message
        });
    }
};

module.exports = {
    estadisticas,
    totalReservas,
    ingresos,
    reservasHoy,
    habitacionesDisponibles
};