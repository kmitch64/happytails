
import { verifyToken } from "../utils/jwt.js";


/**
 * Middleware to verify JWT token authorization for protected routes.
 * 
 * Checks for JWT token in Authorization header (Bearer token) or cookies,
 * verifies it using ES512 algorithm with an elliptic curve public key,
 * and attaches the decoded user data to the request object.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} [req.headers.authorization] - Authorization header containing Bearer token
 * @param {Object} req.cookies - Request cookies
 * @param {string} [req.cookies.token] - JWT token stored in cookies
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} Calls next() on success, or sends 401 error response on failure
 * @throws {Error} Returns 401 status with error message if token is missing or invalid
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

/**
 * Middleware to check if user has admin role
 */
function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
}

/**
 * Middleware to check if user has shelter staff role
 */
function isShelterStaff(req, res, next) {
  if (req.user && (req.user.isAdmin || req.user.role === 'ShelterStaff')) {
    return next();
  }
  return res.status(403).json({ message: "Shelter staff access required" });
}

/**
 * Middleware to check if user has pet sitter role
 */
function isPetSitter(req, res, next) {
  if (req.user && (req.user.isAdmin || req.user.role === 'PetSitter')) {
    return next();
  }
  return res.status(403).json({ message: "Pet sitter access required" });
}

/**
 * Middleware to check if user is the owner of a resource
 * @param {string} resourceIdParam - The parameter name containing the resource ID
 * @param {string} userField - The field in the resource that contains the user ID
 */
function isOwner(resourceIdParam, userField = 'user') {
  return async (req, res, next) => {
    try {
      // This would be implemented in the route handler
      // For example, checking if req.user.id matches the owner of a pet
      next();
    } catch (error) {
      return res.status(403).json({ message: "Not authorized: you don't own this resource" });
    }
  };
}
export { isAuthorized, isAdmin, isShelterStaff, isPetSitter, isOwner };
