
import Booking from '../models/booking.model.js';
import Pet from '../models/pet.model.js';
import PetSitter from '../models/pet_sitter.model.js';
// import User from '../models/user.model.js';

export default {
  getAllBookings: async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      };

      const bookings = await Booking.find()
        .populate('pet', 'name type')
        .populate('sitter', 'user')
        .populate('owner', 'username email')
        .sort({ startDateTime: -1 });

      return res.status(200).json(bookings);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  getUserBookings: async (req, res) => {
    try {
      const bookings = await Booking.find({ owner: req.user._id })
        .populate('pet', 'name type')
        .populate('sitter', 'user')
        .sort({ startDateTime: -1 });

      return res.status(200).json(bookings);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  getSitterBookings: async (req, res) => {
    try {
      const sitterProfile = await PetSitter.findOne({ user: req.user._id });
      if (!sitterProfile) {
        return res.status(404).json({ message: 'You are not a registered pet sitter' });
      };

      const bookings = await Booking.find({ sitter: sitterProfile._id })
        .populate('pet', 'name type')
        .populate('owner', 'username email')
        .sort({ startDateTime: -1 });

      return res.status(200).json(bookings);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  getBookingById: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate('pet', 'name type')
        .populate('sitter', 'user')
        .populate('owner', 'username email');

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      };

      if (booking.owner.toString() !== req.user._id &&
          booking.sitter.toString() !== req.user.sitterProfile &&
          !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized to view this booking' });
      };

      return res.status(200).json(booking);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  createBooking: async (req, res) => {
    try {
      const { petId, sitterId, serviceType, startDateTime, endDateTime, specialInstructions } = req.body;

      const pet = await Pet.findOne({ _id: petId, owner: req.user._id });
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found or you are not the owner' });
      };

      const sitter = await PetSitter.findById(sitterId);
      if (!sitter) {
        return res.status(404).json({ message: 'Pet sitter not found' });
      };

      const isAvailable = true; // TODO: availability check logic
      if (!isAvailable) {
        return res.status(400).json({ message: 'Pet sitter is not available at the requested time' });
      };

      const totalPrice = 0; // TODO: price calculation logic
      const booking = new Booking({
        pet: petId,
        sitter: sitterId,
        owner: req.user._id,
        serviceType,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        specialInstructions,
        totalPrice,
        status: 'Requested'
      });

      const savedBooking = await booking.save();

      return res.status(201).json(savedBooking);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  updateBookingStatus: async (req, res) => {
    try {
      const { status } = req.body;

      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      };

      const sitterProfile = await PetSitter.findOne({ user: req.user._id });
      if (!sitterProfile || (booking.sitter.toString() !== sitterProfile._id.toString() && !req.user.isAdmin)) {
        return res.status(403).json({ message: 'Not authorized to update this booking' });
      };

      const validTransitions = {
        'Requested': ['Confirmed', 'Rejected'],
        'Confirmed': ['Completed', 'Cancelled'],
        'Completed': [],
        'Cancelled': [],
        'Rejected': []
      };

      if (!validTransitions[booking.status].includes(status)) {
        return res.status(400).json({ message: 'Invalid status transition' });
      };

      const updatedBooking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      return res.status(200).json(updatedBooking);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  updateBooking: async (req, res) => {
    try {
      const booking = await Booking.findOneAndUpdate(
        {
          _id: req.params.id,
          $or: [
            { owner: req.user._id },
            { sitter: await PetSitter.findOne({ user: req.user._id }) }
          ]
        },
        req.body,
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found or you are not authorized to update it' });
      };

      return res.status(200).json(booking);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  deleteBooking: async (req, res) => {
    try {
      const booking = await Booking.findOneAndDelete({
        _id: req.params.id,
        $or: [
          { owner: req.user._id },
          { sitter: await PetSitter.findOne({ user: req.user._id }) }
        ]
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found or you are not authorized to delete it' });
      };

      return res.status(200).json({ message: 'Booking deleted successfully' });
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  }

};

