
/**
 * user object
 */
export interface User {
  email: string;
  is2FAEnabled?: boolean;
  [key: string]: any;
}

/**
 * Defines the shape of the authentication context, including user information, authentication status, loading state, and methods for login, logout, registration, 2FA verification, and 2FA disabling.
 * This context will be used by the AuthProvider to manage authentication state and provide it to the rest of the application.
 */
export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; requires2FA?: boolean; userEmail?: string }>;
  logout: () => Promise<{ success: boolean; message: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  verify2FA: (email: string, token: string) => Promise<{ success: boolean; message: string }>;
  disable2FA: () => Promise<{ success: boolean; message: string }>;
}

export declare const AuthContext: import("react").Context<AuthContextType>;

export declare function useAuth(): AuthContextType;