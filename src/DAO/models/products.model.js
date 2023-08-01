import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const schema = new Schema({
  title: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 100 },
  code: { type: Number, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true, max: 100 },
});

schema.plugin(mongoosePaginate);
export const ProductsModel = model('products', schema);

export class ProductsModelLogic {
  async paginate(filter, options) {
    await ProductsModel.paginate(filter, options);
  }

  async createProduct(title, description, price, code, stock, category) {
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
}

export const productsModelLogic = new ProductsModelLogic();
