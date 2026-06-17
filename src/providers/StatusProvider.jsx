"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { FiLoader, FiAlertCircle, FiX } from "react-icons/fi";

const StatusContext = createContext();

export const useStatus = () => useContext(StatusContext);

export default function StatusProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showLoading = useCallback((message = "Please wait...") => {
    setIsLoading(true);
    setLoadingMessage(message);
    setError(false);
    setErrorMessage("");
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage("");
  }, []);

  const showError = useCallback((message = "An error occurred.") => {
    setIsLoading(false);
    setLoadingMessage("");
    setError(true);
    setErrorMessage(message);
  }, []);

  const hideError = useCallback(() => {
    setError(false);
    setErrorMessage("");
  }, []);

  return (
    <StatusContext.Provider value={{ showLoading, hideLoading, showError, hideError }}>
      {children}
      
      {/* Global Modals for Status */}
      {(isLoading || error) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl text-center relative zoom-in-95 animate-in duration-200 border border-border">
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-6">
                <FiLoader className="mb-4 h-12 w-12 animate-spin text-primary-500" />
                <h3 className="text-xl font-bold text-text mb-2">Processing</h3>
                <p className="text-text-muted">{loadingMessage}</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-4">
                <button
                  onClick={hideError}
                  className="absolute right-4 top-4 rounded-full p-2 text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
                >
                  <FiX size={20} />
                </button>
                <FiAlertCircle className="mb-4 h-14 w-14 text-red-500" />
                <h3 className="text-2xl font-bold text-text mb-2">Error</h3>
                <p className="mb-6 text-text-muted">{errorMessage}</p>
                <button
                  onClick={hideError}
                  className="w-full rounded-lg bg-surface-alt border border-border px-6 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-elevated"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </StatusContext.Provider>
  );
}
