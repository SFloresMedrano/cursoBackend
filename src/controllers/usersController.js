import { usersService } from '../services/usersService.js';

class UsersController {
  async getUsers(req, res) {
    const users = await usersService.getUsers();
    return res.status(200).json({ users });
  }

  async deleteUsers(req, res) {
    const users = await this.getUsers();

    const deletedUsers = await usersService.deleteUsers();
    return res.status(200).json({ deletedUsers });
  }

  async updateUser(username, req, res) {
    const updatedUser = await usersService.getUserByEmail(username);
    console.log(updatedUser, 'fetch')
    updatedUser.lastconnection = Date.now();
    await updatedUser.save();
    console.log(updatedUser);
    return res.status(200).json({ updatedUser });
  }
}

export const usersController = new UsersController();
