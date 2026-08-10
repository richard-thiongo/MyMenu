"use client";

import useKeyboardOffset from "@/hooks/useKeyboardOffset";

export default function KeyboardAvoidingWrapper({ children }) {
  const keyboardOffset = useKeyboardOffset();

  return (
    <div
      className="w-full flex-1 flex flex-col"
      style={
        keyboardOffset > 0
          ? { paddingBottom: `${keyboardOffset}px`, transition: "padding-bottom 0.15s ease-out" }
          : undefined
      }
    >
      {children}
    </div>
  );
}
