import express from 'express';
import { Router } from 'express';
import { cartController } from '../controllers/carts.controller.js';
import { viewsController } from '../controllers/views.controller.js';
import { productsController } from '../controllers/products.controller.js';


const router = Router();

router.get('/', viewsController.redirect);

router.get('/realtimeProducts', viewsController.getRealTimeProducts);

router.get('/products', viewsController.getProducts);

router.get('/carts/:cid', cartController.getCart);

router.get('/products/:pid', productsController.getProduct);

export default router;
