"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      restaurantName: null,
      primaryColor: null,
      isPaid: false,
      subscriptionExpiresAt: null,

      login: (token, refreshToken, restaurantName, primaryColor, isPaid, subscriptionExpiresAt) =>
        set({ token, refreshToken, restaurantName, primaryColor: primaryColor || null, isPaid: isPaid || false, subscriptionExpiresAt: subscriptionExpiresAt || null }),
      logout: () => set({ token: null, refreshToken: null, restaurantName: null, primaryColor: null, isPaid: false, subscriptionExpiresAt: null }),
      updateTokens: (token, refreshToken) => set({ token, refreshToken }),
    }),
    {
      name: "mymenu-auth", // unique name for localStorage key
    }
  )
);

export default useAuthStore;
