import express from 'express';
import ProductManager from '../productManager.js';
import { uploader } from '../utils.js';
const PM = new ProductManager('./src/products.json', './src/id.json');
const socketRouter = express.Router();

// middleware para leer los productos
socketRouter.get('/', async (req, res) => {
  try {
    const products = await PM.getProduct();
    res.status(200).render('realtimeproducts', { products });
  } catch {
    return res.status(500).json({
      status: 'Error',
      msg: 'Error trying to get the products. Please, try again later',
    });
  }
});

//middleware para agregar un producto nuevo
socketRouter.post('/', uploader.single('thumbnail'), async (req, res) => {
  try {
    const data = await PM.getProduct();
    const productBody = {};
    productBody.title = req.body.title;
    productBody.description = req.body.description;
    productBody.code = req.body.code;
    productBody.price = req.body.price;
    productBody.stock = req.body.stock;
    productBody.category = req.body.category;
    const thumbnail = req.file.filename;
    productBody.file = 'http://localhost:8080/public/uploads/' + thumbnail;
    productBody.thumbnail = productBody.file;
    let foundCode = data.find((element) => element.code === productBody.code);
    console.log(productBody)
    const reqFields = [
      'title',
      'description',
      'code',
      'price',
      'stock',
      'category',
    ];
    const checkFields = reqFields.every((prop) => productBody[prop]);
    if (foundCode) {
      return res.status(400).json({
        status: 'error',
        msg: 'Code already in use. Please, change the product code',
      });
    }
    if (checkFields) {
      await PM.addProduct(productBody);
      return res.status(200).json({
        status: 'Success',
        msg: 'Product added',
      });
    } else {
      return res.status(400).json({
        status: 'Error',
        msg: "Product wasn't saved. Please check the attributes of your product.",
        data: productBody,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      msg: 'Error trying to save the product. Please, try again later',
    });
  }
});

export default socketRouter;
