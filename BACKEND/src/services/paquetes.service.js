// Mover Archivo
const Paquetes = require("../models/paquetes.model");

const PaquetesService = {

    listar: async () => {
        try {
            return await Paquetes.obtenerTodos();
        } catch (error) {
            throw new Error(`Error listando paquetes: ${error.message}`);
        }
    },

    obtener: async (id) => {
        try {
            if (!id || id <= 0) {
                throw new Error("ID de paquete inválido");
            }
            const paquete = await Paquetes.obtenerPorId(id);
            if (!paquete) {
                throw new Error("Paquete no encontrado");
            }
            return paquete;
        } catch (error) {
            throw new Error(`Error obteniendo paquete: ${error.message}`);
        }
    },

    crear: async (data) => {
        try {
            const { NombrePaquete, Descripcion, IDHabitacion, IDServicio, Precio } = data;

            if (!NombrePaquete || !NombrePaquete.trim()) {
                throw new Error("El nombre del paquete es requerido");
            }
            if (!Descripcion || !Descripcion.trim()) {
                throw new Error("La descripción es requerida");
            }
            if (!IDHabitacion || IDHabitacion <= 0) {
                throw new Error("IDHabitacion inválido");
            }
            if (!IDServicio || IDServicio <= 0) {
                throw new Error("IDServicio inválido");
            }
            if (Precio === undefined || Precio === null || Precio < 0) {
                throw new Error("Precio debe ser un número válido y no negativo");
            }

            return await Paquetes.crear(data);
        } catch (error) {
            throw new Error(`Error creando paquete: ${error.message}`);
        }
    },

    actualizar: async (id, data) => {
        try {
            if (!id || id <= 0) {
                throw new Error("ID de paquete inválido");
            }

            const paquete = await Paquetes.obtenerPorId(id);
            if (!paquete) {
                throw new Error("Paquete no encontrado");
            }

            const { NombrePaquete, Descripcion, IDHabitacion, IDServicio, Precio } = data;

            if (NombrePaquete && !NombrePaquete.trim()) {
                throw new Error("El nombre del paquete no puede estar vacío");
            }
            if (Descripcion && !Descripcion.trim()) {
                throw new Error("La descripción no puede estar vacía");
            }
            if (IDHabitacion && IDHabitacion <= 0) {
                throw new Error("IDHabitacion inválido");
            }
            if (IDServicio && IDServicio <= 0) {
                throw new Error("IDServicio inválido");
            }
            if (Precio !== undefined && Precio !== null && Precio < 0) {
                throw new Error("Precio no puede ser negativo");
            }

            return await Paquetes.actualizar(id, data);
        } catch (error) {
            throw new Error(`Error actualizando paquete: ${error.message}`);
        }
    },

    eliminar: async (id) => {
        try {
            if (!id || id <= 0) {
                throw new Error("ID de paquete inválido");
            }

            const paquete = await Paquetes.obtenerPorId(id);
            if (!paquete) {
                throw new Error("Paquete no encontrado");
            }

            return await Paquetes.eliminar(id);
        } catch (error) {
            throw new Error(`Error eliminando paquete: ${error.message}`);
        }
    },

    obtenerPorEstado: async (estado) => {
        try {
            if (estado !== 0 && estado !== 1) {
                throw new Error("Estado debe ser 0 o 1");
            }
            return await Paquetes.obtenerPorEstado(estado);
        } catch (error) {
            throw new Error(`Error obteniendo paquetes por estado: ${error.message}`);
        }
    }

};

module.exports = PaquetesService;