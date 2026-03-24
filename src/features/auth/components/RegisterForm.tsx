import React, { useState } from 'react';
import { useRegister } from '../hooks/useRegister';
import { User, Lock, Mail, ShieldCheck, Loader2, ChevronLeft } from 'lucide-react';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import 'react-phone-number-input/style.css';

interface RegisterFormProps {
    onToggleLogin: () => void;
}

export const RegisterForm = ({ onToggleLogin }: RegisterFormProps) => {
    const { t } = useTranslation();
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
                if (result) window.location.reload();
            }
        }
    };

    const inputRow = (icon: React.ReactNode, placeholder: string, value: string, onChange: (v: string) => void, type = 'text', delay = '') => (
        <div
            className={`flex items-center ${delay}`}
            style={{ background:'#161616', border:'1px solid rgba(201,168,76,0.08)', borderRadius:'12px', transition:'border-color 0.25s' }}
            onFocusCapture={e => (e.currentTarget.style.borderColor='rgba(201,168,76,0.35)')}
            onBlurCapture={e  => (e.currentTarget.style.borderColor='rgba(201,168,76,0.08)')}
        >
            <div className="ml-4 shrink-0" style={{ color:'rgba(201,168,76,0.35)' }}>{icon}</div>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full px-3 py-[14px] font-mono-dm text-sm bg-transparent outline-none"
                style={{ color:'#F5EDD8' }}
                value={value}
                onChange={e => onChange(e.target.value)}
                required
            />
        </div>
    );

    return (
        <div className="flex flex-col items-center w-full max-w-[420px]">

            <div className="animate-fade-up mb-8 self-end">
                <LanguageSelector variant="horizontal" />
            </div>

            {/* Logo */}
            <div className="animate-fade-up delay-50 text-center mb-8">
                <div
                    className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl"
                    style={{ background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', boxShadow:'0 0 24px rgba(201,168,76,0.07)' }}
                >
                    <ShieldCheck size={26} style={{ color:'#C9A84C' }} strokeWidth={1.5} />
                </div>
                <h1 className="font-cormorant text-4xl font-light tracking-wide mb-1" style={{ color:'#F5EDD8' }}>
                    {t('auth.join')} <span style={{ color:'#C9A84C' }}>Philo</span>
                </h1>
                <p className="font-mono-dm text-[10px] tracking-[0.2em] uppercase" style={{ color:'rgba(201,168,76,0.4)' }}>
                    {t('auth.register_subtitle')}
                </p>
            </div>

            {/* Card */}
            <div
                className="animate-fade-up delay-100 w-full rounded-2xl p-8"
                style={{
                    background: 'rgba(13,13,13,0.9)',
                    border: '1px solid rgba(201,168,76,0.1)',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(201,168,76,0.05)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <div className="flex items-center gap-3 mb-7">
                    <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg, rgba(201,168,76,0.2), transparent)' }}/>
                    <span className="font-mono-dm text-[9px] tracking-[0.25em] uppercase" style={{ color:'rgba(201,168,76,0.4)' }}>Nova Conta</span>
                    <div style={{ flex:1, height:'1px', background:'linear-gradient(270deg, rgba(201,168,76,0.2), transparent)' }}/>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="animate-fade-up delay-150">
                        <label className="field-label">{t('auth.full_name_label')}</label>
                        {inputRow(<User size={15}/>, 'Rodrigo Furlaneti', displayName, setDisplayName)}
                    </div>

                    <div className="animate-fade-up delay-200">
                        <label className="field-label">{t('auth.email_label')}</label>
                        {inputRow(<Mail size={15}/>, 'email@exemplo.com', email, setEmail, 'email')}
                    </div>

                    <div className="animate-fade-up delay-250">
                        <label className="field-label">{t('auth.phone_label')}</label>
                        <div className="philo-phone-container">
                            <PhoneInput value={phoneValue} onChange={setPhoneValue} defaultCountry="BR" />
                        </div>
                    </div>

                    <div className="animate-fade-up delay-300">
                        <label className="field-label">{t('auth.password_label')}</label>
                        {inputRow(<Lock size={15}/>, '••••••••', password, setPassword, 'password')}
                    </div>

                    <div className="animate-fade-up delay-350 pt-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-gold w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[11px]"
                        >
                            {isLoading
                                ? <Loader2 size={18} className="animate-spin" />
                                : t('auth.btn_register')
                            }
                        </button>
                    </div>

                    <div className="animate-fade-up delay-400 text-center pt-1">
                        <button
                            type="button"
                            onClick={onToggleLogin}
                            className="inline-flex items-center gap-1 font-mono-dm text-[10px] tracking-[0.15em] uppercase transition-colors"
                            style={{ color:'rgba(201,168,76,0.35)' }}
                            onMouseEnter={e => (e.currentTarget.style.color='rgba(201,168,76,0.65)')}
                            onMouseLeave={e => (e.currentTarget.style.color='rgba(201,168,76,0.35)')}
                        >
                            <ChevronLeft size={12}/>
                            {t('auth.switch_to_login')}
                        </button>
                    </div>

                    {error && (
                        <div
                            className="animate-fade-up p-4 rounded-xl text-xs text-center font-mono-dm tracking-wide"
                            style={{ background:'rgba(180,40,40,0.08)', border:'1px solid rgba(180,40,40,0.2)', color:'#e07070' }}
                        >
                            {error}
                        </div>
                    )}
                </form>
            </div>

            <p className="animate-fade-up delay-500 mt-6 font-mono-dm text-[9px] tracking-[0.2em] uppercase text-center" style={{ color:'rgba(201,168,76,0.2)' }}>
                End-to-end encrypted · Zero knowledge
            </p>
        </div>
    );
};
