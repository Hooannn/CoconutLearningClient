import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FirebaseProvider } from "./contexts/FirebaseContext";
import { SocketProvider } from "./contexts/SocketContext";
import { RouterProvider } from "react-router-dom";
import getRouter from "./router";
import { Toaster } from "react-hot-toast";
import { FirebaseOptions } from "firebase/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NextUIProvider } from "@nextui-org/react";

const GG_CLIENT_ID = import.meta.env.VITE_GG_CLIENT_ID;
const queryClient = new QueryClient();

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyC2AXrzuRMfm24AgPpfK0Z1OTCQnG1hWuA",
  authDomain: "elearning-5eb65.firebaseapp.com",
  projectId: "elearning-5eb65",
  storageBucket: "elearning-5eb65.appspot.com",
  messagingSenderId: "440316162595",
  appId: "1:440316162595:web:792576b0964969b7293796",
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <NextUIProvider>
    <GoogleOAuthProvider clientId={GG_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <FirebaseProvider config={firebaseConfig}>
          <SocketProvider socketUrl={import.meta.env.VITE_SOCKET_ENDPOINT}>
            <RouterProvider router={getRouter()}></RouterProvider>
            <Toaster />
          </SocketProvider>
        </FirebaseProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </NextUIProvider>
);
