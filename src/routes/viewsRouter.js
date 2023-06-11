import { Router } from 'express';
import { ProductsModel } from '../DAO/models/products.model.js';

const router = Router();

router.get('/', async (req, res) => {
  const products = await ProductsModel.find({}).lean();
  res.render('home', { products });
});

router.get('/realtimeProducts', async (req, res) => {
  const products = await ProductsModel.find({}).lean();
  res.render('realtimeProducts', { products });
});

export default router;
