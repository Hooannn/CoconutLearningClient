import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import {
  AiOutlineCarryOut,
  AiOutlineHome,
  AiOutlineUser,
} from "react-icons/ai";
import { BsCardChecklist } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { RiGraduationCapLine } from "react-icons/ri";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineBars } from "react-icons/ai";
import { Avatar, Button, Divider, Image } from "@nextui-org/react";
import { IoMdFolderOpen } from "react-icons/io";
import useClassroomStore from "../stores/classroom";
const menuItems = [
  {
    to: "/",
    icon: <AiOutlineHome size={20} />,
    label: "Dashboard",
  },
  {
    to: "/calendar",
    icon: <AiOutlineCarryOut size={20} />,
    label: "Calendar",
  },
];
export default function Sidebar() {
  const location = useLocation();
  const { registeredClassrooms, teachingClassrooms } = useClassroomStore();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const onMenuItemClick = (item: {
    to: string;
    label: string;
    icon: JSX.Element;
  }) => {
    navigate(item.to);
  };

  return (
    <>
      <ProSidebar collapsed={collapsed} collapsedWidth="100px">
        <div className="h-full flex flex-col align-center px-3">
          <Button
            onClick={() => setCollapsed(!collapsed)}
            isIconOnly
            className="absolute top-4 right-[-20px]"
          >
            <AiOutlineBars className="w-4 h-4" />
          </Button>
          <div className="w-full py-8">
            <Image
              onClick={() => navigate("/")}
              removeWrapper
              className="mx-auto cursor-pointer"
              width={collapsed ? "70" : "150"}
              src="/coconut 2.png"
              alt="logo"
            />
          </div>
          <Menu
            menuItemStyles={{
              button: ({ active }) => {
                return {
                  color: active ? "rgb(3 105 161)" : "black",
                  backgroundColor: active ? "rgb(186 230 253)" : "undefined",
                  fontWeight: active ? "bold" : "medium",
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
                active={location.pathname === item.to}
                icon={item.icon}
              >
                {!collapsed && <div className="text-sm">{item.label}</div>}
              </MenuItem>
            ))}
            <Divider></Divider>
            <SubMenu
              className="text-sm"
              icon={<FiUsers size={20} />}
              label="Teaching"
            >
              <MenuItem
                onClick={() => navigate(`/need-review`)}
                active={location.pathname === "/need-review"}
                icon={<IoMdFolderOpen size={20} />}
              >
                Need review
              </MenuItem>
              {teachingClassrooms.map((classroom) => (
                <MenuItem
                  key={classroom.id}
                  active={location.pathname === `/classroom/${classroom.id}`}
                  onClick={() => navigate(`/classroom/${classroom.id}`)}
                  icon={
                    <Avatar
                      size="sm"
                      fallback={
                        <AiOutlineUser
                          className="text-default-500"
                          fill="currentColor"
                          size={20}
                        />
                      }
                      showFallback
                      src={classroom.owner.avatar_url}
                    />
                  }
                >
                  <div className="flex flex-col font-medium">
                    <div className="truncate">{classroom.name}</div>
                    <div className="text-muted-foreground text-xs font-thin truncate">
                      {classroom.description}
                    </div>
                  </div>
                </MenuItem>
              ))}
            </SubMenu>
            <Divider></Divider>
            <SubMenu
              className="text-sm"
              icon={<RiGraduationCapLine size={20} />}
              label="Registered"
            >
              <MenuItem
                active={location.pathname === "/todo"}
                onClick={() => navigate(`/todo`)}
                icon={<BsCardChecklist size={20} />}
              >
                Todo
              </MenuItem>
              {registeredClassrooms.map((classroom) => (
                <MenuItem
                  key={classroom.id}
                  active={location.pathname === `/classroom/${classroom.id}`}
                  onClick={() => navigate(`/classroom/${classroom.id}`)}
                  icon={
                    <Avatar
                      size="sm"
                      fallback={
                        <AiOutlineUser
                          className="text-default-500"
                          fill="currentColor"
                          size={20}
                        />
                      }
                      showFallback
                      src={classroom.owner.avatar_url}
                    />
                  }
                >
                  <div className="flex flex-col font-medium">
                    <div className="truncate">{classroom.name}</div>
                    <div className="text-muted-foreground text-xs font-thin truncate">
                      {classroom.description}
                    </div>
                  </div>
                </MenuItem>
              ))}
            </SubMenu>
          </Menu>
        </div>
      </ProSidebar>
    </>
  );
}
