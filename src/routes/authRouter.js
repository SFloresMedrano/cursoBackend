import express from 'express';
import passport from 'passport';

export const authRouter = express.Router();

authRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

authRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  req.session.user = req.user;
  // Successful authentication, redirect home.
  res.redirect('/products');
});
authRouter.get('/', (req, res) => {
  return res.render('login', {});
});


authRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', {
        error: 'Error inesperado. No se pudo cerrar su sesión',
      });
    }
    return res.redirect('/');
  });
});

//Login con passport
authRouter.post(
  '/',
  passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }),
  async (req, res) => {
    if (!req.user) {
      return res.json({ error: 'Invalid credentials' });
    }
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      isAdmin: req.user.isAdmin,
    };
    return res.redirect('/products');
  }
);

authRouter.get('/faillogin', async (req, res) => {
  return res.json({ error: 'Fail to login' });
});

authRouter.get('/register', (req, res) => {
  return res.render('register', {});
});

authRouter.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/auth/failregister' }),
  (req, res) => {
    if (!req.user) {
      return res.json({ error: 'Something went wrong' });
    }
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      age: req.user.age,
      isAdmin: req.user.isAdmin,
    };
    return res.redirect('/products');
  }
);


export default authRouter;
