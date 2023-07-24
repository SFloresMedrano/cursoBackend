import express from 'express';
import passport from 'passport';
import { authController } from '../controllers/authController.js';
import CartService from '../services/cartService.js';
const cartService = new CartService();

export const authRouter = express.Router();

authRouter.get('/github', authController.authenticate);

authRouter.get('/githubcallback', authController.callback);

authRouter.get('/', authController.login);

authRouter.get('/logout', authController.logout);

//Login con passport
authRouter.post('/', authController.loginPassport);

authRouter.get('/faillogin', authController.failLogin);

authRouter.get('/register', authController.register);

authRouter.post('/register', authController.registerPassport);

authRouter.get('/failregister', authController.failRegister);

export default authRouter;
