import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosIns from "../hooks/useAxiosIns";
import { GetQuery, IResponseData, Notification } from "../types";

const useNotifications = () => {
  const axios = useAxiosIns();
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
    }

    return () => {
      socket?.removeListener("notification:created");
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

export default useNotifications;
