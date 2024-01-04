import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  AiFillVideoCamera,
  AiOutlineDashboard,
  AiOutlineCarryOut,
} from "react-icons/ai";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/auth";
const menuItems = [
  {
    to: "/",
    icon: <AiOutlineDashboard size={25} />,
    label: "Dashboard",
  },
  {
    to: "/calendar",
    icon: <AiOutlineCarryOut size={25} />,
    label: "Calendar",
  },
  {
    to: "/meeting",
    icon: <AiFillVideoCamera size={25} />,
    label: "Video",
  },
];
export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const onMenuItemClick = (item: {
    to: string;
    label: string;
    icon: JSX.Element;
  }) => {
    navigate(item.to);
  };

  useEffect(() => {
    setActiveTab(
      menuItems.find((item) => item.to === location.pathname)?.label as string
    );
  }, [location]);
  return (
    <>
      <ProSidebar collapsed={collapsed} collapsedWidth="100px">
        <div className="h-full flex flex-col align-center px-3">
          <div className="w-full py-8">
            <img className="mx-auto" width="50" src="/vite.svg" alt="logo" />
          </div>
          <Menu
            menuItemStyles={{
              button: ({ level, active }) => {
                if (level === 0)
                  return {
                    color: active ? "rgb(3 105 161)" : "silver",
                    backgroundColor: active ? "rgb(186 230 253)" : undefined,
                    borderRadius: "12px",
                    margin: "4px 0",
                  };
              },
            }}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => onMenuItemClick(item)}
                active={activeTab === item.label}
                icon={item.icon}
              >
                {!collapsed && (
                  <div className="text-sm font-medium">{item.label}</div>
                )}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </ProSidebar>
    </>
  );
}
