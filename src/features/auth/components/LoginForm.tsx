import React, { useState } from 'react';
import { useAuth } from '../../chat/context/AuthContext';
import { Lock, ShieldCheck, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value && password) {
      const phoneNumberData = parsePhoneNumber(value);
      if (phoneNumberData) {
        await login({
          phoneNumber: phoneNumberData.nationalNumber as string,
          countryCode: `+${phoneNumberData.countryCallingCode}`,
          password,
        });
      } else {
        alert('Por favor, insira um número de telefone válido.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm">

      {/* Seletor de idioma */}
      <div className="w-full flex justify-end mb-6">
        <LanguageSelector variant="horizontal" />
      </div>

      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="inline-flex p-4 rounded-2xl bg-emerald-500/10 mb-5 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <ShieldCheck className="text-emerald-400" size={36} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter leading-none">
          Philo<span className="text-emerald-400">Messaging</span>
        </h1>
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.35em] mt-2">
          {t('auth.secure_gateway')}
        </p>
      </div>

      {/* Card do formulário */}
      <div className="w-full bg-white/[0.03] border border-white/[0.07] rounded-[2rem] p-8 shadow-2xl backdrop-blur-md">

        <h2 className="text-lg font-black text-white mb-1">Bem-vindo de volta</h2>
        <p className="text-xs text-gray-600 mb-7">Entre com seu número e chave de segurança</p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Telefone */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest ml-1">
              {t('auth.phone_label')}
            </label>
            <div className="philo-phone-container bg-white/[0.04] rounded-2xl border border-white/[0.07] focus-within:border-emerald-500/40 focus-within:bg-white/[0.06] transition-all">
              <PhoneInput
                placeholder={t('auth.phone_placeholder')}
                value={value}
                onChange={setValue}
                defaultCountry="BR"
                className="w-full flex items-center p-3"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">
                {t('auth.password_label')}
              </label>
              <button
                type="button"
                className="text-[9px] font-bold text-gray-600 hover:text-emerald-400 uppercase tracking-widest transition-colors"
              >
                {t('auth.forgot_password')}
              </button>
            </div>
            <div className="relative flex items-center bg-white/[0.04] rounded-2xl border border-white/[0.07] focus-within:border-emerald-500/40 focus-within:bg-white/[0.06] transition-all">
              <Lock className="ml-4 text-gray-600 shrink-0" size={15} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="flex-1 p-3.5 bg-transparent text-gray-200 placeholder:text-gray-700 outline-none text-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="mr-4 text-gray-600 hover:text-gray-400 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Botão principal */}
          <button
            type="submit"
            disabled={isLoading || !value || !password}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/30 disabled:cursor-not-allowed text-black font-black py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] active:scale-[0.98] mt-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <span className="text-sm tracking-wide">{t('auth.btn_login')}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] text-gray-700 uppercase tracking-widest">ou</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Link para registro */}
          <button
            type="button"
            onClick={onToggleRegister}
            className="w-full py-3.5 rounded-2xl border border-white/[0.07] text-[11px] font-bold text-gray-500 hover:text-emerald-400 hover:border-emerald-500/30 uppercase tracking-[0.2em] transition-all"
          >
            {t('auth.switch_to_register')}
          </button>

          {/* Erro */}
          {error && (
            <div className="p-3.5 bg-red-500/8 border border-red-500/20 rounded-xl text-red-400 text-[11px] text-center font-medium">
              ⚠ {error}
            </div>
          )}
        </form>
      </div>

      {/* Rodapé segurança */}
      <div className="flex items-center gap-2 mt-6 text-[9px] text-gray-700 uppercase tracking-widest">
        <ShieldCheck size={11} className="text-emerald-500/40" />
        <span>Comunicação criptografada ponta a ponta</span>
      </div>
    </div>
  );
};
