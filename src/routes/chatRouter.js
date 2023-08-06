import express from 'express';
import { MessagesModel } from '../DAO/mongo/models/messages.model.js';

const chatRouter = express.Router();

chatRouter.get('/', async (req, res) => {
  const messages = await MessagesModel.find({}).lean();
  res.render('chat', { messages });
});

chatRouter.post('/', async (req, res) => {
  const { user, msg } = req.body;
  const response = await  MessagesModel.create({ user, msg })
  .then((result) => {
    console.log(result)
    res.json(result);
  });
});
export default chatRouter;
