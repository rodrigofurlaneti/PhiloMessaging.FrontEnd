import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronUp } from 'lucide-react';

interface LanguageSelectorProps {
    variant?: 'horizontal' | 'accordion';
}

export const LanguageSelector = ({ variant = 'horizontal' }: LanguageSelectorProps) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'pt', label: 'PT' },
        { code: 'en', label: 'EN' },
        { code: 'es', label: 'ES' },
        { code: 'fr', label: 'FR' },
        { code: 'it', label: 'IT' },
        { code: 'zh', label: 'ZH' }
    ];

    const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

    // MODO HORIZONTAL (Para o Login)
    if (variant === 'horizontal') {
        return (
            <div className="flex gap-2 mb-6">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className={`px-3 py-1 text-[10px] font-black rounded-lg border transition-all ${i18n.language === lang.code
                                ? 'bg-cyan-500 border-cyan-500 text-black'
                                : 'border-white/10 text-gray-500 hover:text-white'
                            }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        );
    }

    // MODO ACCORDION (Para a Sidebar do Chat)
    return (
        <div className="relative flex flex-col items-center">
            {isOpen && (
                <div className="absolute bottom-full mb-2 flex flex-col bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                i18n.changeLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={`px-4 py-2 text-[10px] font-bold hover:bg-cyan-500 hover:text-black transition-colors ${i18n.language === lang.code ? 'text-cyan-500' : 'text-gray-400'
                                }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex flex-col items-center p-2 rounded-xl border transition-all ${isOpen ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500' : 'border-transparent text-gray-500 hover:text-white'
                    }`}
            >
                <Globe size={20} />
                <span className="text-[9px] font-black mt-1 uppercase">{currentLanguage.label}</span>
                <ChevronUp size={10} className={`mt-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        </div>
    );
};