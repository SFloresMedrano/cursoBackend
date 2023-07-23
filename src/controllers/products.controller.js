import {productService} from '../services/productsService.js';

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
}

export const productsController = new ProductsController();
