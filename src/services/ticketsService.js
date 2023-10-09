import { ticketsModelLogic } from '../DAO/mongo/tickets.mongo.js';

class TicketsService {
  async createTicket(ticket) {
    const ticketCreate = ticketsModelLogic.createTicket(ticket);
    return ticketCreate;
  }

  async getTickets(purchaser) {
    const tickets = ticketsModelLogic.getTickets(purchaser);
    return tickets;
  }
}

export const ticketService = new TicketsService();
