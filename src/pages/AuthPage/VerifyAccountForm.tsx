import { Input, Button, Link } from "@nextui-org/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiOutlineLock } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import useAuth from "../../services/auth";

type VerifyAccountInputs = {
  code: string;
};
export default function VerifyAccountForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyAccountInputs>();

  const onSubmit: SubmitHandler<VerifyAccountInputs> = (data) =>
    verifyAccountMutation.mutate({
      email: atob(searchParams.get("email")?.toString() ?? ""),
      signature: data.code,
    });

  const { verifyAccountMutation, resendVerifyAccountMutation } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <>
      <div>
        <h3 className="font-medium text-3xl">Verify account,</h3>
        <h3 className="font-medium text-3xl">
          Submit your signature code to continue.
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
          startContent={
            <AiOutlineLock className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          errorMessage={errors.code?.message}
          {...register("code", {
            required: "Signature code is required",
          })}
          color="primary"
          variant="bordered"
          label="Signature code"
          placeholder="Enter your code"
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Button
          isLoading={verifyAccountMutation.isPending}
          onClick={handleSubmit(onSubmit)}
          color="primary"
          size="lg"
        >
          Submit
        </Button>
        <Button
          isLoading={resendVerifyAccountMutation.isPending}
          onClick={() => {
            resendVerifyAccountMutation.mutate({
              email: atob(searchParams.get("email")?.toString() ?? ""),
            });
          }}
          size="lg"
        >
          Re-send verify code
        </Button>
      </div>
    </>
  );
}
