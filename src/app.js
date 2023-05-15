import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import { Server } from 'socket.io';
import cartRouter from './routes/cartRouter.js';
import homeRouter from './routes/homeRouter.js';
import productsRouter from './routes/productsRouter.js';
import socketRouter from './routes/socketRouter.js';
import { __dirname } from './utils.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/',homeRouter)

//Rutas sockets
app.use('/realtimeproducts', socketRouter);

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

//Render carpeta public
app.use(express.static(path.join(__dirname + '/public/uploads')));

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

  socket.on("msg_front_to_back", (data) => {
    console.log(JSON.stringify(data));
  });
});
