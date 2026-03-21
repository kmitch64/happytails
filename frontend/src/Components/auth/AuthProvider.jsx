
import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export default function AuthProvider({ children }) {
  const
    [isLoggedIn, setIsLoggedIn] = useState(false),
    [user, setUser] = useState(null),
    [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    /**
     * Validates the current user session by checking with the authentication API.
     * 
     * Makes a request to '/api/auth/validate' with credentials to verify if the user
     * has a valid session. Updates the authentication state based on the response:
     * - On success: sets isLoggedIn to true and updates user data
     * - On failure or error: sets isLoggedIn to false and clears user data
     * 
     * Always sets isLoading to false after completion, regardless of outcome.
     * 
     * @returns {Promise<void>} A promise that resolves when the session check is complete
     * @throws {Error} Silently catches and handles any errors during the session validation
     */
    async function checkSession() {
      try {
        const res = await fetch('/api/v1/auth/validate', {
          credentials: 'include'
        });

        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUser(data.user);
        }
        else {
          setIsLoggedIn(false);
          setUser(null);
        };
      }
      catch (e) {
        // console.error('Session check failed:', e);
        setIsLoggedIn(false);
        setUser(null);
      };
      setIsLoading(false);
    };
    checkSession();
  }, []);

  /**
   * Authenticates a user with email and password credentials.
   * 
   * @param {string} email - The user's email address
   * @param {string} password - The user's password
   * @returns {Promise<{success: boolean, message?: string}>} An object containing the success status and an optional error message
   * @throws {Error} Throws an error if the login request fails
   * 
   * @description
   * Sends a POST request to the '/api/auth/login' endpoint with the provided credentials.
   * On successful authentication:
   * - Sets the logged-in state to true
   * - Updates the user state with the returned user data
   * - Returns a success object
   * 
   * On failure:
   * - Returns an object with success: false and the error message
   */
  async function login(email, password) {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!res.ok) return { success: false, message: (await res.json()).message };

      const user = (await res.json()).user;
      if (user.is2FAEnabled) {
        return { success: true, requires2FA: true, userEmail: user.email };
      }
      else {
        setIsLoggedIn(true);
        setUser(user);
      };


      return { success: true };
    }
    catch (e) {
      // console.error('Login error:', e);
      return { success: false, message: e.message };
    };
  };

  async function verify2FA(email, token) {
    try {
      const res = await fetch('/api/v1/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
        credentials: 'include'
      });

      if (!res.ok) return { success: false, message: (await res.json()).message };

      const user = (await res.json()).user;
      setIsLoggedIn(true);
      setUser(user);

      return { success: true };
    }
    catch (e) {
      // console.error('2FA verification error:', e);
      return { success: false, message: e.message };
    };
  };

  /**
   * Registers a new user account.
   * 
   * @param {string} username - The username for the new account.
   * @param {string} email - The email address for the new account.
   * @param {string} password - The password for the new account.
   * @returns {Promise<{success: boolean, message?: string}>} A promise that resolves to an object containing:
   *   - success: boolean indicating if registration was successful
   *   - message: optional error message if registration failed
   * @throws Will catch and return fetch errors or network failures as {success: false, message: string}
   */
  async function register(username, email, password) {
    try {
      const res = await fetch('/api/v1/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
      });

      if (!res.ok) return { success: false, message: (await res.json()).message };

      return { success: true };
    }
    catch (e) {
      return { success: false, message: e.message };
    };
  };

  /**
   * Logs out the current user by calling the logout API endpoint.
   * Clears the user session and resets authentication state.
   * 
   * @returns {Promise<{success: boolean, message?: string}>} Returns an object indicating success or failure of the logout operation. On success, returns `{success: true}`. On failure, returns `{success: false, message: string}` with the error message.
   * @throws {Error} Does not throw - errors are caught and returned in the result object
   */
  async function logout() {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      setIsLoggedIn(false);
      setUser(null);
      return { success: true };
    }
    catch (e) {
      // console.error('Logout error:', e);
      return { success: false, message: e.message };
    };
  };

  async function disable2FA() {
    try {
      const res = await fetch('/api/v1/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
        credentials: 'include'
      });

      if (!res.ok) return { success: false, message: (await res.json()).message };

      const updatedUser = (await res.json()).user;
      setUser(updatedUser);

      return { success: true };
    }
    catch (e) {
      // console.error('Disable 2FA error:', e);
      return { success: false, message: e.message };
    };
  }

  return (
    <AuthContext.Provider value={{ isLoading, isLoggedIn, user, register, login, logout, verify2FA, disable2FA }}>
      {children}
    </AuthContext.Provider>
  );
};
