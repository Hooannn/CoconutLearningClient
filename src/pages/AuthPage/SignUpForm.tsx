import { Input, Button, Link, Image } from "@nextui-org/react";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import useAuth from "../../services/auth";
import toast from "react-hot-toast";

type SignUpInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpInputs>();
  const watchPassword = watch("password", "");
  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {
    await signUpMutation.mutateAsync({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    searchParams.set("type", "verifyAccount");
    searchParams.set("email", btoa(data.email));
    setSearchParams(searchParams);
  };
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const { signUpMutation, signInWithGoogleMutation } = useAuth();

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
  const toggleVisibility2 = () => setIsVisible2(!isVisible2);
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <>
      <div>
        <h3 className="font-medium text-3xl">Welcome to Panorama,</h3>
        <h3 className="font-medium text-3xl">
          Create a new account to continue.
        </h3>
      </div>
      <div>
        <div className="font-medium">
          Already have an account?{" "}
          <Link
            className="cursor-pointer"
            onClick={() => {
              searchParams.set("type", "signIn");
              setSearchParams(searchParams);
            }}
            color="foreground"
            underline="always"
          >
            Sign In
          </Link>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex gap-3">
          <Input
            errorMessage={errors.firstName?.message}
            {...register("firstName", {
              required: "First name is required",
            })}
            color="primary"
            variant="bordered"
            className="w-1/2"
            label="First name"
            placeholder="Enter your first name"
          />

          <Input
            errorMessage={errors.lastName?.message}
            {...register("lastName", {
              required: "Last name is required",
            })}
            color="primary"
            className="w-1/2"
            variant="bordered"
            label="Last name"
            placeholder="Enter your last name"
          />
        </div>

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

        <Input
          errorMessage={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) =>
              value === watchPassword || "Passwords do not match",
          })}
          color="primary"
          label="Confirm password"
          variant="bordered"
          placeholder="Enter your password again"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility2}
            >
              {isVisible2 ? (
                <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <AiOutlineEye className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible2 ? "text" : "password"}
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
          isLoading={signUpMutation.isPending}
          onClick={handleSubmit(onSubmit)}
          color="primary"
          size="lg"
        >
          Sign Up
        </Button>
        <Button
          isLoading={signUpMutation.isPending}
          variant="flat"
          onClick={() => googleLogin()}
          size="lg"
        >
          <Image src="/google_icon.png" width={28} height={28} />
          Sign Up with Google
        </Button>
      </div>
    </>
  );
}
