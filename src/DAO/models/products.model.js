import { Schema, model } from "mongoose";

const schema = new Schema({
  title: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 100 },
  code: { type: Number, required: true, unique: true},
  price: { type: Number, required: true},
  stock: { type: Number, required: true},
  category: { type: String, required: true, max: 100 }
});

export const ProductsModel = model("products", schema);