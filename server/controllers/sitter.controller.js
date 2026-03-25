
import PetSitter from '../models/pet_sitter.model.js';
import User from '../models/user.model.js';


export default {
  getAllSitters: async (req, res) => {
    try {
      const sitters = await PetSitter.find()
        .populate('user', 'username email role')
        .sort({ createdAt: -1 });

      return res.status(200).json(sitters);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  getSitterById: async (req, res) => {
    try {
      const sitter = await PetSitter.findById(req.params.id)
        .populate('user', 'username email role');

      if (!sitter) {
        return res.status(404).json({ message: 'Pet sitter not found' });
      };

      return res.status(200).json(sitter);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  createSitterProfile: async (req, res) => {
    try {
      const existingProfile = await PetSitter.findOne({ user: req.user._id });
      if (existingProfile) {
        return res.status(400).json({ message: 'You already have a pet sitter profile' });
      };

      const profile = new PetSitter({
        user: req.user._id,
        ...req.body
      });

      const savedProfile = await profile.save();

      await User.findByIdAndUpdate(
        req.user._id,
        { role: 'PetSitter' }
      );

      return res.status(201).json(savedProfile);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  updateSitterProfile: async (req, res) => {
    try {
      const profile = await PetSitter.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body,
        { new: true }
      );

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found or you are not the owner' });
      };

      return res.status(200).json(profile);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  deleteSitterProfile: async (req, res) => {
    try {
      const profile = await PetSitter.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found or you are not the owner' });
      };

      await User.findByIdAndUpdate(
        req.user._id,
        { role: 'PetOwner' }
      );

      return res.status(200).json({ message: 'Pet sitter profile deleted successfully' });
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  getAvailability: async (req, res) => {
    try {
      const sitter = await PetSitter.findById(req.params.id);
      if (!sitter) {
        return res.status(404).json({ message: 'Pet sitter not found' });
      };

      return res.status(200).json(sitter.availability);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  updateAvailability: async (req, res) => {
    try {
      const sitter = await PetSitter.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { availability: req.body },
        { new: true }
      );

      if (!sitter) {
        return res.status(404).json({ message: 'Pet sitter not found or you are not the owner' });
      };

      return res.status(200).json(sitter.availability);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  getReviews: async (req, res) => {
    try {
      const sitter = await PetSitter.findById(req.params.id);
      if (!sitter) {
        return res.status(404).json({ message: 'Pet sitter not found' });
      };

      return res.status(200).json(sitter.reviews);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  addReview: async (req, res) => {
    try {
      const sitter = await PetSitter.findById(req.params.id);
      if (!sitter) {
        return res.status(404).json({ message: 'Pet sitter not found' });
      };

      const hasBooked = false; // You would implement this check with your booking model
      if (!hasBooked) {
        return res.status(403).json({ message: 'You can only review sitters you have booked' });
      };

      const review = {
        user: req.user._id,
        rating: req.body.rating,
        comment: req.body.comment,
        date: new Date()
      };

      sitter.reviews.push(review);
      await sitter.save();

      return res.status(201).json(review);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  }

};

