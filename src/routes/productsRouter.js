import express from 'express';
import { productsController } from '../controllers/products.controller.js';
import { uploader } from '../utils.js';

const productsRouter = express.Router();


// middleware para leer los productos
productsRouter.get('/', productsController.getAllProducts);

productsRouter.get('/:pid', productsController.getProduct);

//middleware para crear un producto con mongoose
productsRouter.post('/', uploader.single('file'),productsController.addProduct)

//middleware para borrar un elemento en MongoDB

productsRouter.delete('/:pid', productsController.deleteProduct);

export default productsRouter;
