import { useMutation } from "@tanstack/react-query";
import cookies from "../libs/cookies";
import { onError } from "../utils/error-handlers";
import { Credentials, IResponseData, IUser } from "../types";
import { useNavigate } from "react-router-dom";
import { rawAxios } from "../hooks/useAxiosIns";
import { toast } from "react-hot-toast";
import useAuthStore from "../stores/auth";
import useAppStore from "../stores/app";
const useAuth = () => {
  const navigate = useNavigate();
  const {
    setAccessToken,
    setRefreshToken,
    setLoggedIn,
    setUser,
    reset: resetAuthStore,
  } = useAuthStore();
  const { reset: resetAppStore } = useAppStore();

  const saveCredentialsAndRedirect = (
    user: IUser,
    accessToken: string,
    refreshToken: string
  ) => {
    const redirectPath = cookies.get("redirect_path") || "/";
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setLoggedIn(true);
    setUser(user);
    navigate(redirectPath as string);
  };

  const verifyAccountMutation = useMutation({
    mutationFn: (params: { email: string; signature: string }) => {
      return rawAxios.post<
        IResponseData<{ user: IUser; credentials: Credentials }>
      >(`/api/v1/auth/verify-account`, {
        email: params.email,
        signature: params.signature,
      });
    },
    onError: onError,
    onSuccess: (res) => {
      toast.success(res.data.message || "Verified successfully");
      const data = res.data?.data;
      const user = data?.user;
      const accessToken = data?.credentials?.access_token;
      const refreshToken = data?.credentials?.refresh_token;
      saveCredentialsAndRedirect(user, accessToken, refreshToken);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: () => {
      return rawAxios.post<IResponseData<unknown>>(`/api/v1/auth/sign-out`, {
        client: "web",
      });
    },
    onError: onError,
    onSuccess: (res) => {
      toast.success(res.data.message || "Signed out successfully");
      resetAuthStore();
      resetAppStore();
    },
  });

  const signInMutation = useMutation({
    mutationFn: (params: { email: string; password: string }) => {
      return rawAxios.post<
        IResponseData<{ user: IUser; credentials: Credentials }>
      >("/api/v1/auth/authenticate", {
        email: params.email,
        password: params.password,
      });
    },

    onError: onError,
    onSuccess: (res) => {
      toast.success(res.data.message);
      const data = res.data?.data;
      const user = data?.user;
      const accessToken = data?.credentials?.access_token;
      const refreshToken = data?.credentials?.refresh_token;
      saveCredentialsAndRedirect(user, accessToken, refreshToken);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (params: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) =>
      rawAxios.post<IResponseData<{ user: IUser; credentials: Credentials }>>(
        "/api/v1/auth/register",
        {
          email: params.email,
          password: params.password,
          firstName: params.firstName,
          lastName: params.lastName,
        }
      ),
    onError: onError,
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (params: { email: string }) =>
      rawAxios.post<IResponseData<unknown>>("/api/v1/auth/forgot-password", {
        email: params.email,
      }),
    onError: onError,
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (params: {
      email: string;
      newPassword: string;
      signature: string;
    }) =>
      rawAxios.post<IResponseData<unknown>>("/api/v1/auth/reset-password", {
        email: params.email,
        new_password: params.newPassword,
        signature: params.signature,
      }),
    onError: onError,
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
  });

  const resendVerifyAccountMutation = useMutation({
    mutationFn: (params: { email: string }) =>
      rawAxios.post<IResponseData<unknown>>(
        "/api/v1/auth/verify-account/resend",
        {
          email: params.email,
        }
      ),
    onError: onError,
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
  });

  const signInWithGoogleMutation = useMutation({
    mutationFn: (params: { access_token: string }) =>
      rawAxios.post<IResponseData<{ user: IUser; credentials: Credentials }>>(
        "/api/v1/auth/google",
        {
          access_token: params.access_token,
        }
      ),
    onError: onError,
    onSuccess: (res) => {
      toast.success(res.data.message);
      const data = res.data?.data;
      const user = data?.user;
      const accessToken = data?.credentials?.access_token;
      const refreshToken = data?.credentials?.refresh_token;
      saveCredentialsAndRedirect(user, accessToken, refreshToken);
    },
  });

  return {
    signInMutation,
    signUpMutation,
    signOutMutation,
    verifyAccountMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    resendVerifyAccountMutation,
    signInWithGoogleMutation,
  };
};

export default useAuth;
