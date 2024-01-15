import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import cookies from "../libs/cookies";
import useAuthStore from "../stores/auth";

export default function PrivateRoute(props: PropsWithChildren) {
  const location = useLocation();
  const { isLoggedIn } = useAuthStore();
  if (!isLoggedIn) {
    console.log(location.pathname);
    cookies.set("redirect_path", location.pathname);
    return <Navigate to={"/auth"} replace />;
  }
  return props.children;
}
