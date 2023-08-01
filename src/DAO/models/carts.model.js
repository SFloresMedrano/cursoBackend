import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'products',
        },
        quantity: { type: Number, min: 1, default: 1 },
      },
    ],
    default: [],
  },
});

export const CartModel = model('cart', cartSchema);

export class CartModelLogic {
  async cartSave(cart) {
    return await cart.save();
  }

  async createCart(req, res) {
    try {
      const cart = await CartModel.create({});
      return cart;
    } catch (error) {
      throw 'Error creating cart';
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId).populate(
        'products.product'
      );
      return cart;
    } catch (error) {
      throw 'Couldnt get cart. Please check ID';
    }
  }

  async cartUpdate(cartId, products) {
    const cart = await CartModel.findByIdAndUpdate(
      cartId,
      { products },
      { new: true }
    );
    await cart.save();
    return cart;
  }

  async clearCart(cartId) {
    const cart = await CartModel.findById(cartId);
    cart.products = [];
    await cart.save();
    return cart;
  }
}

export const cartModelLogic = new CartModelLogic();
