import React, { useState } from 'react';
import { useContacts } from '../hooks/useContacts';
import { UserPlus, X, Loader2 } from 'lucide-react';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import { useTranslation } from 'react-i18next';
import 'react-phone-number-input/style.css';

export const AddContactModal = ({ onClose }: { onClose: () => void }) => {
    const { t } = useTranslation();
    const { addContact, isLoading } = useContacts();
    const [nickname, setNickname] = useState('');
    const [phoneValue, setPhoneValue] = useState<string | undefined>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (phoneValue) {
            const phoneNumberData = parsePhoneNumber(phoneValue);
            if (phoneNumberData) {
                // Seguindo a lógica do seu Backend: Enviamos o número completo ou formatado
                // Aqui enviamos a string formatada E.164 (ex: +5511995882509)
                await addContact({
                    phoneNumber: phoneValue,
                    nickname: nickname || undefined
                });
                onClose();
            } else {
                alert(t('auth.invalid_phone') || "Telefone inválido.");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[#121212] border border-white/5 p-8 rounded-[2rem] w-full max-w-md shadow-2xl shadow-purple-500/10">

                {/* Header do Modal */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
                            <UserPlus size={20} />
                        </div>
                        <h2 className="text-xl font-black text-white tracking-tight">
                            {t('contacts.add_title') || 'Novo Contato'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campo de Telefone (Padrão Philo) */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest ml-1">
                            {t('auth.phone_label') || 'Telefone'}
                        </label>
                        <div className="philo-phone-container">
                            <PhoneInput
                                placeholder={t('auth.phone_placeholder') || 'Ex: +55 11 99999-9999'}
                                value={phoneValue}
                                onChange={setPhoneValue}
                                defaultCountry="BR"
                                className="w-full flex items-center bg-[#1a1a1a] rounded-2xl border border-transparent focus-within:border-purple-500/40 transition-all duration-300 p-2 text-gray-200"
                            />
                        </div>
                    </div>

                    {/* Campo de Apelido */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest ml-1">
                            {t('contacts.nickname_label') || 'Apelido (Opcional)'}
                        </label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full p-4 bg-[#1a1a1a] border border-transparent focus:border-purple-500/40 text-gray-200 rounded-2xl outline-none transition-all placeholder:text-gray-600 text-sm"
                            placeholder="Ex: Rodrigo"
                        />
                    </div>

                    {/* Ações */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-[11px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                        >
                            {t('common.cancel') || 'Cancelar'}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !phoneValue}
                            className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-purple-600/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                t('contacts.btn_add') || 'Adicionar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};