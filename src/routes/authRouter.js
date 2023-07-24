import express from 'express';
import { authController } from '../controllers/authController.js';
import passport from 'passport';

export const authRouter = express.Router();

authRouter.get('/github', authController.authenticate);

authRouter.get('/githubcallback', authController.callback);

authRouter.get('/', authController.login);

authRouter.get('/logout', authController.logout);

//Login con passport
authRouter.post(
  '/',
  passport.authenticate('login', {
    failureRedirect: '/api/sessions/faillogin',
  }),
  authController.loginPassport
);

authRouter.get('/faillogin', authController.failLogin);

authRouter.get('/register', authController.register);

authRouter.post(
  '/register',
  passport.authenticate('register', {
    failureRedirect: '/api/sessions/failregister',
  }),
  async (req, res) => {
    if (!req.user) {
      return res.json({ error: 'Something went wrong' });
    }
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
    };
    return res.redirect('/products');
  }
);

authRouter.get('/failregister', authController.failRegister);

export default authRouter;
