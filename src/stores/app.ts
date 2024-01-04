/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { createJSONStorage } from "zustand/middleware";
import { persist } from "zustand/middleware";
interface AppStore {
  enabledPushNotifications: boolean;
  fcmToken?: string;
  setEnabledPushNotifications: (enabled: boolean) => void;
  setSavedFcmToken: (token: string) => void;
  reset: () => void;
}

const initialState = {
  enabledPushNotifications: true,
};

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,
      setEnabledPushNotifications: (enabledPushNotifications) =>
        set((state) => ({ enabledPushNotifications })),
      setSavedFcmToken: (fcmToken) => ({ fcmToken }),
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAppStore;
