import { userModelLogic } from '../DAO/mongo/users.mongo.js';

class UsersService {
  async getUsers() {
    const users = await userModelLogic.getUsers();
    return users;
  }

  async getUserByEmail(username) {
    const user = await userModelLogic.findOne(username);
    return user;
  }

  async deleteUsers(req, res) {
    const users = await userModelLogic.getUsers();
    const date = Date.now();
    const userToDelete = [];
    users.forEach((element) => {
      console.log(element.lastconnection - date)
      if ( Date.now() - element.lastconnection  > 1800000) {
        userToDelete.push(element.email);
      }
    });
    if (userToDelete.length === 0) {
      const deleteMsg = { msg: 'No users to Delete' };
      return deleteMsg;
    }
    userToDelete.forEach(async (element) => {
      const user = await userModelLogic.findAndDelete({ element });
    });
    return userToDelete;
  }
}

export const usersService = new UsersService();
