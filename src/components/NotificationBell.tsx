import {
  Badge,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
  Tooltip,
  Skeleton,
} from "@nextui-org/react";
import {
  AiOutlineBell,
  AiOutlineDelete,
  AiOutlineMenuFold,
} from "react-icons/ai";
import useNotifications from "../services/notifications";
import Empty from "./Empty";
import NotificationCard from "./NotificationCard";

export default function NotificationBell() {
  const {
    unreadCount,
    notifications,
    isLoading,
    markAllAsReadMutation,
    markAsReadMutation,
    deleteAllMutation,
  } = useNotifications();
  return (
    <Popover showArrow placement="bottom-end" offset={12}>
      {unreadCount > 0 ? (
        <Badge size="lg" color="danger" content={unreadCount}>
          <PopoverTrigger>
            <Button size="md" variant="faded" isIconOnly>
              <AiOutlineBell className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
        </Badge>
      ) : (
        <PopoverTrigger>
          <Button size="md" variant="faded" isIconOnly>
            <AiOutlineBell className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
      )}

      <PopoverContent className="w-96 p-0">
        <div className="flex items-center justify-between w-full py-2 px-3">
          <h3 className="text-lg font-medium">Notifications</h3>
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
        <Divider />
        <div className="flex flex-col gap-1 px-3 py-2 w-full">
          {isLoading ? (
            <>
              {Array(4)
                .fill(null)
                .map((i) => (
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
      </PopoverContent>
    </Popover>
  );
}
