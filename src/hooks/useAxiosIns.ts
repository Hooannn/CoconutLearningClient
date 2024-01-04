import { useEffect } from "react";
import axios from "axios";
import useRefreshToken from "./useRefreshToken";
import useAuthStore from "../stores/auth";

export const rawAxios = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

const useAxiosIns = () => {
  const { accessToken } = useAuthStore();
  const getAccessToken = () => accessToken;
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosIns.interceptors.request.use(
      async (config) => {
        if (!config.headers["Authorization"]) {
          const token = getAccessToken();
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosIns.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const token = await refreshToken();
          if (!token) throw new Error("REFRESH_FAILED");
          prevRequest.headers.Authorization = `Bearer ${token}`;
          return axiosIns({
            ...prevRequest,
            headers: prevRequest.headers.toJSON(),
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [refreshToken]);

  return axiosIns;
};

export default useAxiosIns;
