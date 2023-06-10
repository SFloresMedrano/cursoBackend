import { express } from 'express';
import { MessagesModel } from '../DAO/models/messages.model';

const chatRouter = express.Router();

chatRouter.get('/', async (req, res) => {
  const products = await MessagesModel.find({}).lean();
  res.render('chat', { products });
});

export default chatRouter;
