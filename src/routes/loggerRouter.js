import { Router } from 'express';
import { loggerController } from '../controllers/loggerController';

const loggerRouter = Router();

loggerRouter.get('/', loggerController.print)