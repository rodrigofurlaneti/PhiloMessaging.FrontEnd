import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'pt', label: 'Português', flag: 'BR' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'zh', label: '中文', flag: '🇨🇳' }
];

export const LanguageSelector = () => {
    const { i18n } = useTranslation();

    return (
        <div className="flex gap-2 mb-6">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${i18n.language.startsWith(lang.code)
                            ? 'border-philo-primary text-philo-primary bg-philo-primary/10'
                            : 'border-white/10 text-gray-500 hover:text-white'
                        }`}
                >
                    {lang.code.toUpperCase()}
                </button>
            ))}
        </div>
    );
};