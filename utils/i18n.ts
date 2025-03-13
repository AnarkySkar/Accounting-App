import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import en from "@/locales/en.json";
import it from "@/locales/it.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    it: { translation: it },
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
