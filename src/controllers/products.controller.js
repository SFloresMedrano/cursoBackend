import { productService } from '../services/productsService.js';
import { logger } from '../utils.js';

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
    return res.render('detail', { product: simplifiedProduct });
  }

  async getAllProducts(queryParams) {
    try {
      const response = await productService.get(queryParams);
      return res.status(200).json(response);
    } catch (e) {
      logger.warn('Couldnt get products')
    }
  }

  async addProduct(req, res) {
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
        const productAdded = await productService.createOne({ productBody });
        return res.status(201).json({
          status: 'Success',
          msg: 'Product added',
          data: productAdded,
        });
      } catch (e) {
        logger.warn('Couldnt add product');
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
    } catch (e) {
      
    }
  }
}

export const productsController = new ProductsController();
