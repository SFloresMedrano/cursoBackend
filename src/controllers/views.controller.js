import { cartController } from './carts.controller.js';
import { productService } from '../services/productsService.js';

class ViewsController {
  async redirect(req, res) {
    cartController.createCart();
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
      const first_name = req.session.user.first_name;
      const last_name = req.session.user.last_name;
      const cart = req.session.user.cart;
      const role = req.session.user.role;
      const {
        payload: products,
        totalPages,
        payload,
        prevPage,
        nextPage,
        page: currentPage,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      } = await productService.get(queryParams);
      let productsSimplified = products.map((item) => {
        return {
          _id: item._id.toString(),
          title: item.title,
          description: item.description,
          price: item.price,
          code: item.code,
          stock: item.stock,
          category: item.category,
        };
      });
      return res.render('products', {
        products: productsSimplified,
        totalPages,
        prevPage,
        nextPage,
        currentPage,
        hasPrevPage,
        hasNextPage,
        prevLink: prevLink?.substring(4) || '',
        nextLink: nextLink?.substring(4) || '',
        first_name,
        last_name,
        role,
        cart,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Error in server' });
    }
  }
}

export const viewsController = new ViewsController();
