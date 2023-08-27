import express from 'express';
import { MessagesModel } from '../DAO/mongo/models/messages.model.js';

const chatRouter = express.Router();

chatRouter.get('/', async (req, res) => {
  const chat = {};
  chat.messages = await MessagesModel.find({}).lean().sort({ _id: -1 });
  chat.isAdmin = req.session.user.role === 'admin' ? true : false;
  chat.user = req.session.user.first_name;
  chat.email = req.session.user.email;
  res.render('chat', { chat });
});

chatRouter.post('/', async (req, res) => {
  const { user, msg } = req.body;
  const response = await MessagesModel.create({ user, msg }).then((result) => {
    console.log(result);
    res.json(result);
  });
});
export default chatRouter;
