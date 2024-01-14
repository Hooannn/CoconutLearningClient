import { Card, CardBody, Avatar, Button } from "@nextui-org/react";
import { IResponseData, Notification } from "../types";
import { FaCircle } from "react-icons/fa";
import { AiFillBell } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosIns from "../hooks/useAxiosIns";
import { onError } from "../utils/error-handlers";
import toast from "react-hot-toast";
import dayjs from "../libs/dayjs";
export default function NotificationCard(props: {
  notification: Notification;
  notificationDidPress: (n_id: string) => void;
}) {
  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const callWebhookMutation = useMutation({
    mutationFn: (params: { webhookUrl: string; notificationId: string }) => {
      return axios.post<IResponseData<unknown>>(
        `${params.webhookUrl}?notificationId=${params.notificationId}`
      );
    },
    onError,
    onSuccess: (data) => {
      toast.success(data.data?.message || "Success");
      queryClient.invalidateQueries(["fetch/notifications/unread/count"]);
      queryClient.invalidateQueries(["fetch/notifications"]);
    },
  });

  return (
    <Card
      shadow="sm"
      isPressable={props.notification?.redirect_url?.length > 0}
      onPress={() => {
        props.notificationDidPress(props.notification.id);
        window.location.href = props.notification.redirect_url;
      }}
    >
      <CardBody className="overflow-visible">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Avatar
              className="w-12 h-12"
              showFallback
              fallback={
                <AiFillBell
                  className="w-6 h-6 text-default-500"
                  fill="currentColor"
                  size={20}
                />
              }
              size="md"
              src={props.notification.image_url}
            />
            <div className="flex flex-col max-w-[240px]">
              <div className="font-bold">{props.notification.title}</div>
              <div className="text-xs">{props.notification.content}</div>
              <small className="opacity-60">
                {dayjs(props.notification.created_at).fromNow()}
              </small>
            </div>
          </div>
          {!props.notification.read && (
            <FaCircle className="w-2 h-2 text-red-500" />
          )}
        </div>
        {props.notification.actions?.length > 0 && (
          <>
            <div className="flex items-center justify-end gap-1 mt-1">
              {props.notification.actions.map((action) => (
                <Button
                  isLoading={callWebhookMutation.isLoading}
                  size="sm"
                  color={action.type.toLowerCase() as never}
                  key={action.title + props.notification.id}
                  onClick={() => {
                    callWebhookMutation.mutate({
                      webhookUrl: action.callback_url,
                      notificationId: props.notification.id,
                    });
                  }}
                >
                  {action.title}
                </Button>
              ))}
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
