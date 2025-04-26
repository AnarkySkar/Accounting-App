"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

// Define available languages
const languages = [
  { code: "en", label: "English 🇬🇧" },
  { code: "it", label: "Italiano 🇮🇹" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    // Get stored language from localStorage on mount
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage && storedLanguage !== i18n.language) {
      i18n.changeLanguage(storedLanguage);
      setLanguage(storedLanguage);
    }
    setMounted(true);
  }, [i18n]);

  if (!mounted) return null;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
    localStorage.setItem("language", lng); // Store language in localStorage
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          {languages.find((lang) => lang.code === language)?.label || "🌍"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup value={language} onValueChange={changeLanguage}>
          {languages.map(({ code, label }) => (
            <DropdownMenuRadioItem
              key={code}
              className="flex gap-2"
              value={code}
            >
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { LanguageSwitcher };
