
import jwt from 'jsonwebtoken';
import { readFile } from 'fs/promises';
import { join } from 'path';


/**
 * Generates a JWT token for a user using ES512 algorithm.
 * 
 * @param {Object} user - The user object to generate token for
 * @param {string} user._id - The user's ID
 * @param {string} user.email - The user's email address
 * @param {string} user.username - The user's username
 * @param {boolean} user.is2FAEnabled - Whether the user has 2FA enabled
 * @param {boolean} user.isAdmin - Whether the user has admin privileges
 * @returns {Promise<string>} A promise that resolves to the generated JWT token
 * @throws {Error} If token generation fails or private key file cannot be read
 */
async function generateToken(user) {

  const
    key_path = join(process.cwd(), process.env.NODE_ENV === 'production' ? 'etc/secrets/ec-private-key.pem' : '../etc/secrets/ec-private-key.pem'),
    key_file = await readFile(key_path, 'utf8');

  return await new Promise(async (resolve, reject) => {

    jwt.sign(
      {
        _id: user._id,
        email: user.email,
        username: user.username,
        is2FAEnabled: user.is2FAEnabled,
        isAdmin: user.isAdmin
      },
      key_file,
      { algorithm: 'ES512', expiresIn: '30d' },

      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );

  });
};

/**
 * Verifies a JWT token using ES512 algorithm.
 * @param {string} token - The JWT token to verify
 * @returns {Promise<Object>} A promise that resolves to the decoded token payload
 * @throws {Error} If token verification fails or public key file cannot be read
 */
async function verifyToken(token) {
  const
    publicKey = await readFile(join(process.cwd(), process.env.NODE_ENV === 'production' ? 'etc/secrets/ec-public-key.pem' : '../etc/secrets/ec-public-key.pem'), 'utf8');

  return await new Promise((resolve, reject) => {

    jwt.verify(token,
      publicKey,
      { algorithms: ['ES512'] },

      (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });

  });

};

export { generateToken, verifyToken };