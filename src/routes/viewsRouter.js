import { Router } from 'express';
import ProductManager from '../productManager.js';
import { ProductsModel } from '../DAO/models/products.model.js';

const PM = new ProductManager('./src/products.json', './src/id.json');
const router = Router();

router.get('/', async (req, res) => {
  const products = await ProductsModel.find({}).lean();
  console.log(products);
  res.render('home', { products });
});

router.get('/realtimeProducts', async (req, res) => {
  const products = await ProductsModel.find({}).lean();
  res.render('realtimeProducts', { products });
});

export default router;
