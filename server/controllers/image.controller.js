
import User from '../models/user.model.js';
import Pet from '../models/pet.model.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPEG, PNG and WEBP are allowed!'), false);
    }
  }
});

export default {
  uploadUserAvatar: async (req, res) => {
    try {
      upload.single('avatar')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        };

        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
        };

        try {
          const user = await User.findByIdAndUpdate(
            req.user._id,
            {
              avatar: {
                data: req.file.buffer,
                contentType: req.file.mimetype
              }
            },
            { new: true }
          );

          return res.status(200).json({
            message: 'Avatar uploaded successfully',
            user: {
              ...user.toObject(),
              avatar: null
            }
          });
        } 
        catch (error) {
          return res.status(500).json({ message: error.message });
        };
      });
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  getUserAvatar: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user || !user.avatar || !user.avatar.data) {
        return res.status(404).json({ message: 'Avatar not found' });
      };

      res.set('Content-Type', user.avatar.contentType);
      return res.send(user.avatar.data);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  uploadPetImage: async (req, res) => {
    try {
      upload.single('image')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        };

        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
        };

        try {
          const pet = await Pet.findById(req.params.petId);
          if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
          };

          if (pet.owner.toString() !== req.user._id) {
            return res.status(403).json({ message: 'You are not authorized to upload images for this pet' });
          };

          const updatedPet = await Pet.findByIdAndUpdate(
            req.params.petId,
            {
              $push: {
                images: {
                  data: req.file.buffer,
                  contentType: req.file.mimetype
                }
              }
            },
            { new: true }
          );

          return res.status(200).json({
            message: 'Pet image uploaded successfully',
            pet: {
              ...updatedPet.toObject(),
              images: updatedPet.images.map(img => ({
                contentType: img.contentType
              }))
            }
          });
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      });
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  getPetImage: async (req, res) => {
    try {
      const pet = await Pet.findById(req.params.petId);
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      };

      const image = pet.images[req.params.imageIndex];
      if (!image || !image.data) {
        return res.status(404).json({ message: 'Image not found' });
      };

      res.set('Content-Type', image.contentType);
      return res.send(image.data);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deletePetImage: async (req, res) => {
    try {
      const pet = await Pet.findById(req.params.petId);
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      };

      if (pet.owner.toString() !== req.user._id) {
        return res.status(403).json({ message: 'You are not authorized to delete images for this pet' });
      };

      pet.images.splice(req.params.imageIndex, 1);
      await pet.save();

      return res.status(200).json({
        message: 'Image deleted successfully',
        pet: {
          ...pet.toObject(),
          images: pet.images.map(img => ({
            contentType: img.contentType
          }))
        }
      });
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  uploadPetImageBase64: async (req, res) => {
    try {
      const { imageData } = req.body;
      if (!imageData) {
        return res.status(400).json({ message: 'No image data provided' });
      };

      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      let contentType = 'image/jpeg';
      if (imageData.startsWith('data:image/png;base64,')) {
        contentType = 'image/png';
      }
      else if (imageData.startsWith('data:image/webp;base64,')) {
        contentType = 'image/webp';
      };

      const pet = await Pet.findById(req.params.petId);
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      };

      if (pet.owner.toString() !== req.user._id) {
        return res.status(403).json({ message: 'You are not authorized to upload images for this pet' });
      };

      const updatedPet = await Pet.findByIdAndUpdate(
        req.params.petId,
        {
          $push: {
            images: {
              data: buffer,
              contentType: contentType
            }
          }
        },
        { new: true }
      );

      return res.status(200).json({
        message: 'Pet image uploaded successfully',
        pet: {
          ...updatedPet.toObject(),
          images: updatedPet.images.map(img => ({
            contentType: img.contentType
          }))
        }
      });
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  }


};

