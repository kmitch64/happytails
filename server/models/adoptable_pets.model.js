
import mongoose from 'mongoose';

const AdoptablePetSchema = new mongoose.Schema({
  petid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    enum: ['M', 'F', 'Unknown'],
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    required: true,
  },
  energyLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Very High'],
    required: true,
  },
  spayedNeutered: {
    type: String,
    enum: ['Y', 'N', 'Unknown'],
    required: true
  },
  compatibility: {
    type: [String],
    required: true
  },
  breed: {
    type: String
  },
  images: {
    type: [{ data: String, contentType: String }],
    default: []
  },
  status: {
    type: String,
    enum: ['Active', 'Deceased', 'Missing'],
    default: 'Active'
  },
  adoption_status: {
    type: String,
    enum: ['Available', 'Adopted', 'Pending', 'Reserved', ''],
    default: 'Available'
  },
  adoption_process_status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

AdoptablePetSchema.pre('save', async function(/*next*/) {
  this.updatedAt = Date.now();
  //next();
});

export default mongoose.model('AdoptablePet', AdoptablePetSchema);
