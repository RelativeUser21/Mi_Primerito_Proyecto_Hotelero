// Mover Archivo
const db = require("../config/db");

const Paquetes = {

    obtenerTodos: async () => {
        const [rows] = await db.query(`
            SELECT
                p.IDPaquete,
                p.NombrePaquete,
                p.Descripcion,
                p.Precio,
                p.Estado,
                p.ImagenPaquete,
                h.IDHabitacion,
                h.NombreHabitacion,
                h.Costo AS CostoHabitacion,
                s.IDServicio,
                s.NombreServicio,
                s.Costo AS CostoServicio
            FROM Paquetes p
            INNER JOIN Habitacion h ON p.IDHabitacion = h.IDHabitacion
            INNER JOIN Servicios s ON p.IDServicio = s.IDServicio
            ORDER BY p.IDPaquete DESC
        `);
        return rows;
    },

    obtenerPorId: async (id) => {
        const [rows] = await db.query(`
            SELECT
                p.IDPaquete,
                p.NombrePaquete,
                p.Descripcion,
                p.Precio,
                p.Estado,
                p.ImagenPaquete,
                h.IDHabitacion,
                h.NombreHabitacion,
                h.Costo AS CostoHabitacion,
                s.IDServicio,
                s.NombreServicio,
                s.Costo AS CostoServicio
            FROM Paquetes p
            INNER JOIN Habitacion h ON p.IDHabitacion = h.IDHabitacion
            INNER JOIN Servicios s ON p.IDServicio = s.IDServicio
            WHERE p.IDPaquete = ?
        `, [id]);
        return rows[0];
    },

    crear: async (paquete) => {
        const {
            NombrePaquete,
            Descripcion,
            IDHabitacion,
            IDServicio,
            Precio,
            Estado = 1,
            ImagenPaquete = null
        } = paquete;

        const sql = `
            INSERT INTO Paquetes
            (NombrePaquete, Descripcion, IDHabitacion, IDServicio, Precio, Estado, ImagenPaquete)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            NombrePaquete,
            Descripcion,
            IDHabitacion,
            IDServicio,
            Precio,
            Estado,
            ImagenPaquete
        ]);

        return result;
    },

    actualizar: async (id, paquete) => {
        const {
            NombrePaquete,
            Descripcion,
            IDHabitacion,
            IDServicio,
            Precio,
            Estado = 1,
            ImagenPaquete = null
        } = paquete;

        const sql = `
            UPDATE Paquetes
            SET 
                NombrePaquete = ?,
                Descripcion = ?,
                IDHabitacion = ?,
                IDServicio = ?,
                Precio = ?,
                Estado = ?,
                ImagenPaquete = ?
            WHERE IDPaquete = ?
        `;

        const [result] = await db.query(sql, [
            NombrePaquete,
            Descripcion,
            IDHabitacion,
            IDServicio,
            Precio,
            Estado,
            ImagenPaquete,
            id
        ]);

        return result;
    },

    eliminar: async (id) => {
        const [result] = await db.query(
            "DELETE FROM Paquetes WHERE IDPaquete = ?",
            [id]
        );
        return result;
    },

    obtenerPorEstado: async (estado) => {
        const [rows] = await db.query(`
            SELECT
                p.IDPaquete,
                p.NombrePaquete,
                p.Descripcion,
                p.Precio,
                p.Estado,
                p.ImagenPaquete,
                h.IDHabitacion,
                h.NombreHabitacion,
                s.IDServicio,
                s.NombreServicio
            FROM Paquetes p
            INNER JOIN Habitacion h ON p.IDHabitacion = h.IDHabitacion
            INNER JOIN Servicios s ON p.IDServicio = s.IDServicio
            WHERE p.Estado = ?
            ORDER BY p.NombrePaquete ASC
        `, [estado]);
        return rows;
    }

};

module.exports = Paquetes;

        return result;

    },

    actualizar: async (id, paquete) => {

        const {
            NombrePaquete,
            Descripcion,
            IDHabitacion,
            IDServicio,
            Precio,
            Estado,
            IDCliente,
            ImagenURL = null
        } = paquete;

        const sql = `
            UPDATE Paquetes
            SET NombrePaquete=?, Descripcion=?, IDHabitacion=?, IDServicio=?, Precio=?, Estado=?, IDCliente=?, ImagenURL=?
            WHERE IDPaquete=?
        `;

        const [result] = await db.query(sql, [
            NombrePaquete,
            Descripcion,
            IDHabitacion,
            IDServicio,
            Precio,
            Estado,
            IDCliente,
            ImagenURL,
            id
        ]);

        return result;

    },

    eliminar: async (id) => {

        const [result] = await db.query(
            "DELETE FROM Paquetes WHERE IDPaquete=?",
            [id]
        );

        return result;

    }

};

module.exports = Paquetes;