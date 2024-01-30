import { Button, Skeleton, Spinner, Tooltip } from "@nextui-org/react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosIns from "../../hooks/useAxiosIns";
import { GetQuery, IResponseData, Notification } from "../../types";
import { AiOutlineMenuFold, AiOutlineDelete } from "react-icons/ai";
import Empty from "../../components/Empty";
import NotificationCard from "../../components/NotificationCard";

export default function NotificationPage() {
  const axios = useAxiosIns();
  const queryClient = useQueryClient();
  const [query] = useState<GetQuery>({
    offset: 0,
    limit: 100000,
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
      refetchNotifications();
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () =>
      axios.post<IResponseData<unknown>>(`/api/v1/notifications/mark-all`),
    onSuccess: () => {
      refetchNotifications();
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: () =>
      axios.delete<IResponseData<unknown>>(`/api/v1/notifications/own`),
    onSuccess: () => {
      refetchNotifications();
    },
  });

  const notifications = getNotificationsQuery.data?.data?.data ?? [];

  const isLoading =
    getUnreadNotificationsCountQuery.isLoading ||
    getNotificationsQuery.isLoading;

  const refetchNotifications = () => {
    queryClient.invalidateQueries(["fetch/notifications/unread/count"]);
    queryClient.invalidateQueries(["fetch/notifications"]);
  };
  return (
    <div>
      {isLoading ? (
        <div className="w-full h-24 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col items-center max-w-[980px] mx-auto">
          <div className="flex items-center justify-between w-full pt-2 px-3">
            <h3 className="text-xl font-bold">Notifications</h3>
            <div className="flex items-center justify-end">
              <Tooltip content="Mark as all read">
                <Button
                  isLoading={markAllAsReadMutation.isLoading}
                  onClick={() => {
                    markAllAsReadMutation.mutate();
                  }}
                  isIconOnly
                  variant="light"
                >
                  <AiOutlineMenuFold className="w-4 h-4" />
                </Button>
              </Tooltip>

              <Tooltip content="Delete all">
                <Button
                  onClick={() => {
                    deleteAllMutation.mutate();
                  }}
                  isLoading={deleteAllMutation.isLoading}
                  isIconOnly
                  color="danger"
                  variant="light"
                >
                  <AiOutlineDelete className="w-4 h-4" />
                </Button>
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-col gap-1 px-3 py-2 w-full">
            {isLoading ? (
              <>
                {Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <Skeleton
                      key={"Skeleton::" + i}
                      className="rounded-lg w-full"
                    >
                      <div className="w-full h-24 rounded-lg bg-default-300"></div>
                    </Skeleton>
                  ))}
              </>
            ) : notifications.length > 0 ? (
              <>
                {notifications.map((notification) => (
                  <NotificationCard
                    notificationDidPress={(n_id) => {
                      markAsReadMutation.mutate({ notificationId: n_id });
                    }}
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </>
            ) : (
              <Empty />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
