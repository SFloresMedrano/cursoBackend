import express from 'express';
import { UserModel } from '../DAO/models/users.model.js';

export const authRouter = express.Router();

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
  return res.render('login', {});
});

//generar model y generar en base de datos los usuarios
authRouter.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).render('error', { error: 'Verifique los campos' });
  }
  if (req.session.first_name) {
    res.render('error', { error: 'Ya se encuentra iniciada una session' });
    setTimeout(()=>{
      res.redirect('/products')
    },5000);
  }
  const userFound = await UserModel.findOne({ email: email });
  if (userFound && userFound.password == password) {
    req.session.first_name = userFound.first_name;
    req.session.last_name = userFound.last_name;
    req.session.age = userFound.age;
    req.session.email = userFound.email;
    req.session.isAdmin = userFound.isAdmin;

    return res.redirect('/products');
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
  const { first_name, last_name, age, email, password } = req.body;
  if (!email || !password || !first_name || !last_name || !age) {
    return res.status(400).render('error', { error: 'Verifique los campos' });
  }
  try {
    const userCreate = await UserModel.create({
      email,
      password,
      first_name,
      last_name,
      age,
      isAdmin: false,
    });
    req.session.first_name = first_name;
    req.session.last_name = last_name;
    req.session.age = age;
    req.session.email = email;
    req.session.isAdmin = false;
  } catch (e) {
    console.log(e);
    return res.status(400).render('error', {
      error: 'No se pudo crear el usuario. Controle los campos',
    });
  }
  return res.redirect('/api/sessions/perfil');
});

export default authRouter;
