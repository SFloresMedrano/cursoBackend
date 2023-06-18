/* import express from 'express';
import UserModel from '../DAO/models/users.model.js';
import isUser from './middlewares/auth.js';
export const authRouter = express.Router();

authRouter.get('/login', (req, res) => {
  return res.render('login', {});
});

authRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', {
        error: 'Error inesperado. No se pudo cerrar su sesión',
      });
    }
    return res.redirect('/auth/login');
  });
  return res.render('login', {});
});

authRouter.get('/perfil', (req, res) => {
  const user = { email: req.session.email, isAdmin: req.session.isAdmin };
  return res.render('perfil', { user: user });
});

//generar model y generar en base de datos los usuarios
authRouter.post('/login', async (req, res) => {
  const { email, pass } = req.body;
  if (!email || !pass) {
    return res.status(400).render('error', { error: 'Verifique los campos' });
  }
  const userFound = await UserModel.findOne({ email: email });
  if (userFound && userFound.pass == pass) {
    req.session.email = userFound.email;
    req.session.isAdmin = userFound.isAdmin;
    return res.redirect('/perfil');
  } else {
    return res
      .status(401)
      .render('error', { error: 'El usuario o la contraseña son incorrectos' });
  }
});

authRouter.get('/register', (req, res) => {
  return res.render('register', {});
});

authRouter.post('/register', async (req, res) => {
  const { email, pass, firstName, lastName } = req.body;
  if (!email || !pass || !firstName || !lastName) {
    return res.status(400).render('error', { error: 'Verifique los campos' });
  }
  try {
    const userCreate = await UserModel.create({
      email,
      pass,
      firstName,
      lastName,
      isAdmin: false,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).render('error', {
      error: 'No se pudo crear el usuario. Controle los campos',
    });
  }
  return res.redirect('/perfil');
});

authRouter.get('/administracion', isUser, isAdmin, (req, res) => {
  return res.send('Datos Admin');
});
 */