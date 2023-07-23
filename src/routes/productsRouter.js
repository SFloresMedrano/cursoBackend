import express from 'express';
import { ProductsModel } from '../DAO/models/products.model.js';
import {productService} from '../services/productsService.js';

const productsRouter = express.Router();

// middleware para leer los productos
productsRouter.get('/', async (req, res) => {
  try {
    const query = req.query;
    const response = await productService.get(query);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'Error',
      msg: "Couldn't retrieve data. Please try again later",
      data: {},
    });
  }
});

//middleware para crear un producto con mongoose

productsRouter.post('/', async (req, res) => {
  const productBody = req.body;
  const reqFields = [
    'title',
    'description',
    'code',
    'price',
    'stock',
    'category',
  ];
  const checkFields = reqFields.every((prop) => productBody[prop]);
  if (checkFields) {
    try {
      const productAdded = await ProductsModel.create({
        ...productBody,
      });
      return res.status(201).json({
        status: 'Success',
        msg: 'Product added',
        data: productAdded,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'Error',
        msg: 'Please check that the fields arent empty or code is alredy in use',
        data: {},
      });
    }
  }
});

//middleware para borrar un elemento en MongoDB

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const { id } = req.params.pid;
    const productDelete = await ProductsModel.deleteOne({ _id: id });
    return res.status(200).json({
      status: 'Success',
      msg: 'Product deleted',
      data: {},
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'Error',
      msg: "Couldn't delete the item(",
      data: {},
    });
  }
});

export default productsRouter;
