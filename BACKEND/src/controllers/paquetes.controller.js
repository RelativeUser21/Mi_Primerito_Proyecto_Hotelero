// Mover Archivo
const PaquetesService = require("../services/paquetes.service");

const PaquetesController = {

    listar: async (req, res) => {
        try {
            const data = await PaquetesService.listar();
            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            console.error("Error en paquetesController.listar:", error);
            return res.status(500).json({
                success: false,
                error: "Error listando paquetes",
                detalle: error.message
            });
        }
    },

    obtener: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await PaquetesService.obtener(id);
            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            console.error("Error en paquetesController.obtener:", error);
            return res.status(404).json({
                success: false,
                error: "Paquete no encontrado",
                detalle: error.message
            });
        }
    },

    crear: async (req, res) => {
        try {
            const result = await PaquetesService.crear(req.body);
            return res.status(201).json({
                success: true,
                mensaje: "Paquete creado correctamente",
                paqueteId: result.insertId
            });
        } catch (error) {
            console.error("Error en paquetesController.crear:", error);
            return res.status(400).json({
                success: false,
                error: "Error creando paquete",
                detalle: error.message
            });
        }
    },

    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PaquetesService.actualizar(id, req.body);
            return res.status(200).json({
                success: true,
                mensaje: "Paquete actualizado correctamente",
                affectedRows: result.affectedRows
            });
        } catch (error) {
            console.error("Error en paquetesController.actualizar:", error);
            return res.status(404).json({
                success: false,
                error: "Error actualizando paquete",
                detalle: error.message
            });
        }
    },

    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PaquetesService.eliminar(id);
            return res.status(200).json({
                success: true,
                mensaje: "Paquete eliminado correctamente",
                affectedRows: result.affectedRows
            });
        } catch (error) {
            console.error("Error en paquetesController.eliminar:", error);
            return res.status(404).json({
                success: false,
                error: "Error eliminando paquete",
                detalle: error.message
            });
        }
    },

    obtenerPorEstado: async (req, res) => {
        try {
            const { estado } = req.params;
            const paquetes = await PaquetesService.obtenerPorEstado(parseInt(estado));
            return res.status(200).json({
                success: true,
                data: paquetes
            });
        } catch (error) {
            console.error("Error en paquetesController.obtenerPorEstado:", error);
            return res.status(400).json({
                success: false,
                error: "Error obteniendo paquetes",
                detalle: error.message
            });
        }
    }

};

module.exports = PaquetesController;