import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import zh from './locales/zh.json';

i18n
    .use(LanguageDetector) // Detecta o idioma do navegador automaticamente
    .use(initReactI18next)
    .init({
        resources: {
            pt: { translation: pt },
            en: { translation: en },
            es: { translation: es },
            fr: { translation: fr },
            it: { translation: it },
            zh: { translation: zh }
        },
        fallbackLng: 'en', // Se não detectar, usa inglês
        interpolation: { escapeValue: false }
    });

export default i18n;