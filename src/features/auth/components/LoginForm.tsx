import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Lock, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import { useTranslation } from 'react-i18next'; // 1. Importar o hook de tradução
import { LanguageSelector } from '@/components/ui/LanguageSelector'; // 2. Importar seu novo seletor
import 'react-phone-number-input/style.css';

interface LoginFormProps {
    onToggleRegister: () => void;
}

export const LoginForm = ({ onToggleRegister }: LoginFormProps) => {
    const { t } = useTranslation(); // 3. Inicializar a função de tradução 't'
    const { login, isLoading, error } = useAuth();
    const [password, setPassword] = useState('');
    const [value, setValue] = useState<string | undefined>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (value && password) {
            await login({ phoneNumber: value, password });
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md animate-fade-in">

            {/* 4. Posicionamento do Seletor de Idiomas */}
            <LanguageSelector />

            {/* Header / Logo */}
            <div className="mb-10 text-center">
                <div className="inline-flex p-4 rounded-3xl bg-philo-primary/10 mb-4 border border-philo-primary/20">
                    <ShieldCheck className="text-philo-primary" size={48} />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter">
                    Philo<span className="text-philo-primary">Messaging</span>
                </h1>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-[0.3em] mt-2">
                    {t('auth.secure_gateway')} {/* Tradução do subtítulo */}
                </p>
            </div>

            {/* Card Principal */}
            <div className="w-full bg-philo-card p-10 rounded-[2.5rem] shadow-2xl border border-white/5 backdrop-blur-md">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Campo de Telefone */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-philo-primary uppercase tracking-widest ml-1">
                            {t('auth.phone_label')}
                        </label>
                        <div className="philo-phone-container">
                            <PhoneInput
                                placeholder={t('auth.phone_placeholder')}
                                value={value}
                                onChange={setValue}
                                defaultCountry="BR"
                                className="w-full flex items-center bg-philo-input rounded-2xl border border-transparent focus-within:border-philo-primary/40 transition-all duration-300 p-2"
                            />
                        </div>
                    </div>

                    {/* Campo de Senha */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-bold text-philo-primary uppercase tracking-widest">
                                {t('auth.password_label')}
                            </label>
                            <button
                                type="button"
                                className="text-[9px] font-bold text-philo-primary/60 hover:text-philo-primary uppercase transition-colors"
                            >
                                {t('auth.forgot_password')}
                            </button>
                        </div>
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

                    {/* Botão de Autenticação */}
                    <button
                        type="submit"
                        disabled={isLoading || !value}
                        className="w-full bg-philo-primary hover:bg-philo-accent text-philo-bg font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-philo-primary/20 active:scale-[0.98] mt-4 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span className="ml-2">{t('auth.btn_login')}</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                    {/* Alternar para Registro */}
                    <button
                        type="button"
                        onClick={onToggleRegister}
                        className="w-full text-[10px] font-bold text-gray-500 hover:text-philo-primary uppercase tracking-[0.2em] transition-colors mt-2"
                    >
                        {t('auth.switch_to_register')}
                    </button>

                    {/* Feedback de Erro */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium animate-pulse">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};