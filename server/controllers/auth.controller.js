
import express from 'express';
import UserModel from '../models/user.model.js';
import otplib from 'otplib';
import qrcoce from 'qrcode';
import { generateToken } from '../utils/jwt.js';


export default {

  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @returns 
   */
  validate: async (req, res) => {
    const user = await UserModel.findById(req.user._id).select('-password -otpSecret');
    return res.status(200).json({ user });
  },

  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @returns 
   */
  loginUser: async (req, res) => {
    try {
      const
        { email, password } = req.body,
        user = await UserModel.findOne({ email });

      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      if (!await user.comparePassword(password)) return res.status(401).json({ success: false, message: 'Invalid password' });

      const token = await generateToken(user);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      req.user = {
        _id: user._id,
        email: user.email,
        username: user.username,
        is2FAEnabled: user.is2FAEnabled,
        isAdmin: user.isAdmin
      };

      return res.status(200).json({ user: req.user });
    }
    catch (e) {
      console.error('Login error:', e);
      return res.status(500).json('Internal Server Error');
    };
  },

  /**
   * @param {express.Request} _ 
   * @param {express.Response} res 
   * @returns 
   */
  logout: (_, res) => {
    res.clearCookie('token');
    return res.status(200).json("Logged out successfully");
  },

  /**
   * 
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @returns 
   */
  setup2FA: async (req, res) => {
  const { email } = req.body;
  try {
    const secret = otplib.authenticator.generateSecret();
    const otpauth = otplib.authenticator.keyuri(email, 'goodsie.ca', secret);

    const user = await UserModel.findOneAndUpdate(
      { email },
      { otpSecret: secret },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const imageUrl = await qrcoce.toDataURL(otpauth);
    res.status(200).json({ message: 'QR code generated', imageUrl });
  } 
  catch (error) {
    console.error('Error in setup2FA:', error);
    res.status(500).json({ message: 'Error generating QR code or storing secret', error });
  };
},

  /**
   * 
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @returns 
   */
  disable2FA: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await UserModel.findOneAndUpdate(
        { email },
        { is2FAEnabled: false, otpSecret: null },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: '2FA disabled successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error disabling 2FA', error });
    }
  },

  /**
   * 
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @returns 
   */
  verify2FASetup: async (req, res) => {
  const { email, token } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    };

    const secret = user.otpSecret;
    if (!secret) {
      return res.status(400).json({ message: '2FA secret not found. Please generate a QR code first.' });
    };

    const isValid = otplib.authenticator.check(token, secret);
    if (isValid) {
      user.is2FAEnabled = true;
      await user.save();
      res.status(200).json({ message: '2FA setup is valid' });
    } 
    else {
      res.status(400).json({ message: 'Invalid OTP' });
    };
  } 
  catch (error) {
    console.error('Error in verify2FASetup:', error);
    res.status(500).json({ message: 'Error verifying 2FA setup', error });
  };
},

  /**
   * 
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @returns 
   */
  verifyOTP: async (req, res) => {

    const { email, token } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const secret = user.otpSecret;
    if (!secret) {
      return res.status(400).json({ message: '2FA is not setup for this user' });
    }

    const isValid = otplib.authenticator.check(token, secret);
    if (isValid) {
      const token = await generateToken(user);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      req.user = {
        _id: user._id,
        email: user.email,
        username: user.username,
        is2FAEnabled: user.is2FAEnabled,
        isAdmin: user.isAdmin
      };

      return res.status(200).json({ user: req.user });
    }
    else {
      res.status(400).send('OTP is invalid');
    };
  }

};
