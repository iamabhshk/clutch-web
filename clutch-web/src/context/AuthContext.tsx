import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState(null);
    const isAuthenticated = !!user;

    const login = (userData: any) => setUser(userData);
    const logout = () => setUser(null);

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