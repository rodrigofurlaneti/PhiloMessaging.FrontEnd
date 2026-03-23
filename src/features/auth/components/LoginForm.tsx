import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Lock, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Importante para as bandeiras

export const LoginForm = () => {
    const { login, isLoading, error } = useAuth();
    const [password, setPassword] = useState('');
    const [value, setValue] = useState<string | undefined>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (value && password) {
            // value já vem formatado como +5511995882509
            await login({ phoneNumber: value, password });
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md animate-fade-in">
            <div className="mb-10 text-center">
                <div className="inline-flex p-4 rounded-3xl bg-philo-primary/10 mb-4 border border-philo-primary/20">
                    <ShieldCheck className="text-philo-primary" size={48} />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter">
                    Philo<span className="text-philo-primary">Messaging</span>
                </h1>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-[0.3em] mt-2">
                    Secure Gateway
                </p>
            </div>

            <div className="w-full bg-philo-card p-10 rounded-[2.5rem] shadow-2xl border border-white/5 backdrop-blur-md">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Campo de Telefone com Bandeiras */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-philo-primary uppercase tracking-widest ml-1">
                            Global Identity: Phone Number
                        </label>
                        <div className="philo-phone-container">
                            <PhoneInput
                                placeholder="Enter phone number"
                                value={value}
                                onChange={setValue}
                                defaultCountry="BR"
                                className="w-full flex items-center bg-philo-input rounded-2xl border border-transparent focus-within:border-philo-primary/40 transition-all duration-300 p-2"
                            />
                        </div>
                    </div>

                    {/* Campo de Senha */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-philo-primary uppercase tracking-widest ml-1">
                            Security: Access Key
                        </label>
                        <div className="relative flex items-center bg-philo-input rounded-2xl border border-transparent focus-within:border-philo-primary/40 transition-all duration-300">
                            <Lock className="ml-4 text-gray-500" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full p-4 bg-transparent text-gray-200 placeholder:text-gray-600 outline-none"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !value}
                        className="w-full bg-philo-primary hover:bg-philo-accent text-philo-bg font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-philo-primary/20 active:scale-[0.98] mt-4 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><span className="ml-2">AUTHENTICATE</span><ArrowRight size={18} /></>}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};