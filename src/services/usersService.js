import { userModelLogic } from '../DAO/mongo/users.mongo.js';

class UsersService {
  async getUsers() {
    const users = userModelLogic.getUsers();
    return users;
  }

  async getUserByEmail(username) {
    const user = userModelLogic.findOne(username);
    return user;
  }
}

export const usersService = new UsersService();
