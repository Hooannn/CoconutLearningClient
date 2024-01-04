import { useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";

const useNotifications = () => {
  const { socket } = useSocket();
  useEffect(() => {
    if (socket) {
      socket.on("notification:created", (data) => {
        console.log("[Socket] notification:created", data);
      });
    }

    return () => {
      socket?.removeListener("notification:created");
    };
  }, [socket]);

  return {};
};

export default useNotifications;
