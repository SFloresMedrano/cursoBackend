import { productService } from '../services/productsService.js';
import { logger } from '../utils.js';
import  fs  from 'fs';

class ProductsController {
  async getProduct(req, res) {
    const pid = req.params.pid;
    const product = await productService.getOne(pid);
    const simplifiedProduct = {
      title: product.title,
      description: product.description,
      price: product.price,
      code: product.code,
      category: product.category,
      quantity: product.quantity,
      id: product._id,
    };
    return res.json({ simplifiedProduct });
  }

  async getAllProducts(req, res, queryParams) {
    try {
      const response = await productService.get(queryParams);
      return res.status(200).json(response);
    } catch (e) {
      console.log(e);
    }
  }

  async addProduct(req, res) {
    const productBody = req.body;
    productBody.thumbnail =
      'http://localhost:8080/public/uploads/' + req.file.filename;
    const reqFields = [
      'title',
      'description',
      'code',
      'price',
      'stock',
      'category',
      'thumbnail',
    ];
    const checkFields = reqFields.every((prop) => productBody[prop]);
    if (checkFields) {
      try {
        const productAdded = await productService.createOne({ productBody });
        return res.status(201).json({
          status: 'Success',
          msg: 'Product added',
          data: productAdded,
        });
      } catch (e) {
        logger.warn(`Couldn add Product ${e}`);
        if (fs.existsSync(productBody.thumbnail)) {
          fs.unlinkSync(productBody.thumbnail);
        }
      }
    } else {
      logger.warn('Fields are not validated');
    }
  }

  async deleteProduct(req, res) {
    try {
      const id = req.params.pid;
      const productDelete = await productService.deleteOne({ _id: id });
      return res.status(200).json({
        status: 'Success',
        msg: 'Product deleted',
        data: {},
      });
    } catch (e) {}
  }
}

export const productsController = new ProductsController();
