import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { setAuthToken } from '../lib/api'

type User = {
  id: string;
  email: string;
  gamertag: string;
};

type AuthContextValue = {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('clutch-user');
    const storedToken = localStorage.getItem('clutch-token');
    if (storedUser && storedToken) {
        setAuthToken(storedToken); // restore axios header
        return JSON.parse(storedUser);
    }
    return null;
    });
    const isAuthenticated = !!user;

    const login = (userData: User, token: string) => {
        localStorage.setItem('clutch-token', token);
        localStorage.setItem('clutch-user', JSON.stringify(userData));
        setAuthToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('clutch-token');
        localStorage.removeItem('clutch-user');
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};