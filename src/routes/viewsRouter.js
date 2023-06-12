import { Router } from 'express';
import { ProductsModel } from '../DAO/models/products.model.js';

const router = Router();

router.get('/', async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const category = req.query.category || '';
  const sort = req.query.sort || '';

  const products = await ProductsModel.paginate(category,{page,limit,sort,lean:true});
 /*  const productsJson = JSON.stringify(products) */
  console.log(products)
/*   res.render('home', { productsJson }); */
  res.render('home', {
    products: products.docs,
    currentPage: products.page,
    totalPages: products.totalPages
  });
});

router.get('/realtimeProducts', async (req, res) => {
  const products = await ProductsModel.find({}).lean();
  res.render('realtimeProducts', { products });
});

export default router;
