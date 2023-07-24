import { productService } from './productsService.js';

class ViewsService {
  async getProducts(queryParams) {
    try {
        const {
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page: currentPage,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        } = await productService.get(queryParams);
        let productsSimplified = products.map((item) => ({
            _id: item._id.toString(),
            title: item.title,
            description: item.description,
            price: item.price,
            thumbnail: item.thumbnail,
            code: item.code,
            stock: item.stock,
            category: item.category,
        }));
        return {
            products: productsSimplified,
            totalPages,
            prevPage,
            nextPage,
            currentPage,
            hasPrevPage,
            hasNextPage,
            prevLink: prevLink?.substring(4) || '',
            nextLink: nextLink?.substring(4) || '',
        };
    } catch (error) {
        throw new Error('Error in server');
    }
}
}

export const viewsService = new ViewsService();
