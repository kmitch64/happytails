
import { verifyToken } from "../utils/jwt.js";


/**
 * Middleware to verify JWT token authorization for protected routes.
 * 
 * Checks for JWT token in Authorization header (Bearer token) or cookies,
 * verifies it using ES512 algorithm with an elliptic curve public key,
 * and attaches the decoded user data to the request object.
 * 
 * @param {import("express").Request} req - The Express request object
 * @param {import("express").Response} res - The Express response object
 * @param {import("express").NextFunction} next - The next middleware function
 * @returns {Promise<import("express").Response|void>} A promise that resolves to a response if unauthorized, or calls next() if authorized
 * @throws {Error} If token verification fails or an unexpected error occurs
 */
async function isAuthorized(req, res, next) {
  try {
  /**@type {string} */let token;
  /**@type {string} */const authheader = req.headers.authorization;

    if (authheader && authheader.startsWith('Bearer ')) token = authheader.split(" ")[1];
    else if (req.cookies.token) token = req.cookies.token;

    if (!token) return //res.status(401).json({ message: "Unauthorized: missing token" });

    req.user = await verifyToken(token);
    next();
  }
  catch (e) {
    console.log("Error in Auth Middleware: ", e);
    return res.status(500).json({ message: "Internal Server Error (auth)" });
  };

};
export default isAuthorized;
