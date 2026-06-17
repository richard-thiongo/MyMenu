"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      restaurantName: null,
      primaryColor: null,

      login: (token, restaurantName, primaryColor) =>
        set({ token, restaurantName, primaryColor: primaryColor || null }),
      logout: () => set({ token: null, restaurantName: null, primaryColor: null }),
    }),
    {
      name: "mymenu-auth", // unique name for localStorage key
    }
  )
);

export default useAuthStore;
