import express from 'express';
import CartService from '../services/cartService.js';
const cartService = new CartService();
const cartRouter = express.Router();

// endpoint para leer los productos mongoose
cartRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartService.getCart(cartId);
    return res.render('carts',{cart})
  } catch (error) {
    return res.status(400).json({
      status: 'Error',
      msg: error.message,
    });
  }
});

//endpoint para agregar un carrito
cartRouter.post('/', async (req, res) => {
  try {
    const cart = await cartService.createOne();
    return res.status(200).json({
      status: 'Succes',
      msg: 'New Cart Created',
      data: { cart },
    });
  } catch {
    return res.status(400).json({
      status: 'Error',
      msg: "Can't create new cart. Please try again later",
    });
  }
});

//endpoint para agregar un producto
cartRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    await cartService.addProduct(cartId, productId);
    return res.status(200).json({
      status: 'Succes',
      msg: 'Product added',
    });
  } catch {
    return res.status(400).json({
      status: 'Error',
      msg: "Can't add new product. Please check the cart or product",
    });
  }
});

//endpoint para modificar cantidad por body
cartRouter.put('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const prodQuantity = req.body;
    await cartService.updateProductQuantity(cartId, productId, prodQuantity);
    return res.status(200).json({
      status: 'Succes',
      msg: 'Quantity update',
    });
  } catch (error) {
    return res.status(400).json({
      status: 'Error',
      msg: "Can't update quantity. Please check the cart, product or quantity",
    });
  }
});

//endpoint para borrar un product
cartRouter.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    await cartService.removeProduct(cartId, productId);
    return res.status(200).json({
      status: 'Succes',
      msg: 'Product removed',
    });
  } catch (error) {
    return res.status(400).json({
      status: 'Error',
      msg: "Can't remove the product. Please check the cart or product",
    });
  }
});

//endpoint para vaciar un carrito
cartRouter.delete('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    await cartService.clearCart(cartId);
    return res.status(200).json({
      status: 'Succes',
      msg: 'Emptied cart',
    });
  } catch (error) {
    return res.status(400).json({
      status: 'Error',
      msg: "Can't empty the cart. Please try again later",
    });
  }
});

export default cartRouter;
