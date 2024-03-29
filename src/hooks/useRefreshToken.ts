import { axiosIns } from "./useAxiosIns";
import useAuthStore from "../stores/auth";
import { toast } from "react-hot-toast";
import useAppStore from "../stores/app";
import cookies from "../libs/cookies";

const useRefreshToken = () => {
  const {
    reset: resetAuthStore,
    refreshToken: storedRefreshToken,
    setRefreshToken,
    setAccessToken,
  } = useAuthStore();
  const { reset: resetAppStore } = useAppStore();
  const handleError = () => {
    toast.error("Login session expired, please login again");
    resetAuthStore();
    resetAppStore();
    cookies.set("redirect_path", location.pathname);
    window.location.href = "/auth";
  };

  const refreshToken = async () =>
    new Promise<string | null>((resolve, reject) => {
      axiosIns({
        url: "/api/v1/auth/refresh",
        method: "POST",
        validateStatus: null,
        data: {
          token: storedRefreshToken,
        },
      })
        .then((res) => {
          const token = res.data?.data?.access_token;
          const refreshToken = res.data?.data?.refresh_token;

          if (refreshToken) setRefreshToken(refreshToken);
          if (token) {
            setAccessToken(token);
            resolve(token);
          } else {
            handleError();
            resolve(null);
          }
        })
        .catch((error) => {
          handleError();
          reject(error);
        });
    });

  return refreshToken;
};

export default useRefreshToken;
