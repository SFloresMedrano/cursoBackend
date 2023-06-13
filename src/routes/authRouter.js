import express from 'express';
import UserModel from '../DAO/models/users.model.js';

export const authRouter = express.Router();

authRouter.get('/login', (req, res) => {
  return res.render('login', {});
});

authRouter.get('/logout', (req, res) => {
    req,session.destroy((err)=>{
        if(err){
            return res.status(500).render('error',{error: 'Error inesperado. No se pudo cerrar su sesión'})
        }
        return res.redirect('/auth/login')
    })
  return res.render('login', {});
});

authRouter.get('/auth/perfil', (req, res) => {
  const user = { email: req.session.email, isAdmin: req.session.isAdmin };
  return res.render('perfil', { user: user });
});

//generar model y generar en base de datos los usuarios
authRouter.post('/login', async (req, res) => {
  const { email, pass } = req.body;
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
