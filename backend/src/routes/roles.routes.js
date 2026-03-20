//Importar la libreria express
const express = require('express');
const router = express.Router();  //crear una instancia del router de express
const controller = require('../controllers/roles.controller'); //Importar el controlador de productos

//definir las rutas para los productos
router.get('/', controller.list); 
router.post('/', controller.create);
//! router.put('/:id', controller.update);
//! router.delete('/:id', controller.remove);

//exportar el router
module.exports = router;