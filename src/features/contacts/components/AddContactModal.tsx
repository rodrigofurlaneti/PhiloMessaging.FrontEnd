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
                await addContact({ phoneNumber: phoneValue, nickname: nickname || undefined });
                onClose();
            } else {
                alert(t('auth.invalid_phone') || 'Telefone inválido.');
            }
        }
    };

    return (
        <div
            className="animate-fade-in"
            style={{
                position: 'fixed', inset: 0, zIndex: 50,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24,
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(12px)',
            }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="animate-scale-in"
                style={{
                    width: '100%', maxWidth: 400, borderRadius: 22,
                    background: 'rgba(11,11,11,0.97)',
                    border: '1px solid rgba(201,168,76,0.14)',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.04) inset',
                    padding: '28px 28px 24px',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: 'rgba(201,168,76,0.08)',
                            border: '1px solid rgba(201,168,76,0.18)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#C9A84C',
                        }}>
                            <UserPlus size={18}/>
                        </div>
                        <div>
                            <h2 className="font-cormorant" style={{ fontSize: 22, fontWeight: 400, color: '#F5EDD8', letterSpacing: '0.04em' }}>
                                {t('contacts.add_title') || 'Novo Contato'}
                            </h2>
                            <p className="font-mono-dm" style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.35)', marginTop: 2 }}>
                                Adicionar à rede
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            color: 'rgba(201,168,76,0.3)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(201,168,76,0.3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                    >
                        <X size={14}/>
                    </button>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.1), transparent)', marginBottom: 22 }}/>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label className="field-label">{t('auth.phone_label') || 'Telefone'}</label>
                        <div className="philo-phone-container">
                            <PhoneInput
                                placeholder={t('auth.phone_placeholder') || '+55 11 99999-9999'}
                                value={phoneValue}
                                onChange={setPhoneValue}
                                defaultCountry="BR"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label className="field-label">{t('contacts.nickname_label') || 'Apelido (opcional)'}</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            placeholder="Ex: Rodrigo"
                            className="input-luxury"
                            style={{ fontFamily: 'DM Mono, monospace' }}
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1, padding: '13px 0', borderRadius: 12, cursor: 'pointer',
                                background: 'transparent',
                                border: '1px solid rgba(201,168,76,0.1)',
                                color: 'rgba(201,168,76,0.35)',
                                fontFamily: 'DM Mono, monospace', fontSize: 10,
                                letterSpacing: '0.15em', textTransform: 'uppercase',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; e.currentTarget.style.color = 'rgba(201,168,76,0.65)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'; e.currentTarget.style.color = 'rgba(201,168,76,0.35)'; }}
                        >
                            {t('common.cancel') || 'Cancelar'}
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading || !phoneValue}
                            className="btn-gold"
                            style={{ flex: 1.8, padding: '13px 0', borderRadius: 12, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        >
                            {isLoading
                                ? <Loader2 size={15} className="animate-spin"/>
                                : <><UserPlus size={13}/>{t('contacts.btn_add') || 'Adicionar'}</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
