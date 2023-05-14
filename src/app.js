import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import cartRouter from './routes/cartRouter.js';
import productsRouter from './routes/productsRouter.js';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
const app = express();
const PORT = 8080;

//Rutas Server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Render carpeta public
app.use(express.static(path.join(__dirname + '/public/uploads')));

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.get('*', async (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'No se encuentra implementada la ruta',
    data: {},
  });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`, __dirname);
});

const SocketServer = new Server(httpServer);
