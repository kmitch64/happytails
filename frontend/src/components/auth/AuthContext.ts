
import { createContext, useContext } from 'react';

type AuthContextType = {
    isLoading: boolean;
    isLoggedIn: boolean;
    user: any;
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string; requires2FA?: boolean; userEmail?: string }>;
    logout: () => Promise<{ success: boolean; message: string }>;
    verify2FA: (email: string, token: string) => Promise<{ success: boolean; message: string }>;
    disable2FA: () => Promise<{ success: boolean; message: string }>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

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
