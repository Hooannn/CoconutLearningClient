import { Image } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import VerifyAccountForm from "./VerifyAccountForm";

type AuthType =
  | "signIn"
  | "signUp"
  | "forgotPassword"
  | "resetPassword"
  | "verifyAccount";

export default function AuthPage() {
  const [authType, setAuthType] = useState<AuthType>("signIn");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const type = searchParams.get("type") as AuthType;
    setAuthType(type || "signIn");
  }, [searchParams]);

  const form = useMemo(() => {
    switch (authType) {
      case "signIn":
        return <SignInForm />;
      case "signUp":
        return <SignUpForm />;
      case "forgotPassword":
        return <ForgotPasswordForm />;
      case "resetPassword":
        return <ResetPasswordForm />;
      case "verifyAccount":
        return <VerifyAccountForm />;
    }
  }, [authType]);

  return (
    <div className="flex gap-8 items-center justify-center h-dvh">
      <div className="w-1/3 p-8 pr-0 overflow-hidden h-full">
        <Image
          removeWrapper
          className="h-full w-full object-cover"
          alt="Authen image"
          src="/auth-image.jpg"
        />
      </div>
      <div className="w-2/3 p-8 pl-0">
        <div className="max-w-[700px] mx-auto flex flex-col gap-6">{form}</div>
      </div>
    </div>
  );
}
