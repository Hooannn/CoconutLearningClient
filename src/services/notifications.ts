import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosIns from "../hooks/useAxiosIns";
import { GetQuery, IResponseData, Notification } from "../types";
import { useLocation } from "react-router-dom";

const useNotifications = () => {
  const axios = useAxiosIns();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState<GetQuery>({
    offset: 0,
    limit: 5,
  });

  const getNotificationsQuery = useQuery({
    queryKey: ["fetch/notifications", query],
    queryFn: () =>
      axios.get<IResponseData<Notification[]>>(`/api/v1/notifications/own`, {
        params: query,
      }),
    refetchOnWindowFocus: false,
  });

  const getUnreadNotificationsCountQuery = useQuery({
    queryKey: ["fetch/notifications/unread/count"],
    queryFn: () =>
      axios.get<IResponseData<number>>(`/api/v1/notifications/unread/count`),
    refetchOnWindowFocus: false,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (params: { notificationId: string }) =>
      axios.post<IResponseData<unknown>>(
        `/api/v1/notifications/mark/${params.notificationId}`
      ),
    onSuccess: () => {
      invalidateQueries();
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () =>
      axios.post<IResponseData<unknown>>(`/api/v1/notifications/mark-all`),
    onSuccess: () => {
      invalidateQueries();
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: () =>
      axios.delete<IResponseData<unknown>>(`/api/v1/notifications/own`),
    onSuccess: () => {
      invalidateQueries();
    },
  });

  const unreadCount = getUnreadNotificationsCountQuery.data?.data?.data ?? 0;
  const notifications = getNotificationsQuery.data?.data?.data ?? [];

  const isLoading =
    getUnreadNotificationsCountQuery.isLoading ||
    getNotificationsQuery.isLoading;

  const invalidateQueries = () => {
    queryClient.invalidateQueries(["fetch/notifications/unread/count"]);
    queryClient.invalidateQueries(["fetch/notifications"]);
  };

  const { socket } = useSocket();
  useEffect(() => {
    if (socket) {
      socket.on("notification:created", () => {
        invalidateQueries();
      });

      socket.on(
        "classroom:updated",
        (data: { type: ClassroomUpdateType; classroom_id: string }) => {
          if (location.pathname.includes(`/classroom/${data.classroom_id}`)) {
            if (
              [
                ClassroomUpdateType.CLASSROOM,
                ClassroomUpdateType.MEMBER,
              ].includes(data.type)
            )
              queryClient.invalidateQueries([
                "fetch/classroom/id",
                data.classroom_id,
              ]);
            if (
              [ClassroomUpdateType.POST, ClassroomUpdateType.COMMENT].includes(
                data.type
              )
            )
              queryClient.invalidateQueries([
                "fetch/posts/classroom",
                data.classroom_id,
              ]);

            if ([ClassroomUpdateType.CLASSWORK].includes(data.type)) {
              queryClient.invalidateQueries([
                "fetch/classworks/classroom",
                data.classroom_id,
              ]);
              queryClient.invalidateQueries([
                "fetch/classwork_categories/classroom",
                data.classroom_id,
              ]);
            }
          }

          if ([ClassroomUpdateType.CLASSROOM].includes(data.type)) {
            queryClient.invalidateQueries(["fetch/classrooms/teaching"]);
            queryClient.invalidateQueries(["fetch/classrooms/registered"]);
          }
        }
      );
    }

    return () => {
      socket?.removeListener("notification:created");
      socket?.removeListener("classroom:updated");
    };
  }, [socket]);

  return {
    setQuery,
    unreadCount,
    notifications,
    isLoading,
    markAsReadMutation,
    markAllAsReadMutation,
    deleteAllMutation,
  };
};

enum ClassroomUpdateType {
  CLASSROOM = "CLASSROOM",
  CLASSWORK = "CLASSWORK",
  POST = "POST",
  COMMENT = "COMMENT",
  MEMBER = "MEMBER",
}

export default useNotifications;
