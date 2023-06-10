import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import { Server } from 'socket.io';
import ProductManager from './productManager.js';
import cartRouter from './routes/cartRouter.js';
import productsRouter from './routes/productsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import { __dirname, connectMongo } from './utils.js';
import chatRouter from './routes/chatRouter.js';

const PM = new ProductManager('./src/products.json', './src/id.json');

const app = express();
const PORT = 8080;

connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Render carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/chat', chatRouter);
app.use('/', viewsRouter);

//handlebars
app.engine('handlebars', handlebars.engine());
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
