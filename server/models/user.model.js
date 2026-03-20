
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'


const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  otpSecret: { type: String, default: null },
  is2FAEnabled: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  preferences: {
    notifications: { type: Boolean, default: true },
    '2fa': { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true }
);

userSchema.pre('save', async function () {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  // next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
