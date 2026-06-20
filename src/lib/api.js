// This file handles all API calls and auto-attaches the JWT token if available.

import useAuthStore from "@/hooks/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithAuth(endpoint, options = {}, retries = 1) {
  const { token } = useAuthStore.getState();

  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If the token is invalid or expired, attempt a refresh
  if (response.status === 401 && retries > 0) {
    const { refreshToken, updateTokens, logout } = useAuthStore.getState();
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_URL}/api/restaurants/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        if (refreshRes.ok) {
          const json = await refreshRes.json();
          updateTokens(json.data.token, json.data.refreshToken);
          return fetchWithAuth(endpoint, options, 0); // Retry with new token
        } else {
          logout();
          throw new Error('Session expired. Please log in again.');
        }
      } catch (err) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }
    } else {
      logout();
    }
  } else if (response.status === 401 || response.status === 403) {
    useAuthStore.getState().logout();
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "An error occurred during the request.");
  }

  return data;
}

export const api = {
  // --- AUTH ---
  login: (credentials) =>
    fetchWithAuth("/api/restaurants/signin", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  signup: (details) =>
    fetchWithAuth("/api/restaurants/signup", {
      method: "POST",
      body: JSON.stringify(details),
    }),
  resetPassword: (data) =>
    fetchWithAuth("/api/restaurants/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // --- PUBLIC ---
  getRestaurantMenu: async (restaurantName) => {
    // Uses standard fetch to leverage Next.js caching
    const res = await fetch(
      `${API_URL}/api/food-items/by-restaurant/${encodeURIComponent(
        restaurantName
      )}`,
      { cache: 'no-store' }
    );
    if (!res.ok) {
      throw new Error("Restaurant not found or menu is empty.");
    }
    const json = await res.json();
    return json.data || {};
  },

  // --- PROTECTED DASHBOARD ---
  getCategories: () => fetchWithAuth("/api/categories"),
  createCategory: (data) =>
    fetchWithAuth("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCategory: (id, data) =>
    fetchWithAuth(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCategory: (id) =>
    fetchWithAuth(`/api/categories/${id}`, { method: "DELETE" }),

  getFoodItems: () => fetchWithAuth("/api/food-items"),
  createFoodItem: (data) =>
    fetchWithAuth("/api/food-items", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateFoodItem: (id, data) =>
    fetchWithAuth(`/api/food-items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteFoodItem: (id) =>
    fetchWithAuth(`/api/food-items/${id}`, { method: "DELETE" }),

  // --- RESTAURANT PROFILE ---
  getProfile: () => fetchWithAuth("/api/restaurants/profile"),
  updateProfile: (data) =>
    fetchWithAuth("/api/restaurants/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // --- IMAGE UPLOAD ---
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const json = await fetchWithAuth("/api/upload", {
      method: "POST",
      body: formData,
    });
    
    return json;
  },
};
