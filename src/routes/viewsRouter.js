import { Router } from 'express';
import { ProductsModel } from '../DAO/models/products.model.js';
import ProductService from '../services/productsService.js';
import CartService from '../services/cartService.js';
const cartService = new CartService();

const productService = new ProductService();

const router = Router();

router.get('/', async (req, res) => {
  if(!req.session.cart){
    const cart = await cartService.createOne();
    req.session.cart = cart._id;
  }
  res.redirect('/api/sessions')
});

router.get('/realtimeProducts', async (req, res) => {
  const products = await ProductsModel.find({}).lean();
  res.render('realtimeProducts', { products });
});

router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const queryParams = { limit, page, sort, query };
    const first_name = req.session.user.first_name;
    const last_name = req.session.user.last_name;
    const isAdmin = req.session.user.isAdmin || '';
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
      prevLink: prevLink?.substring(4) || '',
      nextLink: nextLink?.substring(4) || '',
      first_name,
      last_name,
      isAdmin,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', message: 'Error in server' });
  }
});

router.get('/carts/:cid', async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartService.getCart(cid);
  const simplifiedCart = cart.products.map((item) => {
    return {
      title: item.product.title,
      description: item.product.description,
      price: item.product.price,
      code: item.product.code,
      category: item.product.category,
      quantity: item.product.quantity,
      id: item.product._id,
    };
  });
  res.render('carts', { cart: simplifiedCart });
});

router.get('/products/:pid', async (req, res) => {
  const pid = req.params.pid;
  const product = await productService.getOne(pid);
  const simplifiedProduct = {
    title: product.title,
    description: product.description,
    price: product.price,
    code: product.code,
    category: product.category,
    quantity: product.quantity,
    id: product._id,
  };

  return res.render('detail', { product: simplifiedProduct });
});
export default router;
