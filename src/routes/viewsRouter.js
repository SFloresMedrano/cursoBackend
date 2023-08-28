import { Router } from 'express';
import { cartController } from '../controllers/carts.controller.js';
import { productsController } from '../controllers/products.controller.js';
import { viewsController } from '../controllers/views.controller.js';
import { isAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', viewsController.redirect);

router.get('/realtimeProducts', viewsController.getRealTimeProducts);

router.get('/products', viewsController.getProducts);

router.get('/productsform', isAdmin, viewsController.productForm);

router.get('/carts/:cid', cartController.getCart);

router.get('/products/:pid', productsController.getProduct);

router.get('/user', viewsController.getCurrentUser);

export default router;
