import { CartModel } from '../DAO/models/carts.model.js';
import { ProductsModel } from '../DAO/models/products.model.js';

class CartService {
  async createOne() {
    const createCart = await CartModel.create({});
    return createCart;
  }

  async getCart(cartId) {
    const cart = await CartModel.findById(cartId).populate('products.product');
    if (cart) {
      return cart;
    } else {
      throw new Error('Cart not found');
    }
  }

  async addProduct(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      const product = await ProductsModel.findById(productId);
      const prodIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (!cart) {
        throw new Error('Cart not found');
      }
      if (!product) {
        throw new Error('Product not found');
      }
      if (prodIndex === -1) {
        cart.products.push({ product: product._id, quantity: 1 });
      } else {
        cart.products[prodIndex].quantity =
          cart.products[prodIndex].quantity + 1;
      }
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Couldnt add product. Please try again later');
    }
  }

  async udpdateCart(cartId, products) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products },
        { new: true }
      );
      return cart;
    } catch (error) {
      throw new Error('Error updating Cart.Please try again later');
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await CartModel.findById(cartId);
      const prodIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (prodIndex === -1 || quantity === 0) {
        throw new Error('Product not found in cart or quantity not');
      }
      cart.products[prodIndex].quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error updating product quantity');
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      const prodIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (prodIndex === -1) {
        throw new Error('Product not found in cart');
      }
      cart.products.splice(prodIndex, 1);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Couldnt remove product from cart.');
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      cart.products = [];
      await cart.save();
    } catch (error) {
      throw new Error('Couldnt empty cart.');
    }
  }
}

export const cartService = new CartService();
