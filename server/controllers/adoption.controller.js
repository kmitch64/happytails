
import AdoptablePetSchema from '../models/adoptable_pets.model.js';

export default {
    /* ***************************************************************************

        adoptable pets 

  ************************************************************************** */

  getAllAdoptablePets: async (req, res) => {
    try {
      const pets = await AdoptablePetSchema.find().sort({ createdAt: -1 });
      return res.status(200).json(pets);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };

  },

  getAdoptablePetById: async (req, res) => {
    try {
      const pet = await AdoptablePetSchema.findById(req.params.id);
      if (!pet) {
        return res.status(404).json({ message: 'Adoptable pet not found' });
      };
      return res.status(200).json(pet);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  createAdoptablePet: async (req, res) => {
    try {
      const pet = new AdoptablePetSchema(req.body);
      const savedPet = await pet.save();
      return res.status(201).json(savedPet);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  updateAdoptablePet: async (req, res) => {
    try {
      const pet = await AdoptablePetSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!pet) {
        return res.status(404).json({ message: 'Adoptable pet not found' });
      };
      return res.status(200).json(pet);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  deleteAdoptablePet: async (req, res) => {
    try {
      const pet = await AdoptablePetSchema.findByIdAndDelete(req.params.id);
      if (!pet) {
        return res.status(404).json({ message: 'Adoptable pet not found' });
      };
      return res.status(200).json({ message: 'Adoptable pet deleted successfully' });
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  }

};

