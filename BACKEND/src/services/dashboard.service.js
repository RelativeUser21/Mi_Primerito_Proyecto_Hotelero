// Mover Archivo
const db = require("../config/db");

const DashboardService = {

    getTotalReservas: async () => {
        try {
            const [rows] = await db.query("SELECT COUNT(*) AS total FROM Reserva");
            return rows[0]?.total || 0;
        } catch (error) {
            throw new Error(`Error obteniendo total de reservas: ${error.message}`);
        }
    },

    getIngresosTotales: async () => {
        try {
            const [rows] = await db.query("SELECT SUM(MontoTotal) AS ingresos FROM Reserva WHERE IdEstadoReserva = 1");
            return rows[0]?.ingresos || 0;
        } catch (error) {
            throw new Error(`Error obteniendo ingresos totales: ${error.message}`);
        }
    },

    getReservasHoy: async () => {
        try {
            const [rows] = await db.query("SELECT COUNT(*) AS reservasHoy FROM Reserva WHERE DATE(FechaReserva) = CURDATE()");
            return rows[0]?.reservasHoy || 0;
        } catch (error) {
            throw new Error(`Error obteniendo reservas de hoy: ${error.message}`);
        }
    },

    getHabitacionesDisponibles: async () => {
        try {
            const [rows] = await db.query("SELECT COUNT(*) AS disponibles FROM Habitacion WHERE Estado = 1");
            return rows[0]?.disponibles || 0;
        } catch (error) {
            throw new Error(`Error obteniendo habitaciones disponibles: ${error.message}`);
        }
    },

    estadisticas: async () => {

        try {
            // total reservas
            const [reservas] = await db.query(`
                SELECT COUNT(*) AS totalReservas
                FROM Reserva
            `);

            // ingresos totales
            const [ingresos] = await db.query(`
                SELECT SUM(MontoTotal) AS ingresosTotales
                FROM Reserva
                WHERE IdEstadoReserva = 1
            `);

            // habitaciones más reservadas
            const [habitaciones] = await db.query(`
                SELECT 
                    h.NombreHabitacion,
                    COUNT(r.IDHabitacion) AS total
                FROM Reserva r
                JOIN Habitacion h 
                ON r.IDHabitacion = h.IDHabitacion
                GROUP BY r.IDHabitacion
                ORDER BY total DESC
                LIMIT 5
            `);

            // servicios más vendidos
            const [servicios] = await db.query(`
                SELECT 
                    s.NombreServicio,
                    COUNT(d.IDServicio) AS total
                FROM DetalleReservaServicio d
                JOIN Servicios s
                ON d.IDServicio = s.IDServicio
                GROUP BY d.IDServicio
                ORDER BY total DESC
                LIMIT 5
            `);

            return {
                totalReservas: reservas[0].totalReservas,
                ingresosTotales: ingresos[0].ingresosTotales || 0,
                habitacionesMasReservadas: habitaciones,
                serviciosMasVendidos: servicios
            };

        } catch (error) {
            throw new Error(`Error obteniendo estadísticas: ${error.message}`);
        }

    }

};

module.exports = DashboardService;