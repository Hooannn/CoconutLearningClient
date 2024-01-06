import { Suspense } from "react";
import PrivateRoute from "../components/PrivateRoute";
import DashboardPage from "../pages/DashboardPage";
import ErrorPage from "../pages/ErrorPage";
import MainLayout from "../layouts/MainLayout";
import Global from "../Global";
import ClassroomPage from "../pages/ClassroomPage";
import CalendarPage from "../pages/CalendarPage";
const rootRouter = [
  {
    path: "/",
    element: (
      <Suspense>
        <PrivateRoute>
          <Global>
            <MainLayout />
          </Global>
        </PrivateRoute>
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/calendar",
        element: <CalendarPage />,
      },
      {
        path: "/need-review",
        element: <div>Hello</div>,
      },
      {
        path: "/todo",
        element: <div>Hello</div>,
      },
      {
        path: "/classroom/:classroomId",
        element: <ClassroomPage />,
      },
    ],
    errorElement: <ErrorPage />,
  },
];

export default rootRouter;
