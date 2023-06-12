import express from 'express';
import ProductManager from '../productManager.js';
import { uploader } from '../utils.js';
import { ProductsModel } from '../DAO/models/products.model.js';
const PM = new ProductManager('./src/products.json', './src/id.json');
const productsRouter = express.Router();

// middleware para leer los productos
productsRouter.get('/', async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const category = req.query.category || '';
  const sort = req.query.sort || '';    
  
  const products = await ProductsModel.paginate(category,{page,limit,sort,lean:true});
  res.render('home', {
    products: products.docs,
    currentPage: products.page,
    totalPages: products.totalPages
  });
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
