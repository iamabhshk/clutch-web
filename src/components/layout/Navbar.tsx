import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-cyan-400">
                    Clutch
                </Link>

                <div className="flex items-center gap-4">
                    {isAuthenticated && user ? (
                        <>
                            <span className="text-sm text-slate-300">
                                {user.gamertag}
                            </span>
                            <Link
                                to="/create"
                                className="text-sm bg-cyan-500 text-slate-950 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition"
                            >
                                + Post
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm text-slate-400 hover:text-slate-100 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm text-slate-300 hover:text-slate-100 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm bg-cyan-500 text-slate-950 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;