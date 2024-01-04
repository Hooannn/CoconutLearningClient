import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as firebase from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  deleteToken,
} from "firebase/messaging";
import { useMutation } from "@tanstack/react-query";
import useAxiosIns from "../hooks/useAxiosIns";
import { IResponseData } from "../types";
import { onError } from "../utils/error-handlers";
import useAuthStore from "../stores/auth";
import useAppStore from "../stores/app";
import { toast } from "react-hot-toast";
const FirebaseContext = createContext<{
  instance: firebase.FirebaseApp | null;
  disabledPushNotifications?: (toastOnFinishing: boolean) => Promise<void>;
  enabledPushNotifications?: (toastOnFinishing: boolean) => Promise<void>;
}>({
  instance: null,
});

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const FirebaseProvider = ({
  children,
  config,
}: PropsWithChildren<{ config: firebase.FirebaseOptions }>) => {
  const [firebaseApp, setFirebaseApp] = useState<firebase.FirebaseApp | null>(
    null
  );

  const { isLoggedIn: isLogged } = useAuthStore();
  const {
    enabledPushNotifications: isEnabledPushNotifications,
    setEnabledPushNotifications,
    setSavedFcmToken,
  } = useAppStore();
  const axios = useAxiosIns();

  const registerFcmTokenMutation = useMutation({
    mutationFn: (token: string) =>
      axios.post<IResponseData<unknown>>(
        "/api/v1/push_notifications/register",
        {
          token,
          platform: "WEB",
        }
      ),
    onError: onError,
  });

  const disabledPushNotifications = async (toastOnFinishing: boolean) => {
    if (firebaseApp) {
      await deleteToken(getMessaging(firebaseApp));
      setEnabledPushNotifications(false);
      if (toastOnFinishing) toast.success("Disabled push notifications");
    }
  };

  const enabledPushNotifications = async (toastOnFinishing: boolean) => {
    if (firebaseApp) {
      const res = new Promise<void>((resolve, reject) => {
        getToken(getMessaging(firebaseApp), {
          vapidKey:
            "BF1dEqXgdqn8eX6hEtofxnc9-kt-mutn69YY5I8Ra8bd2tFXnLc_gQQ_nkoXwfdz0bvs-DERcYwprJKoKs2q8Yg",
        })
          .then((token) => {
            resolve();
            setEnabledPushNotifications(true);
            registerFcmTokenMutation.mutateAsync(token).then(() => {
              setSavedFcmToken(token);
            });
            if (toastOnFinishing) toast.success("Enabled push notifications");
          })
          .catch((err) => {
            reject(err.message);
            setEnabledPushNotifications(false);
            toast.error(err.message || JSON.stringify(err));
          });
      });

      onMessage(getMessaging(firebaseApp), (payload) => {
        console.log("Message received. ", payload);
        // ...
      });

      return res;
    }
  };

  useEffect(() => {
    if (!isLogged || !firebaseApp) return;
    if (isEnabledPushNotifications) enabledPushNotifications(false);
  }, [firebaseApp, isLogged]);

  useEffect(() => {
    if (!firebaseApp) {
      const app = firebase.initializeApp(config);
      setFirebaseApp(app);
    }

    return () => {};
  }, [config, firebaseApp]);

  return (
    <FirebaseContext.Provider
      value={{
        instance: firebaseApp,
        disabledPushNotifications,
        enabledPushNotifications,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
