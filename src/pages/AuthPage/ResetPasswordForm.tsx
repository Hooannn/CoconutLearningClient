import { Input, Button, Link } from "@nextui-org/react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import useAuth from "../../services/auth";

type ResetPasswordInputs = {
  password: string;
  confirmPassword: string;
  code: string;
};
export default function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordInputs>();
  const watchPassword = watch("password", "");

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (data) => {
    await resetPasswordMutation.mutateAsync({
      email: atob(searchParams.get("email")?.toString() ?? ""),
      newPassword: data.password,
      signature: data.code,
    });
    searchParams.set("type", "signIn");
    setSearchParams(searchParams);
  };

  const { resetPasswordMutation } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibility2 = () => setIsVisible2(!isVisible2);
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <>
      <div>
        <h3 className="font-medium text-3xl">Reset password,</h3>
        <h3 className="font-medium text-3xl">
          Submit your new passwords to continue.
        </h3>
      </div>
      <div>
        <div className="font-medium">
          Already done?{" "}
          <Link
            className="cursor-pointer"
            color="foreground"
            target="_self"
            underline="always"
            onClick={() => {
              searchParams.set("type", "signIn");
              setSearchParams(searchParams);
            }}
          >
            Back to Sign In
          </Link>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
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
          placeholder="Enter your new password"
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

        <Input
          errorMessage={errors.code?.message}
          {...register("code", {
            required: "Code is required",
          })}
          color="primary"
          variant="bordered"
          label="Signature code"
          placeholder="Enter your signature code from your email"
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Button
          isLoading={resetPasswordMutation.isLoading}
          onClick={handleSubmit(onSubmit)}
          color="primary"
          size="lg"
        >
          Submit
        </Button>
      </div>
    </>
  );
}
