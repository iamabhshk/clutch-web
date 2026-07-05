import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router';

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;