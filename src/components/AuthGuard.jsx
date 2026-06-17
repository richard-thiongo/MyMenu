"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/hooks/useAuthStore";
import { FiLoader } from "react-icons/fi";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [isChecking, setIsChecking] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    useAuthStore.persist.onFinishHydration(() => setHasHydrated(true));
    setHasHydrated(useAuthStore.persist.hasHydrated());
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      router.push("/signin");
    } else {
      setIsChecking(false);
    }
  }, [token, router, hasHydrated]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <FiLoader className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return children;
}
