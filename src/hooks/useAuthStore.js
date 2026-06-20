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

      login: (token, refreshToken, restaurantName, primaryColor) =>
        set({ token, refreshToken, restaurantName, primaryColor: primaryColor || null }),
      logout: () => set({ token: null, refreshToken: null, restaurantName: null, primaryColor: null }),
      updateTokens: (token, refreshToken) => set({ token, refreshToken }),
    }),
    {
      name: "mymenu-auth", // unique name for localStorage key
    }
  )
);

export default useAuthStore;
