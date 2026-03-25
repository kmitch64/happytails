
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: {
    data: Buffer,  // Store image as Buffer
    contentType: String  // Store content type (e.g., 'image/jpeg')
  },
  otpSecret: { type: String, default: null },
  is2FAEnabled: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['PetOwner', 'PetSitter', 'ShelterStaff', 'Admin'],
    default: 'PetOwner'
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    '2fa': { type: Boolean, default: false },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
  savedPets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);