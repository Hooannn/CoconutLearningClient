import { Suspense } from "react";
import PrivateRoute from "../components/PrivateRoute";
import DashboardPage from "../pages/DashboardPage";
import ErrorPage from "../pages/ErrorPage";
import MainLayout from "../layouts/MainLayout";
import Global from "../Global";
import ClassroomPage from "../pages/ClassroomPage";
import CalendarPage from "../pages/CalendarPage";
import ClassworkPage from "../pages/ClassworkPage";
import NeedReviewPage from "../pages/NeedReviewPage";
import TodoPage from "../pages/TodoPage";
import NotificationPage from "../pages/NotificationPage";
import MeetingPage from "../pages/MeetingPage";
import WebhookPage from "../pages/WebhookPage";
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
        path: "/notification",
        element: <NotificationPage />,
      },
      {
        path: "/webhook",
        element: <WebhookPage />,
      },
      {
        path: "/calendar",
        element: <CalendarPage />,
      },
      {
        path: "/need-review",
        element: <NeedReviewPage />,
      },
      {
        path: "/todo",
        element: <TodoPage />,
      },
      {
        path: "/classroom/:classroomId",
        element: <ClassroomPage />,
      },
      {
        path: "/classroom/:classroomId/meeting/:meetingId",
        element: <MeetingPage />,
      },
      {
        path: "/classroom/:classroomId/calendar",
        element: <CalendarPage />,
      },
      {
        path: "/classroom/:classroomId/classwork/:classworkId",
        element: <ClassworkPage />,
      },
    ],
    errorElement: <ErrorPage />,
  },
];

export default rootRouter;
