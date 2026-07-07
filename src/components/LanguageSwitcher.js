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


export default function LanguageSwitcher({ className = "", openUpwards = false, iconOnly = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(LANGUAGES[0]);
  const ref = useRef(null);

  // Close on click outside & sync state
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    // Sync state across multiple dropdowns
    const handleSync = (e) => setSelected(e.detail);
    window.addEventListener("lang-sync", handleSync);

    // Set initial state from Google Translate cookie
    const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
    if (match && match[1]) {
      const code = match[1];
      const found = LANGUAGES.find((l) => l.code.toLowerCase() === code.toLowerCase());
      if (found) setSelected(found);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("lang-sync", handleSync);
    };
  }, []);

  const handleSelect = (lang) => {
    if (selected.code === lang.code) {
      setIsOpen(false);
      return;
    }
    setSelected(lang);
    setIsOpen(false);
    
    // Broadcast to other LanguageSwitcher instances
    window.dispatchEvent(new CustomEvent("lang-sync", { detail: lang }));
    
    // Set the Google Translate cookie manually for 100% reliability
    if (lang.code === "en") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
    } else {
      document.cookie = `googtrans=/en/${lang.code}; path=/;`;
      document.cookie = `googtrans=/en/${lang.code}; domain=${window.location.hostname}; path=/;`;
    }

    // Force a page refresh to guarantee Google Translate processes the entire DOM cleanly
    window.location.reload();
  };

  return (
    <>
      {/* Hidden Google Translate element — must stay in DOM */}
      <div id="google_translate_element" className="sr-only" aria-hidden="true" />

      {/* Custom dropdown */}
      <div ref={ref} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen((o) => !o)}
          className={`flex items-center rounded-full border border-border bg-surface text-sm font-medium text-text shadow-sm transition-all hover:border-primary-500 hover:text-primary-500 focus:outline-none ${
            iconOnly 
              ? "p-2 justify-center" 
              : "p-2 sm:px-2.5 sm:py-1.5 gap-1 sm:gap-1.5 justify-between"
          }`}
          aria-label="Select language"
        >
          <div className="flex items-center gap-1.5">
            <FiGlobe className="h-4 w-4 shrink-0 text-primary-500" />
            {!iconOnly && (
              <span className="hidden sm:inline-block sm:w-20 sm:text-left sm:truncate">{selected.label}</span>
            )}
          </div>
          {!iconOnly && (
            <FiChevronDown
              className={`block h-3.5 w-3.5 shrink-0 text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {isOpen && (
          <div className={`absolute ${openUpwards ? "bottom-full mb-2 origin-bottom-left left-0" : "top-full mt-2 origin-top-right right-0"} z-[9999] w-44 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl animate-in fade-in zoom-in-95 duration-150`}>
            <ul className="max-h-72 overflow-y-auto py-1">
              {LANGUAGES.map((lang) => (
                <li key={lang.code}>
                  <button
                    disabled={selected.code === lang.code}
                    onClick={() => handleSelect(lang)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-primary-500/10 hover:text-primary-500 ${
                      selected.code === lang.code
                        ? "bg-primary-500/10 text-primary-500 font-semibold cursor-default"
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
