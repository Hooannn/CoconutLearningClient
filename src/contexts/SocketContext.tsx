import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import useAuthStore from "../stores/auth";

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}

export function SocketProvider({
  children,
  socketUrl,
}: PropsWithChildren<{ socketUrl: string }>) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { isLoggedIn: isLogged, accessToken } = useAuthStore();
  useEffect(() => {
    if (isLogged && socketUrl && !socket) {
      const newSocket = io(
        `${socketUrl}notification?access_token=${accessToken}`
      );

      setSocket(newSocket);
    }

    return () => {
      socket?.disconnect();
      socket?.close();
    };
  }, [isLogged, socketUrl]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
