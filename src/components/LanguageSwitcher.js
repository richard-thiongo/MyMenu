"use client";

import { useState, useRef, useEffect } from "react";
import { FiGlobe, FiChevronDown, FiCheck } from "react-icons/fi";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "sw", label: "Swahili", flag: "🇰🇪" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "zh-CN", label: "中文", flag: "🇨🇳" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "am", label: "አማርኛ", flag: "🇪🇹" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
];

function selectGoogleLanguage(langCode) {
  const el = document.querySelector("#google_translate_element select");
  if (!el) return;
  el.value = langCode;
  el.dispatchEvent(new Event("change"));
}

export default function LanguageSwitcher({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(LANGUAGES[0]);
  const ref = useRef(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang) => {
    setSelected(lang);
    setIsOpen(false);
    if (lang.code === "en") {
      // Reset to original
      const iframe = document.querySelector(".goog-te-banner-frame");
      if (iframe) {
        const btn = iframe.contentWindow?.document.querySelector(".goog-close-link");
        if (btn) btn.click();
      }
      const combo = document.querySelector("#google_translate_element select");
      if (combo) {
        combo.value = "";
        combo.dispatchEvent(new Event("change"));
      }
    } else {
      selectGoogleLanguage(lang.code);
    }
  };

  return (
    <>
      {/* Hidden Google Translate element — must stay in DOM */}
      <div id="google_translate_element" className="sr-only" aria-hidden="true" />

      {/* Custom dropdown */}
      <div ref={ref} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1.5 text-sm font-medium text-text shadow-sm transition-all hover:border-primary-500 hover:text-primary-500 focus:outline-none"
          aria-label="Select language"
        >
          <FiGlobe className="h-4 w-4 shrink-0 text-primary-500" />
          <span className="hidden sm:inline">{selected.label}</span>
          <FiChevronDown
            className={`h-3.5 w-3.5 text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 z-[9999] mt-2 w-44 origin-top-right overflow-hidden rounded-xl border border-border bg-surface shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <ul className="max-h-72 overflow-y-auto py-1">
              {LANGUAGES.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() => handleSelect(lang)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-primary-500/10 hover:text-primary-500 ${
                      selected.code === lang.code
                        ? "bg-primary-500/10 text-primary-500 font-semibold"
                        : "text-text"
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span className="flex-1 text-left">{lang.label}</span>
                    {selected.code === lang.code && (
                      <FiCheck className="h-3.5 w-3.5 shrink-0" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
