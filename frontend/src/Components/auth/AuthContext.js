
import { createContext, useContext } from 'react';


/**
 * user object
 */
// export interface User {
//   email: string;
//   is2FAEnabled?: boolean;
//   [key: string]: any;
// };

/**
 * Defines the shape of the authentication context, including user information, authentication status, loading state, and methods for login, logout, registration, 2FA verification, and 2FA disabling.
 * This context will be used by the AuthProvider to manage authentication state and provide it to the rest of the application.
 */
// export interface AuthContextType {
//   isLoggedIn: boolean;
//   user: User | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<{ success: boolean; message: string; requires2FA?: boolean; userEmail?: string }>;
//   logout: () => Promise<{ success: boolean; message: string }>;
//   register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
//   verify2FA: (email: string, token: string) => Promise<{ success: boolean; message: string }>;
//   disable2FA: () => Promise<{ success: boolean; message: string }>;
// };

export const AuthContext = createContext/*<AuthContextType | null>*/(null);

/**
 * Custom hook to access the authentication context.
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
