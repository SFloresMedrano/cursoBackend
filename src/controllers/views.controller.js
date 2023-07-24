import { cartController } from './carts.controller.js';
import { productService } from '../services/productsService.js';
import { viewsService } from '../services/viewsService.js';

class ViewsController {
  async redirect(req, res) {
    res.redirect('/api/sessions');
  }

  async getRealTimeProducts(req, res) {
    const products = await productService.get();
    res.render('realtimeProducts', { products });
  }

  async getProducts(req, res) {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const queryParams = { limit, page, sort, query };
        const products = await viewsService.getProducts(queryParams);
        products.first_name = req.session.user.first_name;
        products.cart = req.session.user.cart;
        products.last_name = req.session.user.last_name;
        products.role = req.session.user.role;
        return res.render('products', products);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Error in server' });
    }
}
}

export const viewsController = new ViewsController();
