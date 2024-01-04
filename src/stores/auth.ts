/* eslint-disable @typescript-eslint/no-unused-vars */
import { State, create } from "zustand";
import { createJSONStorage } from "zustand/middleware";
import { persist } from "zustand/middleware";
import { IUser } from "../types";
interface AuthStore {
  isLoggedIn: boolean;
  user?: IUser;
  accessToken?: string;
  refreshToken?: string;

  setLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: IUser) => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  reset: () => void;
}

const initialState = {
  isLoggedIn: false,
  user: undefined,
  accessToken: undefined,
  refreshToken: undefined,
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setLoggedIn: (isLoggedIn) => set((state) => ({ isLoggedIn })),
      setUser: (user) => set((state) => ({ user })),
      setAccessToken: (accessToken) => set((state) => ({ accessToken })),
      setRefreshToken: (refreshToken) => set((state) => ({ refreshToken })),
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
