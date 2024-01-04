import { Input, Button, Link, Image } from "@nextui-org/react";
import { useGoogleLogin } from "@react-oauth/google";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import useAuth from "../../services/auth";
import { IResponseData } from "../../types";
import toast from "react-hot-toast";

type SignInInputs = {
  email: string;
  password: string;
};
export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInputs>();

  const { signInMutation, signInWithGoogleMutation } = useAuth();

  const onSubmit: SubmitHandler<SignInInputs> = (data) => {
    signInMutation.mutateAsync(data).catch((err) => {
      if (
        (err as AxiosError<IResponseData<unknown>>).response?.data?.message ===
        "User is disabled"
      ) {
        searchParams.set("type", "verifyAccount");
        searchParams.set("email", btoa(data.email));
        setSearchParams(searchParams);
      }
    });
  };

  const [isVisible, setIsVisible] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      signInWithGoogleMutation.mutate(tokenResponse);
    },
    onError: (errorResponse) => {
      toast.error(
        errorResponse?.error_description ||
          errorResponse?.error ||
          "Something went wrong. Please try again"
      );
    },
  });

  const toggleVisibility = () => setIsVisible(!isVisible);
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <>
      <div>
        <h3 className="font-medium text-3xl">Welcome to Panorama,</h3>
        <h3 className="font-medium text-3xl">Sign In to Continue.</h3>
      </div>
      <div>
        <div className="font-medium">
          Don't have an account?{" "}
          <Link
            className="cursor-pointer"
            color="foreground"
            target="_self"
            underline="always"
            onClick={() => {
              searchParams.set("type", "signUp");
              setSearchParams(searchParams);
            }}
          >
            Create a account
          </Link>
        </div>
        <div className="font-medium">It takes less than a minute</div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Input
          errorMessage={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Invalid email address",
            },
          })}
          color="primary"
          variant="bordered"
          type="email"
          label="Email"
          placeholder="Enter your email"
        />
        <Input
          errorMessage={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
          color="primary"
          label="Password"
          variant="bordered"
          placeholder="Enter your password"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <AiOutlineEye className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
        />

        <div className="mx-auto">
          <Link
            className="cursor-pointer"
            onClick={() => {
              searchParams.set("type", "forgotPassword");
              setSearchParams(searchParams);
            }}
            color="foreground"
            size="sm"
            underline="always"
          >
            Forgot password?
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Button
          isLoading={
            signInMutation.isPending || signInWithGoogleMutation.isPending
          }
          onClick={handleSubmit(onSubmit)}
          color="primary"
          size="lg"
        >
          Sign In
        </Button>
        <Button
          isLoading={
            signInMutation.isPending || signInWithGoogleMutation.isPending
          }
          variant="flat"
          onClick={() => googleLogin()}
          size="lg"
        >
          <Image src="/google_icon.png" width={28} height={28} />
          Sign In with Google
        </Button>
      </div>
    </>
  );
}
