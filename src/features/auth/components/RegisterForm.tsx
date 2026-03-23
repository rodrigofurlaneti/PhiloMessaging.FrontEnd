import React, { useState } from 'react';
import { useRegister } from '../hooks/useRegister';
import { User, Lock, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import { useTranslation } from 'react-i18next'; 
import { LanguageSelector } from '@/components/ui/LanguageSelector'; 
import 'react-phone-number-input/style.css';

interface RegisterFormProps {
    onToggleLogin: () => void;
}

export const RegisterForm = ({ onToggleLogin }: RegisterFormProps) => {
    const { t } = useTranslation(); // 3. Inicializa tradução
    const { register, isLoading, error } = useRegister();

    const [phoneValue, setPhoneValue] = useState<string | undefined>();
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (phoneValue && email) {
            const phoneNumberData = parsePhoneNumber(phoneValue);
            if (phoneNumberData) {
                const result = await register({
                    phoneNumber: phoneNumberData.nationalNumber as string,
                    countryCode: `+${phoneNumberData.countryCallingCode}`,
                    displayName,
                    email,
                    password
                });

                if (result) {
                    window.location.reload();
                }
            }
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md animate-fade-in">

            {/* Seletor de Idiomas no topo do formulário */}
            <LanguageSelector />

            <div className="mb-8 text-center">
                <div className="inline-flex p-4 rounded-3xl bg-philo-primary/10 mb-4 border border-philo-primary/20">
                    <ShieldCheck className="text-philo-primary" size={40} />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter">
                    {t('auth.join')} <span className="text-philo-primary">Philo</span>
                </h1>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
                    {t('auth.register_subtitle')}
                </p>
            </div>

            <div className="w-full bg-philo-card p-10 rounded-[2.5rem] shadow-2xl border border-white/5 backdrop-blur-md">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Full Name */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-philo-primary uppercase tracking-widest ml-1">
                            {t('auth.full_name_label')}
                        </label>
                        <div className="relative flex items-center bg-philo-input rounded-2xl border border-transparent focus-within:border-philo-primary/40 transition-all duration-300">
                            <User className="ml-4 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Rodrigo Furlaneti"
                                className="w-full p-4 bg-transparent text-gray-200 outline-none placeholder:text-gray-700"
                                value={displayName}
                                onChange={e => setDisplayName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* E-mail Address */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-philo-primary uppercase tracking-widest ml-1">
                            {t('auth.email_label')}
                        </label>
                        <div className="relative flex items-center bg-philo-input rounded-2xl border border-transparent focus-within:border-philo-primary/40 transition-all duration-300">
                            <Mail className="ml-4 text-gray-500" size={18} />
                            <input
                                type="email"
                                placeholder="exemplo@furlaneti.com"
                                className="w-full p-4 bg-transparent text-gray-200 outline-none placeholder:text-gray-700"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-philo-primary uppercase tracking-widest ml-1">
                            {t('auth.phone_label')}
                        </label>
                        <div className="philo-phone-container bg-philo-input rounded-2xl border border-transparent focus-within:border-philo-primary/40 p-2 transition-all duration-300">
                            <PhoneInput
                                value={phoneValue}
                                onChange={setPhoneValue}
                                defaultCountry="BR"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-philo-primary uppercase tracking-widest ml-1">
                            {t('auth.password_label')}
                        </label>
                        <div className="relative flex items-center bg-philo-input rounded-2xl border border-transparent focus-within:border-philo-primary/40 transition-all duration-300">
                            <Lock className="ml-4 text-gray-500" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full p-4 bg-transparent text-gray-200 outline-none placeholder:text-gray-700"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-philo-primary hover:bg-philo-accent text-philo-bg font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-philo-primary/20 active:scale-[0.98] mt-2 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : t('auth.btn_register')}
                    </button>

                    <button
                        type="button"
                        onClick={onToggleLogin}
                        className="w-full text-[10px] font-bold text-gray-500 hover:text-philo-primary uppercase tracking-[0.2em] transition-colors"
                    >
                        {t('auth.switch_to_login')}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium animate-shake">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};