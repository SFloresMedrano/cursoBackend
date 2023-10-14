import { v4 } from 'uuid';
import { cartService } from '../services/cartService.js';
import { productService } from '../services/productsService.js';
import { ticketService } from '../services/ticketsService.js';
import { enviarTicket, logger } from '../utils.js';
import { cartController } from './carts.controller.js';

class TicketController {
  async createTicket(req, res) {
    const cartId = req.session.user.cart;
    const cart = await cartService.getCart(cartId);
    const products = cart.products;

    let productsInStock = [];
    let productsNotStock = [];

    const productPromises = products.map(async (item) => {
      const pid = item.product._id.toString();
      const productStock = await productService.getOne(pid);
      if (productStock.stock >= item.quantity) {
        productsInStock.push(item);
        productStock.stock -= item.quantity;
        await productStock.save();
      } else {
        productsNotStock.push(item);
      }
    });

    await Promise.all(productPromises);
    const ticket = {};
    const code = v4();
    const amount = productsInStock.map(
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
    ticket.products = productsInStock;
    ticket.productsNotPurchased = productsNotStock;
    if (ticket.products.length == 0) {
      return res.status(400).json({
        status: 'No stock available',
        data: {},
        msg: 'No stock',
      });
    } else {
    }
    const response = await ticketService.createTicket(ticket);
    if (response) {
      logger.info(
        `Ticket created at ${ticket.datetime} - Purchaser: ${ticket.purchaser}`
      );
      cartService.clearCart(cartId);
      enviarTicket(ticket);
      return res.status(200).json({
        status: 'Ticket created',
        data: { response },
        msg: 'Ticket created',
      });
    } else {
      logger.fatal(
        `Couldnt create Ticket ${ticket.datetime}- Purchaser: ${ticket.purchaser}`
      );
      return res.status(400).json({
        status: 'Error creating Ticket created',
        data: {},
        msg: 'Ticket not created',
      });
    }
  }
}

export const ticketsController = new TicketController();
