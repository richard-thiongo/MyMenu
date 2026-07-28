"use client";

import useKeyboardOffset from "@/hooks/useKeyboardOffset";

export default function KeyboardAvoidingWrapper({ children }) {
  const keyboardOffset = useKeyboardOffset();

  return (
    <div
      className="w-full flex-1 flex flex-col overflow-y-auto"
      style={{
        maxHeight: keyboardOffset > 0 ? `calc(100vh - ${keyboardOffset}px)` : "100vh",
        height: "100%",
        transition: "max-height 0.15s ease-out",
      }}
    >
      {children}
    </div>
  );
}
