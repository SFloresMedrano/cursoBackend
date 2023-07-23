import CartService from '../services/cartService.js';

class CartController {
  async createCart(req, res) {
    try {
      if (!req.session.cart) {
        const cart = await CartService.createOne();
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
    const cid = req.params.cid;
    const cart = await CartService.getCart(cid);
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
  }
}

export const cartController = new CartController();
