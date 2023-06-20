import { ProductsModel } from '../DAO/models/products.model.js';

class ProductService {
  validate(title, description, price, code, stock, category) {
    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !stock ||
      !category
    ) {
      console.log('Validation error: Please check if all fields are correct.');
      throw new Error(
        'Validation error: Please check if all fields are correct.'
      );
    }
  }

  async get(queryParams) {
    const { limit = 10, page = 1, sort, query } = queryParams;
    const filter = {};

    if (query) {
      filter.$or = [{ category: query }, { availability: query }];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort === 'desc' ? '-price' : 'price',
    };

    const result = await ProductsModel.paginate(filter, options);

    const response = {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?limit=${limit}&page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?limit=${limit}&page=${result.nextPage}`
        : null,
    };
    return response;
  }

  async createOne(title, description, price, code, stock, category) {
    this.validate(title, description, price, code, stock, category);
    const productCreated = await ProductsModel.create({
      title,
      description,
      price,
      code,
      stock,
      category,
    });
    return productCreated;
  }

  async deleteOne(_id) {
    const deleted = await ProductsModel.deleteOne({ _id });
    if (deleted.deletedCount === 1) {
      return true;
    } else {
      throw new Error('Product not found');
    }
  }

  async updateOne(
    id,
    title,
    description,
    price,
    code,
    stock,
    category
  ) {
    this.validate(title, description, price, code, stock, category);
    const productUptaded = await ProductsModel.updateOne(
      { _id: id },
      { title, description, price, code, stock, category }
    );
    return productUptaded;
  }

  async getOne(pid){
    const product = await ProductsModel.findById(pid)
    return product
  }
}

export default ProductService;
