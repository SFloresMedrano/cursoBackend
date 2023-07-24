import express, { Router } from 'express';
import { cartController } from '../controllers/carts.controller.js';
export const cartRouter = new Router();

// endpoint para leer los productos mongoose
cartRouter.get('/:cid', cartController.getCart);

//endpoint para agregar un carrito
cartRouter.post('/', cartController.createCart);

//endpoint para agregar un producto
cartRouter.post('/:cid/product/:pid', cartController.addProductToCart);

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
