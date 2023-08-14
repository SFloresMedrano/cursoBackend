import { productService } from '../services/productsService.js';

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
      next();
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
        const productAdded = await ProductsModel.create({
          ...productBody,
        });
        return res.status(201).json({
          status: 'Success',
          msg: 'Product added',
          data: productAdded,
        });
      } catch (e) {
        next();
      }
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params.pid;
      const productDelete = await ProductsModel.deleteOne({ _id: id });
      return res.status(200).json({
        status: 'Success',
        msg: 'Product deleted',
        data: {},
      });
    } catch (e) {
      next();
    }
  }
}

export const productsController = new ProductsController();
