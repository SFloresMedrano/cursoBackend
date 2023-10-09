import { TicketsModel } from './models/tickets.model.js';

class TicketsModelLogic {
  async createTicket(ticket) {
    const ticketCreated = await TicketsModel.create({ ...ticket });
    return ticketCreated;
  }

  async getTickets(purchaser) {
    const tickets = await TicketsModel.find({ purchaser: purchaser }).lean();
    return tickets;
  }
}

export const ticketsModelLogic = new TicketsModelLogic();
