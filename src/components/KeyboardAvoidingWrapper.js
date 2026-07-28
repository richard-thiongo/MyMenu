"use client";

import useKeyboardOffset from "@/hooks/useKeyboardOffset";

export default function KeyboardAvoidingWrapper({ children }) {
  const keyboardOffset = useKeyboardOffset();

  return (
    <div
      style={{
        paddingBottom: keyboardOffset > 0 ? `${keyboardOffset}px` : "0px",
        transition: "padding-bottom 0.15s ease-out",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      {children}
    </div>
  );
}
