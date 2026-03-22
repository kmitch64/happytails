
import UserModel from '../models/user.model.js';
import { generateSecret, generateURI, verify } from 'otplib';
import qrcoce from 'qrcode';
import { generateToken } from '../utils/jwt.js';

const ISSUER = 'happytails.xyz';
export default {

  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response>}
   */
  validate: async (req, res) => {
    try {
      if (!req.user)
        return res.status(401).json({ message: "Unauthorized: no user data in token" });

      const user = await UserModel.findById(req.user._id).select('-password -otpSecret');
      return res.status(200).json({ user });
    }
    catch (e) {
      console.error('Validation error:', e);
      return res.status(500).json({ message: 'Internal Server Error' });
    };
  },

  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response>}
   */
  login: async (req, res) => {
    try {
      const
        { email, password } = req.body,
        user = await UserModel.findOne({ email });

      if (!user)
        return res.status(404).json({ success: false, message: 'User not found' });

      if (!await user.comparePassword(password))
        return res.status(401).json({ success: false, message: 'Invalid password' });

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
      return res.status(500).json({ message: 'Internal Server Error' });
    };
  },

  /**
   * 
   * @param {import("express").Request} _req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response>}
   */
  logout: async (_req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: "Logged out successfully" });
  },

  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response>}
   */

  setup2FA: async (req, res) => {
    const { email } = req.body;
    try {
      const secret = generateSecret();
      const otpauth = generateURI({ secret: secret, label: email, issuer: ISSUER });

      const user = await UserModel.findOneAndUpdate(
        { email },
        { otpSecret: secret },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const imageUrl = await qrcoce.toDataURL(otpauth);
      return res.status(200).json({ message: 'QR code generated', imageUrl });
    }
    catch (error) {
      console.error('Error in setup2FA:', error);
      return res.status(500).json({ message: 'Error generating QR code or storing secret', error });
    };
  },

  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response>}
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
      return res.status(200).json({ message: '2FA disabled successfully' });
    } catch (error) {
      console.error('Error in disable2FA:', error);
      return res.status(500).json({ message: 'Error disabling 2FA', error });
    }
  },

  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response>}
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

      const isValid = await verify({token: token, secret: secret});
      if (isValid) {
        user.is2FAEnabled = true;
        await user.save();
        return res.status(200).json({ message: '2FA setup is valid' });
      }
      else {
        return res.status(400).json({ message: 'Invalid OTP' });
      };
    }
    catch (error) {
      console.error('Error in verify2FASetup:', error);
      return res.status(500).json({ message: 'Error verifying 2FA setup', error });
    };
  },

  /**
   * 
   * @param {import("express").Request} req 
   * @param {import("express").Response} res 
   * @returns {Promise<import("express").Response>}
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

    const isValid = await verify({ token: token, secret: secret });
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
      return res.status(400).json({ message: 'OTP is invalid' });
    };
  }

};
