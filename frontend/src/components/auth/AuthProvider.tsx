
import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';


/**
 * AuthProvider component to provide authentication context to its children.
 * Handles user session validation, login, logout, registration, 2FA verification, and 2FA disabling.
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  const
    [isLoggedIn, setIsLoggedIn] = useState<boolean>(false),
    [user, setUser] = useState<User | null>(null),
    [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkSession(): Promise<void> {
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
      catch {
        setIsLoggedIn(false);
        setUser(null);
      }
      finally {
        setIsLoading(false);
      };
    };
    checkSession();

  }, []);

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!res.ok)
        return { success: false, message: (await res.json()).message };

      const data = await res.json();

      if (!data.user.isVerified)
        return { success: false, message: 'Please verify your email before logging in.' };

      if (data.user.isAdmin)
        data.user.role = 'Admin';

      if (data.user.is2FAEnabled)
        return { success: true, message: '', requires2FA: true, userEmail: data.user.email };

      setIsLoggedIn(true);
      setUser(data.user);

      return { success: true, message: '' };
    }
    catch (e: any) {
      return { success: false, message: e.message };
    }
    finally {
      setIsLoading(false);
    };
  };

  /**
   * Logs out the currently logged-in user.
   */
  async function logout() {
    setIsLoading(true);
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      setIsLoggedIn(false);
      setUser(null);

      return { success: true, message: '' };
    }
    catch (e: any) {
      return { success: false, message: e.message };
    }
    finally {
      setIsLoading(false);
    };
  };

  /**
   * Registers a new user with the provided username, email, and password.
   * @param username - The user's chosen username
   * @param email - The user's email address
   * @param password - The user's password
   */
  async function register(username: string, email: string, password: string) {
    try {
      const res = await fetch('/api/v1/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
      });

      if (!res.ok)
        return { success: false, message: (await res.json()).message || 'Registration failed' };

      const data = await res.json();

      return { success: true, message: data.message || 'Registration successful' };
    }
    catch (e: any) {
      return { success: false, message: e.message || 'We encountered an error during registration, Please try again later. If the problem persists, contact support.' };
    };
  };

  /**
   * Verifies a user's 2FA token.
   * @param email - The user's email address
   * @param token - The 2FA token
   */
  async function verify2FA(email: string, token: string) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
        credentials: 'include'
      });

      if (!res.ok)
        return { success: false, message: (await res.json()).message || '2FA verification failed' };

      const data = await res.json();
      setIsLoggedIn(true);
      setUser(data.user);

      return { success: true, message: '' };
    }
    catch (e: any) {
      return { success: false, message: e.message };
    }
    finally {
      setIsLoading(false);
    };
  };

  /**
   * Disables 2FA for the currently logged-in user.
   */
  async function disable2FA() {
    setIsLoading(true);
    try {
      if (!user)
        return { success: false, message: 'No user logged in' };

      const res = await fetch('/api/v1/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
        credentials: 'include'
      });

      if (!res.ok)
        return { success: false, message: (await res.json()).message || 'Failed to disable 2FA' };

      const data = await res.json();
      setUser(data.user);

      return { success: true, message: '' };
    }
    catch (e: any) {
      return { success: false, message: e.message };
    }
    finally {
      setIsLoading(false);
    };
  };

  return (
    <AuthContext.Provider value={{ isLoading, isLoggedIn, user, register, login, logout, verify2FA, disable2FA }}>
      {children}
    </AuthContext.Provider>
  );

};
