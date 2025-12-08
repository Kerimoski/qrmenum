
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "tr" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (tr: string, en?: string | null) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("tr");

    // Tarayıcı dilini kontrol et (opsiyonel, şimdilik varsayılan TR kalsın)
    // useEffect(() => {
    //   const browserLang = navigator.language.split("-")[0];
    //   if (browserLang === "en") setLanguage("en");
    // }, []);

    const t = (tr: string, en?: string | null) => {
        if (language === "en" && en) return en;
        return tr;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
