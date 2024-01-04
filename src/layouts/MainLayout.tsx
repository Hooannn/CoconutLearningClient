import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Input,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
  Button,
  Badge,
} from "@nextui-org/react";
import { AiOutlineBell, AiOutlineSearch } from "react-icons/ai";
import useAuthStore from "../stores/auth";

export default function MainLayout() {
  const { user, reset } = useAuthStore();
  const signOut = () => {
    reset();
  };
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col h-dvh w-full">
        <div className="h-20 flex justify-between items-center p-2 border-1 border-x-0">
          <div className="w-1/3">
            <Input
              color="primary"
              variant="bordered"
              label="Search"
              isClearable
              radius="lg"
              placeholder="Type to search..."
              startContent={
                <AiOutlineSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
              }
            />
          </div>
          <div className="px-4 flex items-center gap-4">
            <Dropdown placement="bottom-end">
              <Badge size="lg" color="danger" content="5">
                <DropdownTrigger>
                  <Button size="md" variant="bordered" isIconOnly>
                    <AiOutlineBell className="w-4 h-4" />
                  </Button>
                </DropdownTrigger>
              </Badge>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">zoey@example.com</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                <DropdownItem key="analytics">Analytics</DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: user?.avatar_url,
                  }}
                  className="transition-transform"
                  description={user?.role}
                  name={user?.fullName}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                <DropdownItem key="analytics">Analytics</DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem
                  onClick={() => signOut()}
                  key="logout"
                  color="danger"
                >
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="h-full">
          <Outlet />;
        </div>
      </div>
    </div>
  );
}
