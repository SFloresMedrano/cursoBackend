import {cartService} from '../services/cartService.js';

class CartController {
  async createCart(req, res) {
    try {
      if (!req.session.cart) {
        const cart = await cartService.createOne();
        req.session.cart = cart._id;
        return res.status(201).json({ cart });
      } else {
        cart = req.session.cart;
        return res.status(201).json({ cart });
      }
    } catch (error) {
      console.log('Couldnt create Cart');
      return res.status(500).json({ msg: 'Couldnt create Cart' });
    }
  }

  async getCart(req, res) {
    try {
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
    } catch (error) {
      return res.status(400).json({
        status: 'Error',
        msg: error.message,
      });
    }
  }
  async addProductToCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      await cartService.addProduct(cartId, productId);
      return res.status(200).json({
        status: 'Success',
        msg: 'Product added',
      });
    } catch {
      return res.status(400).json({
        status: 'Error',
        msg: "Can't add new product. Please check the cart or product",
      });
    }
  }

  async updateProductQuantity(req, res) {
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
  }
  async deleteProductFromCart(req, res) {
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
  }

  async emptyCart(req, res) {
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
  }
}

export const cartController = new CartController();
