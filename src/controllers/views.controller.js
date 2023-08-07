import UserDTO from '../DAO/DTO/user.dto.js';
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
      products.last_name = req.session.user.last_name;
      products.cart = req.session.user.cart;
      products.role = req.session.role;
      return res.render('products', products);
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Error getting products' });
    }
  }

  getCurrentUser = (req, res) => {
    try {
      if (!req.session.user.first_name == '') {
        const user = new UserDTO(req.session.user);
        return res.status(200).json({ user });
      }
    } catch (error) {
      return res
      .status(500)
      .json({ status: 'error', message: 'User not logged in' });
    }
  };

  async productForm(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      const queryParams = { limit, page, sort, query };
      const products = await viewsService.getProducts(queryParams);
      products.first_name = req.session.user.first_name;
      products.last_name = req.session.user.last_name;
      products.cart = req.session.user.cart;
      return res.render('home', products);
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Error getting products' });
    }
  }
  
}

export const viewsController = new ViewsController();
