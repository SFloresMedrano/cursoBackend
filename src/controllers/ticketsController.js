import { cartService } from '../services/cartService.js';
import { productService } from '../services/productsService.js';
import { v4 } from 'uuid';

class TicketController {
  async checkStock(products) {
    let productsInStock = [];
    let productsNotStock = [];
    const productPromises = products.map(async (item) => {
      const pid = item.product._id.toString();
      const productStock = await productService.getOne(pid);
      console.log(productStock, 'productStock');

      if (productStock.quantity >= item.quantity) {
        console.log(item, 'item');
        productsInStock.push(item);
        productStock.quantity -= item.quantity;
        await productStock.save();
      } else {
        productsNotStock.push(item);
      }
    });

    
    await Promise.all(productPromises);

    return { productsPurchase: productsInStock }, { productsNotStock };
  }

  async createTicket(req, res) {
    const cartId = req.session.user.cart;
    const cart = await cartService.getCart(cartId);
    const products = cart.products;
    const { productsPurchase, productsNotStock } =
      ticketsController.checkStock(products);
    console.log(productsPurchase, productsNotStock);
    const ticket = {};
    const code = v4();
    const amount = productsPurchase.map(
      (item) => item.product.price * item.quantity
    );
    ticket.code = code;
    ticket.email = req.session.user.email;
    ticket.datetime = Date().toString('yyyy-MM-dd-hh-mm-ss');
    ticket.amount = amount.reduce(
      (total, currentValue) => total + currentValue,
      0
    );
    ticket.purchaser = req.session.user.email;
    console.log(ticket);
    /* const response = await ticketService.createTicket(ticket); */
    return ticket;
  }
}

export const ticketsController = new TicketController();
