import 'dotenv/config';
import MongoStore from 'connect-mongo';
import express from 'express';
import exphbs from 'express-handlebars';
import passport from 'passport';
import path from 'path';
import session from 'express-session';
import { Server } from 'socket.io';
import { iniPassport } from './config/passport.config.js';
import ProductManager from './productManager.js';
import { authRouter } from './routes/authRouter.js';
import cartRouter from './routes/cartRouter.js';
import chatRouter from './routes/chatRouter.js';
import productsRouter from './routes/productsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import { __dirname, connectMongo } from './utils.js';
const PM = new ProductManager('./src/products.json', './src/id.json');

const app = express();
const PORT = 8080;

connectMongo();

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://asfloresmedrano:Sinreaper1@coderdbatlas.ud2qdcy.mongodb.net/ecommerce?retryWrites=true&w=majority',
      ttl: 3660,
    }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Render carpeta public
app.use(express.static(path.join(__dirname, 'public')));

//Passport Login
iniPassport();

app.use(passport.initialize());
app.use(passport.session());
  
// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/chat', chatRouter);
app.use('/', viewsRouter);
app.use('/api/sessions', authRouter);

app.engine(
  'handlebars',
  exphbs.create({
    helpers: {
      gt: function (a, b) {
        return a > b;
      },
      lt: function (a, b) {
        return a < b;
      },
      add: function (a, b) {
        return a + b;
      },
    },
  }).engine
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Captura de cualquier ruta fuera de las definidas
app.get('*', async (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'No se encuentra implementada la ruta',
    data: {},
  });
});

// Servidor comun
const httpServer = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`, __dirname);
});

// Servidor socket
const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  socket.emit('msg_back_to_front', { msg: 'Cliente Conectado' });

  socket.on('productAdd', async (data) => {
    const product = await PM.addProduct(data);
    socketServer.emit('productAdded', product);
  });

  socket.on('productDelete', async (id) => {
    await PM.deleteProduct(id);
    socketServer.emit('productDeleted', id);
  });
});

export default app;
