"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Loads the Google Translate script once globally.
// Include this once in the root layout.
export default function GoogleTranslateLoader() {
  const pathname = usePathname();

  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Re-trigger translation when the route changes (Next.js client-side navigation)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
      if (match && match[1] && match[1] !== "en") {
        const combo = document.querySelector(".goog-te-combo");
        if (combo) {
          combo.value = match[1];
          combo.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
    }, 500); // Small delay to let Next.js finish rendering the new DOM
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
