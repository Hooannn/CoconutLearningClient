import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import NavBar from "./NavBar";

export default function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col h-dvh w-full">
        <div className="h-20 flex justify-between items-center p-10 border-1 border-x-0">
          <NavBar />
        </div>
        <div className="h-full overflow-auto relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
