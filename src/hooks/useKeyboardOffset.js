"use client";

import { useEffect, useState } from "react";

export default function useKeyboardOffset() {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const handleViewportChange = () => {
      const offset = window.innerHeight - window.visualViewport.height;
      // Trigger offset only if keyboard height exceeds standard offset margins (e.g. > 60px)
      setKeyboardOffset(offset > 60 ? offset : 0);
    };

    window.visualViewport.addEventListener("resize", handleViewportChange);
    window.visualViewport.addEventListener("scroll", handleViewportChange);

    // Initial check
    handleViewportChange();

    return () => {
      window.visualViewport.removeEventListener("resize", handleViewportChange);
      window.visualViewport.removeEventListener("scroll", handleViewportChange);
    };
  }, []);

  return keyboardOffset;
}
