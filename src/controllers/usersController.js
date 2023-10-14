import UserDTO from '../DAO/DTO/user.dto.js';
import { usersService } from '../services/usersService.js';
import { enviarCuentaELiminada } from '../utils.js';

class UsersController {
  async getUsers(req, res) {
    const users = await usersService.getUsers();
    const usersDTO = [];
    users.forEach((element) => {
      usersDTO.push(new UserDTO(element));
    });
    return res.status(200).json({ usersDTO });
  }

  async deleteUsers(req, res) {
    const deletedUsers = await usersService.deleteUsers();
    if(deletedUsers.length > 0){
      deletedUsers.forEach((element) => {
        enviarCuentaELiminada(element);
      });
    }
    return res.status(200).json({ status: 'Success',msg:'Realizado con Exito' , data:{deletedUsers} });
  }

  async updateUser(username, req, res) {
    const updatedUser = await usersService.getUserByEmail(username);
    updatedUser.lastconnection = Date.now();
    await updatedUser.save();
    return updatedUser;
  }
}

export const usersController = new UsersController();
