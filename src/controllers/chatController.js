import { messagesModelLogic } from '../DAO/mongo/messages.mongo.js';
import { chatService } from '../services/chatService.js';
import { logger } from '../utils.js';
import CustomError from '../errors/customError.js';
import errorsNum from '../errors/enum.js';

class ChatController {
  async getMessages(req, res) {
    if (!req.session.user) {
        res.redirect('/api/sessions');     
    }
    const chat = {};
    chat.messages = await chatService.getMessages();
    chat.isAdmin = req.session.user.role === 'admin' ? true : false;
    chat.user = req.session.user.first_name;
    chat.email = req.session.user.email;
    res.render('chat', { chat });
  }

  async storeMessage(req, res) {
    const { user, msg } = req.body;
    const response = await messagesModelLogic.storeMessages({ user, msg });
    return response;
  }
}

export const chatController = new ChatController();
