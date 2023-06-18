import { Router } from 'express';
import { ProductsModel } from '../DAO/models/products.model.js';
import ProductService from '../services/productsService.js';

const productService = new ProductService();

const router = Router();

router.get('/', async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const category = req.query.category || '';
  const sort = req.query.sort || '';

  const products = await ProductsModel.paginate(category,{page,limit,sort,lean:true});
  res.render('products', {
    products: products.docs,
    currentPage: products.page,
    totalPages: products.totalPages
  });
});

router.get('/realtimeProducts', async (req, res) => {
  const products = await ProductsModel.find({}).lean();
  res.render('realtimeProducts', { products });
});

router.get('/products', async (req, res) => {
  try {
    const {limit = 10, page = 1, sort, query} = req.query;
    const queryParams = {limit, page, sort, query};
    const {
        payload: products,
        totalPages,
        payload,
        prevPage,
        nextPage,
        page: currentPage,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
    } = await productService.get(queryParams);
    let productsSimplified = products.map((item) => {
        return {
            _id: item._id.toString(),
            title: item.title,
            description: item.description,
            price: item.price,
            code: item.code,
            stock: item.stock,
            category: item.category,
        };
    });
    return res.render('products', {
        products: productsSimplified,
        totalPages,
        prevPage,
        nextPage,
        currentPage,
        hasPrevPage,
        hasNextPage,
        prevLink: prevLink?.substring(4) || "",
        nextLink: nextLink?.substring(4) || "",
    });
} catch (error) {
    return res.status(500).json({status: 'error', message: 'Error in server'});
}
});
export default router;
