import AuthPage from "../pages/AuthPage";
import ErrorPage from "../pages/ErrorPage";
import { Suspense } from "react";
const authRouter = [
  {
    path: "/auth",
    element: (
      <Suspense>
        <AuthPage />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
];

export default authRouter;
