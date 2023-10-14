import { Router } from 'express';
import { usersController } from '../controllers/usersController.js';
import { isAdmin } from '../middlewares/auth.js';
export const usersRouter = new Router();

// endpoint para leer los productos mongoose
usersRouter.get('/', usersController.getUsers);

usersRouter.get('/deleteUsers', isAdmin , usersController.deleteUsers);
