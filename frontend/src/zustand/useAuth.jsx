import { create } from "zustand";

const useAuthStore = create((set) => ({
  accessToken: null,
  setAccessToken: (token) => set(() => ({ accessToken: token })),
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn })),
}));

export default useAuthStore;
