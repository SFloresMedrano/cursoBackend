import express from 'express';
import { productsController } from '../controllers/products.controller.js';
import { viewsController } from '../controllers/views.controller.js';

const productsRouter = express.Router();

// middleware para leer los productos
productsRouter.get('/', productsController.getAllProducts);

productsRouter.get('/:pid', productsController.getProduct);

//middleware para crear un producto con mongoose

productsRouter.post('/', productsController.addProduct);

//middleware para borrar un elemento en MongoDB

productsRouter.delete('/:pid',productsController.deleteProduct);

export default productsRouter;
