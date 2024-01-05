import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  User,
} from "@nextui-org/react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import useAuthStore from "../stores/auth";
import useAuth from "../services/auth";
import NotificationBell from "../components/NotificationBell";
import JoinClassroomModal from "../components/JoinClassroomModal";
import { useState } from "react";
import CreateClassroomModal from "../components/CreateClassroomModal";

export default function NavBar() {
  const { user } = useAuthStore();
  const { signOutMutation } = useAuth();

  const signOut = async () => {
    signOutMutation.mutate();
  };

  const [shouldJoinModalOpen, setJoinModalOpen] = useState(false);
  const [shouldCreateModalOpen, setCreateModalOpen] = useState(false);

  return (
    <>
      <JoinClassroomModal
        isOpen={shouldJoinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />
      <CreateClassroomModal
        isOpen={shouldCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
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
      <div className="flex items-center gap-3">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button color="primary" size="md" variant="faded" isIconOnly>
              <AiOutlinePlus className="w-4 h-4" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Create or join classroom" variant="flat">
            <DropdownItem
              onClick={() => setCreateModalOpen(true)}
              className="py-2"
              key="create_classroom"
            >
              Create classroom
            </DropdownItem>
            <DropdownItem
              onClick={() => setJoinModalOpen(true)}
              className="py-2"
              key="join_classroom"
            >
              Join classroom
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <NotificationBell />
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
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem onClick={() => signOut()} key="logout" color="danger">
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}
