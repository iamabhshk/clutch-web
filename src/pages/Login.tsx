import { useMutation } from '@tanstack/react-query';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

type LoginPayload = {
    email: string;
    password: string;
};

type LoginResponse = {
    token: string;
    user: {
        id: string;
        email: string;
        gamertag: string;
    };
};

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.message;
    const { login: setAuthUser } = useAuth();
    const [formData, setFormData] = useState<LoginPayload>({ email: '', password: '' });
    const [error, setError] = useState('');

    const loginMutation = useMutation<LoginResponse, Error, LoginPayload>({
        mutationFn: async (payload) => {
            const response = await api.post<LoginResponse>('/api/auth/login', payload);
            return response.data;
        },
        onSuccess: (data) => {
            setAuthUser(data.user, data.token);
            navigate('/');
        },
        onError: (err) => {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Unable to sign in. Please try again.');
                return;
            }
            setError('Unable to sign in. Please try again.');
        }
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        loginMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
            <div className="mx-auto flex max-w-md flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
                <h1 className="text-3xl font-semibold">Welcome back</h1>
                <p className="mt-2 text-sm text-slate-400">Sign in to continue to Clutch.</p>
                {successMessage && (
                    <p className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-300">
                        {successMessage}
                    </p>
                )}
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-2 block text-sm font-medium" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none ring-0 transition focus:border-cyan-400"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                            placeholder="Enter your password"
                        />
                    </div>

                    {error ? <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p> : null}

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login