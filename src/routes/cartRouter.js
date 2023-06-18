import express from 'express';
import CartService from '../services/cartService.js';
const cartService = new CartService();
const cartRouter = express.Router();

// middleware para leer los productos mongoose
cartRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartService.getCart(cartId);
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(400).json({
      status: 'Error',
      msg: error.message,
    });
  }
});

cartRouter.post('/', async (req, res) => {
  try {
    await CM.addCart();
    return res.status(200).json({
      status: 'Succes',
      msg: 'New Cart Created',
    });
  } catch {
    return res.status(400).json({
      status: 'Error',
      msg: "Can't create new cart. Please try again later",
    });
  }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productCode = parseInt(req.params.pid);
    await CM.addProductToCart(cartId, productCode);
    return res.status(200).json({
      status: 'Succes',
      msg: 'Proudct added',
    });
  } catch {
    return res.status(400).json({
      status: 'Error',
      msg: "Can't add new product. Please check the cart or product",
    });
  }
});

export default cartRouter;
