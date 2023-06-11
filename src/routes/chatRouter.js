import express from 'express';
import { MessagesModel } from '../DAO/models/messages.model.js';

const chatRouter = express.Router();


chatRouter.get('/', async (req, res) => {
    const messages = await MessagesModel.find({}).lean();
    res.render('chat', { messages });
});

chatRouter.post('/', async (req, res) => {
    const {user,msg} = req.body;
  const msgCreate = await MessagesModel.create(user,msg);
});
export default chatRouter;
