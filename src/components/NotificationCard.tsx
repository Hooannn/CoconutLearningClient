import { Card, CardBody, Avatar } from "@nextui-org/react";
import { Notification } from "../types";
import { FaCircle } from "react-icons/fa";
import { AiFillBell } from "react-icons/ai";
export default function NotificationCard(props: {
  notification: Notification;
  notificationDidPress: (n_id: string) => void;
}) {
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
            </div>
          </div>
          {!props.notification.read && (
            <FaCircle className="w-2 h-2 text-red-500" />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
