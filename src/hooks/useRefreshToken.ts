import { axiosIns } from "./useAxiosIns";
import useAuthStore from "../stores/auth";
import { toast } from "react-hot-toast";

const useRefreshToken = () => {
  const {
    reset,
    refreshToken: storedRefreshToken,
    setRefreshToken,
    setAccessToken,
  } = useAuthStore();
  const handleError = () => {
    toast.error("Login session expired, please login again");
    reset();
    window.location.href = "/auth";
  };

  const refreshToken = async () =>
    new Promise<string | null>((resolve, reject) => {
      axiosIns({
        url: "/auth/refresh",
        method: "POST",
        validateStatus: null,
        data: {
          refreshToken: storedRefreshToken,
        },
      })
        .then((res) => {
          const token = res.data?.data?.credentials?.access_token;
          const refreshToken = res.data?.data?.credentials?.refresh_token;

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
