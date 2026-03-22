
import UserModel from '../models/user.model.js';


export default {

  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response>}
   */
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.find();
      return res.status(200).json(users);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response>}
   */
  getUserById: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response>}
   */
  createUser: async (req, res) => {
    try {
      let
        stagedUser,
        user;
      try {
        stagedUser = new UserModel(req.body);
        try {
          user = await stagedUser.save();
        }
        catch (e) {
          const eresp = e.errorResponse;
          if (eresp && eresp.code === 11000) {
            const kv = Object.entries(eresp.keyValue)[0];
            return res.status(400).json({ message: `${kv[0].toUpperCase()}: [ ${kv[1]} ] is already in use.` });
          }
        };
      }
      catch (e) {
        throw new Error(e);
      };

      return res.status(201).json(user);
    }
    catch (e) {
      return res.status(500).json({ message: e.message });
    };
  },

  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response>}
   */
  updateUser: async (req, res) => {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(updatedUser);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response>}
   */
  deleteUser: async (req, res) => {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  }

};
