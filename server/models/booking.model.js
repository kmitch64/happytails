
// models/booking.model.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  sitter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PetSitter',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['Dog Walking', 'Pet Boarding', 'Day Care', 'Home Visits', 'Grooming'],
    required: true
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Requested', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
    default: 'Requested'
  },
  specialInstructions: String,
  totalPrice: Number,
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Booking', bookingSchema);

