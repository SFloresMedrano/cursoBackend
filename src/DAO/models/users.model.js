import { Schema, model } from 'mongoose';

const schema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  last_name: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  age: { type: Number},
  password: { type: String, required: true, max: 100 },
  isAdmin: { type: Boolean, required: true, max: 100 },
});

export const UserModel = model('users', schema);
