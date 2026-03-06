"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Anchor, Lock, Eye, EyeOff, Wind } from 'lucide-react';
import { Suspense } from 'react';

const getSafeAdminDestination = (value: string | null) => {
    if (!value || !value.startsWith('/') || value.startsWith('//')) {
        return '/admin';
    }

    const allowedPrefixes = ['/admin', '/cockpit', '/studio'];
    const isAllowed = allowedPrefixes.some((prefix) => value === prefix || value.startsWith(`${prefix}/`) || value.startsWith(`${prefix}?`));

    return isAllowed ? value : '/admin';
};

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = getSafeAdminDestination(searchParams.get('from'));

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.replace(from);
            } else {
                setError('Code incorrect. Réessayez.');
                setPassword('');
            }
        } catch {
            setError('Erreur réseau. Réessayez.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-500/3 rounded-full blur-[100px]" />
            </div>

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Card */}
            <div className="w-full max-w-sm relative">
                {/* Logo area */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                            <Anchor className="text-cyan-400" size={28} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-[0.15em] text-white">
                        CNC <span className="text-cyan-400">Control</span>
                    </h1>
                    <p className="text-[11px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-medium">
                        Espace Administration
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Lock size={15} className="text-slate-600" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                            required
                            placeholder="Code d'accès"
                            className="w-full pl-10 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 font-mono tracking-widest text-center focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-4 flex items-center text-slate-600 hover:text-slate-400 transition-colors"
                        >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <div className="size-1.5 rounded-full bg-red-400 shrink-0" />
                            <p className="text-[11px] text-red-400 font-medium">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !password}
                        className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-white/5 disabled:text-slate-600 text-[#0a1628] font-black uppercase tracking-[0.15em] text-[11px] rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Wind size={14} className="animate-spin" />
                                Connexion...
                            </>
                        ) : (
                            'Accéder'
                        )}
                    </button>
                </form>

                <p className="text-center text-[10px] text-slate-700 mt-8 uppercase tracking-widest font-medium">
                    Club Nautique de Coutainville
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
