
import Pet from '../models/pet.model.js';
import User from '../models/user.model.js';

import Interactions from '../../server/utils/weaviate/Interactions.js';


export default {
  getAllPets: async (req, res) => {
    try {
      const pets = await Pet.find().populate('owner', 'username email');
      return res.status(200).json(pets);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  getUserPets: async (req, res) => {
    try {
      const pets = await Pet.find({ owner: req.user._id }).sort({ createdAt: -1 });
      return res.status(200).json(pets);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  getPetById: async (req, res) => {
    try {
      const pet = await Pet.findById(req.params.id).populate('owner', 'username email');
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      };
      return res.status(200).json(pet);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  createPet: async (req, res) => {
    try {
      const interactions = new Interactions(req.user.username, "mistral");
      const requiredFields = ['name', 'bio', 'type', 'sex', 'age', 'size', 'energyLevel', 'spayedNeutered', 'compatibility'];
      
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ message: `${field} is required` });
        }
      };

      const petData = {
        name: req.body.name,
        bio: req.body.bio,
        type: req.body.type,
        breed: req.body.breed || '',
        sex: req.body.sex,
        age: req.body.age,
        size: req.body.size,
        energyLevel: req.body.energyLevel,
        spayedNeutered: req.body.spayedNeutered,
        compatibility: req.body.compatibility,
        owner: req.user._id,
        images: req.body.images || [],
        careReminders: [],
        medicalRecords: []
      };

      const pet = new Pet(petData);
      const savedPet = await pet.save();

      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { pets: savedPet._id } }
      );

      await interactions.storeInteractionPayload(req.user.username, savedPet);

      return res.status(201).json(savedPet);
    } 
    catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ messages });
      };

      return res.status(500).json({ message: error.message });
    }
  },

  updatePet: async (req, res) => {
    try {
      const interactions = new Interactions(req.user.username, "mistral");
      const pet = await Pet.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        req.body,
        { returnDocument: 'after', runValidators: true }
      );

      if (!pet) {
        return res.status(404).json({ message: 'Pet not found or you are not the owner' });
      };

      // trim unused fields from pet object to reduce noise in vector database
      const petContext = {
        name: pet.name,
        bio: pet.bio,
        type: pet.type,
        breed: pet.breed,
        sex: pet.sex,
        age: pet.age,
        size: pet.size,
        energyLevel: pet.energyLevel,
        spayedNeutered: pet.spayedNeutered,
        compatibility: pet.compatibility,
        owner: pet.owner.toString(),
        // images: pet.images,
        careReminders: pet.careReminders.map(reminder => ({
          type: reminder.type,
          description: reminder.description,
          date: reminder.date,
          frequency: reminder.frequency,
          completed: reminder.completed
        })),
        medicalRecords: pet.medicalRecords.map(record => ({
          type: record.type,
          description: record.description,
          date: record.date,
          veterinarian: record.veterinarian,
          notes: record.notes
        }))
      };
      await interactions.storeInteractionPayload(req.user.username, petContext );

      return res.status(200).json(pet);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  deletePet: async (req, res) => {
    try {
      const pet = await Pet.findOneAndDelete(
        { _id: req.params.id, owner: req.user._id }
      );

      if (!pet) {
        return res.status(404).json({ message: 'Pet not found or you are not the owner' });
      };

      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { pets: pet._id } }
      );

      return res.status(200).json({ message: 'Pet deleted successfully' });
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  addCareReminder: async (req, res) => {
    try {
      const pet = await Pet.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        { $push: { careReminders: req.body } },
        { returnDocument: 'after' }
      );

      if (!pet) {
        return res.status(404).json({ message: 'Pet not found or you are not the owner' });
      };

      return res.status(200).json(pet);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  updateCareReminder: async (req, res) => {
    try {
      const { id, reminderId } = req.params;

      const pet = await Pet.findOneAndUpdate(
        {
          _id: id,
          owner: req.user._id,
          'careReminders._id': reminderId
        },
        {
          $set: {
            'careReminders.$.completed': req.body.completed
          }
        },
        { returnDocument: 'after' }

      );

      if (!pet) {
        return res.status(404).json({
          message: 'Pet or reminder not found or you are not the owner'
        });
      }

      return res.status(200).json(pet);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },


  deleteCareReminder: async (req, res) => {
    try {
      const { petId, reminderId } = req.params;

      const pet = await Pet.findOneAndUpdate(
        { _id: petId, owner: req.user._id },
        { $pull: { careReminders: { _id: reminderId } } },
        { returnDocument: 'after' }
      );

      if (!pet) {
        return res.status(404).json({ message: 'Pet not found or you are not the owner' });
      };

      return res.status(200).json(pet);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  addMedicalRecord: async (req, res) => {
    try {
      const pet = await Pet.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        { $push: { medicalRecords: req.body } },
        { returnDocument: 'after' }
      );

      if (!pet) {
        return res.status(404).json({ message: 'Pet not found or you are not the owner' });
      };

      return res.status(200).json(pet);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  updateMedicalRecord: async (req, res) => {
    try {
      const { id, recordId } = req.params;

      const pet = await Pet.findOneAndUpdate(
        {
          _id: id,
          owner: req.user._id,
          'medicalRecords._id': recordId
        },
        { $set: { 'medicalRecords.$': req.body } },
        { returnDocument: 'after' }
      );

      if (!pet) {
        return res.status(404).json({ message: 'Pet or record not found or you are not the owner' });
      }

      return res.status(200).json(pet);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },


  deleteMedicalRecord: async (req, res) => {
    try {
      const { id, recordId } = req.params;

      const pet = await Pet.findOneAndUpdate(
        { _id: id, owner: req.user._id },
        { $pull: { medicalRecords: { _id: recordId } } },
        { returnDocument: 'after' }
      );

      if (!pet) {
        return res.status(404).json({ message: 'Pet not found or you are not the owner' });
      }

      return res.status(200).json(pet);
    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }



};

