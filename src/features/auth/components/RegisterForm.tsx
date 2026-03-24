import React, { useState } from 'react';
import { useRegister } from '../hooks/useRegister';
import { User, Lock, Mail, ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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
          password,
        });
        if (result) {
          window.location.reload();
        }
      }
    }
  };

  const inputClass = `
    relative flex items-center bg-white/[0.04] rounded-2xl border border-white/[0.07]
    focus-within:border-emerald-500/40 focus-within:bg-white/[0.06] transition-all
  `;

  return (
    <div className="flex flex-col items-center w-full max-w-sm">

      {/* Idioma */}
      <div className="w-full flex justify-end mb-6">
        <LanguageSelector variant="horizontal" />
      </div>

      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="inline-flex p-4 rounded-2xl bg-emerald-500/10 mb-4 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <ShieldCheck className="text-emerald-400" size={34} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter leading-none">
          {t('auth.join')} <span className="text-emerald-400">Philo</span>
        </h1>
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
          {t('auth.register_subtitle')}
        </p>
      </div>

      {/* Card */}
      <div className="w-full bg-white/[0.03] border border-white/[0.07] rounded-[2rem] p-8 shadow-2xl backdrop-blur-md">

        <h2 className="text-lg font-black text-white mb-1">Crie sua conta</h2>
        <p className="text-xs text-gray-600 mb-6">Preencha os dados para se registrar</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest ml-1">
              {t('auth.full_name_label')}
            </label>
            <div className={inputClass}>
              <User className="ml-4 text-gray-600 shrink-0" size={15} />
              <input type="text" placeholder="Rodrigo Furlaneti"
                className="flex-1 p-3.5 bg-transparent text-gray-200 placeholder:text-gray-700 outline-none text-sm"
                value={displayName} onChange={e => setDisplayName(e.target.value)} required />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest ml-1">
              {t('auth.email_label')}
            </label>
            <div className={inputClass}>
              <Mail className="ml-4 text-gray-600 shrink-0" size={15} />
              <input type="email" placeholder="exemplo@email.com"
                className="flex-1 p-3.5 bg-transparent text-gray-200 placeholder:text-gray-700 outline-none text-sm"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          {/* Telefone */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest ml-1">
              {t('auth.phone_label')}
            </label>
            <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] focus-within:border-emerald-500/40 focus-within:bg-white/[0.06] transition-all">
              <PhoneInput value={phoneValue} onChange={setPhoneValue} defaultCountry="BR"
                className="w-full flex items-center p-3" />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest ml-1">
              {t('auth.password_label')}
            </label>
            <div className={inputClass}>
              <Lock className="ml-4 text-gray-600 shrink-0" size={15} />
              <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                className="flex-1 p-3.5 bg-transparent text-gray-200 placeholder:text-gray-700 outline-none text-sm"
                value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="mr-4 text-gray-600 hover:text-gray-400 transition-colors">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Botão */}
          <button type="submit" disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/30 disabled:cursor-not-allowed text-black font-black py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] active:scale-[0.98] mt-1 text-sm">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : t('auth.btn_register')}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] text-gray-700 uppercase tracking-widest">ou</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Link login */}
          <button type="button" onClick={onToggleLogin}
            className="w-full py-3.5 rounded-2xl border border-white/[0.07] text-[11px] font-bold text-gray-500 hover:text-emerald-400 hover:border-emerald-500/30 uppercase tracking-[0.2em] transition-all">
            {t('auth.switch_to_login')}
          </button>

          {error && (
            <div className="p-3.5 bg-red-500/8 border border-red-500/20 rounded-xl text-red-400 text-[11px] text-center font-medium">
              ⚠ {error}
            </div>
          )}
        </form>
      </div>

      {/* Rodapé */}
      <div className="flex items-center gap-2 mt-6 text-[9px] text-gray-700 uppercase tracking-widest">
        <ShieldCheck size={11} className="text-emerald-500/40" />
        <span>Comunicação criptografada ponta a ponta</span>
      </div>
    </div>
  );
};
