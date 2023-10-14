import { UserSchema } from './models/users.model.js';
import { CartModel } from './models/carts.model.js';

class UserModel {
  async findOne(username) {
    return await UserSchema.findOne({ email: username });
  }

  async create(user) {
    return await UserSchema.create(user);
  }

  async findById(id) {
    return await UserSchema.findById(id);
  }

  async getUsers() {
    const users = await UserSchema.find();
    return users;
  }

  async findAndDelete(email){
    const userDeleted = await UserSchema.findOneAndDelete({email})
  }
}

export const userModelLogic = new UserModel();
