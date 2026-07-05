import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type RegisterPayload = {
    email: string;
    password: string;
    gamertag: string;
};

type RegisterResponse = {
    token: string;
    user: {
        id: string;
        email: string;
        gamertag: string;
    };
}

function Register(){
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<RegisterPayload>({ email: '', password: '', gamertag: '' });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };
    
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        registerMutation.mutate(formData);
    };

    const registerMutation = useMutation({
        mutationFn: async (payload: RegisterPayload) => {
            const response = await api.post<RegisterResponse>('/api/auth/register', payload);
            return response.data;
        },
        onSuccess: () => {
            navigate('/login', { state: { message: 'Account created! Please sign in.' } });
        },
        onError: (err) => {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Registration failed. Please try again.');
                return;
            }
            setError('Registration failed. Please try again.');
        }
    });


    return (
        <div className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
            <div className="mx-auto flex max-w-md flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
                <h1 className="text-3xl font-semibold">Create an Account</h1>
                <p className="mt-2 text-sm text-slate-400">Join our community and start sharing your favorite games!</p>

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

                    <div>
                        <label className="mb-2 block text-sm font-medium" htmlFor="gamertag">
                            Choose a Gamertag
                        </label>
                        <input
                            id="gamertag"
                            name="gamertag"
                            type="text"
                            autoComplete="off"
                            required
                            value={formData.gamertag}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                            placeholder="Enter your gamertag"
                        />
                    </div>

                    {error ? <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p> : null}

                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {registerMutation.isPending ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register