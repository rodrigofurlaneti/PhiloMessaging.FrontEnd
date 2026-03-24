import React, { useState } from 'react';
import { useAuth } from '../../chat/context/AuthContext';
import { Lock, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import 'react-phone-number-input/style.css';

interface LoginFormProps {
    onToggleRegister: () => void;
}

export const LoginForm = ({ onToggleRegister }: LoginFormProps) => {
    const { t } = useTranslation();
    const { login, isLoading, error } = useAuth();
    const [password, setPassword] = useState('');
    const [value, setValue] = useState<string | undefined>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (value && password) {
            const phoneNumberData = parsePhoneNumber(value);
            if (phoneNumberData) {
                await login({
                    phoneNumber: phoneNumberData.nationalNumber as string,
                    countryCode: `+${phoneNumberData.countryCallingCode}`,
                    password
                });
            } else {
                alert("Please enter a valid phone number.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-[420px]">

            {/* Language selector */}
            <div className="animate-fade-up mb-8 self-end">
                <LanguageSelector variant="horizontal" />
            </div>

            {/* Logo */}
            <div className="animate-fade-up delay-50 text-center mb-10">
                <div
                    className="inline-flex items-center justify-center w-16 h-16 mb-5 rounded-2xl animate-float"
                    style={{
                        background: 'rgba(201,168,76,0.08)',
                        border: '1px solid rgba(201,168,76,0.2)',
                        boxShadow: '0 0 32px rgba(201,168,76,0.08)',
                    }}
                >
                    <ShieldCheck size={30} style={{ color: '#C9A84C' }} strokeWidth={1.5} />
                </div>

                <h1
                    className="font-cormorant text-5xl font-light tracking-wide mb-2"
                    style={{ color: '#F5EDD8', letterSpacing: '0.04em' }}
                >
                    Philo<span style={{ color: '#C9A84C' }}>.</span>
                </h1>

                <p className="font-mono-dm text-[10px] tracking-[0.22em] uppercase" style={{ color: 'rgba(201,168,76,0.5)' }}>
                    {t('auth.secure_gateway')}
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
                <div className="flex items-center gap-3 mb-8">
                    <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg, rgba(201,168,76,0.2), transparent)' }}/>
                    <span className="font-mono-dm text-[9px] tracking-[0.25em] uppercase" style={{ color:'rgba(201,168,76,0.4)' }}>
                        Acesso Seguro
                    </span>
                    <div style={{ flex:1, height:'1px', background:'linear-gradient(270deg, rgba(201,168,76,0.2), transparent)' }}/>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="animate-fade-up delay-150">
                        <label className="field-label">{t('auth.phone_label')}</label>
                        <div className="philo-phone-container">
                            <PhoneInput
                                placeholder={t('auth.phone_placeholder')}
                                value={value}
                                onChange={setValue}
                                defaultCountry="BR"
                            />
                        </div>
                    </div>

                    <div className="animate-fade-up delay-200">
                        <div className="flex justify-between items-center mb-2">
                            <label className="field-label" style={{ marginBottom:0 }}>{t('auth.password_label')}</label>
                            <button
                                type="button"
                                className="font-mono-dm text-[9px] tracking-wider uppercase transition-colors"
                                style={{ color:'rgba(201,168,76,0.35)' }}
                                onMouseEnter={e => (e.currentTarget.style.color='rgba(201,168,76,0.7)')}
                                onMouseLeave={e => (e.currentTarget.style.color='rgba(201,168,76,0.35)')}
                            >
                                {t('auth.forgot_password')}
                            </button>
                        </div>
                        <div
                            className="flex items-center"
                            style={{ background:'#161616', border:'1px solid rgba(201,168,76,0.08)', borderRadius:'12px', transition:'border-color 0.25s' }}
                            onFocusCapture={e => (e.currentTarget.style.borderColor='rgba(201,168,76,0.35)')}
                            onBlurCapture={e  => (e.currentTarget.style.borderColor='rgba(201,168,76,0.08)')}
                        >
                            <Lock className="ml-4 shrink-0" size={15} style={{ color:'rgba(201,168,76,0.35)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-3 py-4 font-mono-dm text-sm bg-transparent outline-none"
                                style={{ color:'#F5EDD8', letterSpacing:'0.1em' }}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="animate-fade-up delay-250 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading || !value}
                            className="btn-gold w-full flex items-center justify-center gap-3 py-4 rounded-xl text-[11px]"
                        >
                            {isLoading
                                ? <Loader2 size={18} className="animate-spin" />
                                : <>{t('auth.btn_login')}<ArrowRight size={15}/></>
                            }
                        </button>
                    </div>

                    <div className="animate-fade-up delay-300 text-center pt-1">
                        <button
                            type="button"
                            onClick={onToggleRegister}
                            className="font-mono-dm text-[10px] tracking-[0.18em] uppercase transition-colors"
                            style={{ color:'rgba(201,168,76,0.35)' }}
                            onMouseEnter={e => (e.currentTarget.style.color='rgba(201,168,76,0.65)')}
                            onMouseLeave={e => (e.currentTarget.style.color='rgba(201,168,76,0.35)')}
                        >
                            {t('auth.switch_to_register')}
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

            <p className="animate-fade-up delay-400 mt-6 font-mono-dm text-[9px] tracking-[0.2em] uppercase text-center" style={{ color:'rgba(201,168,76,0.2)' }}>
                End-to-end encrypted · Zero knowledge
            </p>
        </div>
    );
};
