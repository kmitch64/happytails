
// models/adoptionApplication.model.js
import mongoose from 'mongoose';

const adoptionApplicationSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Adopted'],
    default: 'Submitted'
  },
  answers: {
    homeEnvironment: String,
    petExperience: String,
    dailySchedule: String,
    vetReference: String,
    otherPets: String,
    whyThisPet: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [String],
  documents: [String] // URLs to uploaded documents
}, { timestamps: true });

export default mongoose.model('AdoptionApplication', adoptionApplicationSchema);

