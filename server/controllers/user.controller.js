
import UserModel from '../models/user.model.js';
import Pet from '../models/pet.model.js';


export default {

  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.find();
      return res.status(200).json(users);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

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

      const { sendEmail } = await import('../utils/sendEmail.js');
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.otpSecret = otp;
      await user.save();

      const html = `<p>Your OTP for email verification is: <strong>${otp}</strong></p>
      Go to <a href="https://www.${process.env.DOMAIN}/verify/${user._id}">https://www.${process.env.DOMAIN}/verify/${user._id}</a> to verify your email.`;
      // Go to <a href="http://localhost:5173/verify/${user._id}">http://localhost:5173/verify/${user._id}</a> to verify your email.`;

      await sendEmail(user.email, 'Email Verification', `Your OTP is: ${otp}`, html);

      return res.status(201).json(user);
    }
    catch (e) {
      return res.status(500).json({ message: e.message || 'Failed to create user' });
    };
  },

  verifyEmail: async (req, res) => {
    try {
      const { uid } = req.params;
      const { otp } = req.body;
      const user = await UserModel.findById(uid);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      };

      if (user.otpSecret === otp) {
        user.isVerified = true;
        user.otpSecret = undefined;

        await user.save();

        return res.status(200).json({ success: true, message: 'Email verified successfully' });
      }
      else {
        return res.status(400).json({ message: 'Invalid OTP' });
      };
    }
    catch (e) {
      return res.status(500).json({ message: e.message });
    };
  },

  updateUser: async (req, res) => {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: 'after'
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
  },

  getUserProfile: async (req, res) => {
    try {
      const user = await UserModel.findById(req.user._id)
        .populate('pets')
        .populate('savedPets');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateUserPreferences: async (req, res) => {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        { preferences: req.body.preferences },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getUserPets: async (req, res) => {
    try {
      // console.log('User ID from token:', req.user._id);
      // console.log('User ID from params:', req.params.id);
      if (req.user._id !== req.params.id/* && !req.user.isAdmin*/) {
        return res.status(403).json({ message: 'Not authorized to view this user\'s pets' });
      };

      const pets = await Pet.find({ owner: req.params.id }).sort({ createdAt: -1 });
      return res.status(200).json(pets);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  addPetToUser: async (req, res) => {
    try {
      const { petId } = req.params;

      const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { pets: petId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      };

      return res.status(200).json(user);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  removePetFromUser: async (req, res) => {
    try {
      if (req.user._id !== req.params.id && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized to remove pets from this user' });
      };

      const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        { $pull: { pets: req.params.petId } },
        { new: true }
      ).select('-password -otpSecret');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      };

      return res.status(200).json(user);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  getSavedPets: async (req, res) => {
    try {
      if (req.user._id !== req.params.id && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized to view this user\'s saved pets' });
      };

      const user = await UserModel.findById(req.params.id).populate('savedPets');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      };

      return res.status(200).json(user.savedPets);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  savePet: async (req, res) => {
    try {
      const { petId } = req.params;

      const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { savedPets: petId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      };

      return res.status(200).json(user);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  unsavePet: async (req, res) => {
    try {
      const { petId } = req.params;

      const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        { $pull: { savedPets: petId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      };

      return res.status(200).json(user);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  }


};

