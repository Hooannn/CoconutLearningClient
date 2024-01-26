import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import useAuthStore from "../stores/auth";
import useAuth from "../services/auth";
import NotificationBell from "../components/NotificationBell";
import JoinClassroomModal from "../components/JoinClassroomModal";
import CreateClassroomModal from "../components/CreateClassroomModal";
import ProfileModal from "../components/ProfileModal";
import ConfigurationsModal from "../components/ConfigurationsModal";

export default function NavBar() {
  const { user } = useAuthStore();
  const { signOutMutation } = useAuth();

  const signOut = async () => {
    signOutMutation.mutate();
  };

  const {
    isOpen: isJoinModalOpen,
    onOpen: onJoinModalOpen,
    onClose: onJoinModalClose,
  } = useDisclosure();

  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure();

  const {
    isOpen: isProfileModalOpen,
    onOpen: onProfileModalOpen,
    onClose: onProfileModalClose,
  } = useDisclosure();

  const {
    isOpen: isConfigurationsModalOpen,
    onOpen: onConfigurationsModalOpen,
    onClose: onConfigurationsModalClose,
  } = useDisclosure();

  return (
    <>
      <ProfileModal isOpen={isProfileModalOpen} onClose={onProfileModalClose} />
      <ConfigurationsModal
        isOpen={isConfigurationsModalOpen}
        onClose={onConfigurationsModalClose}
      />
      <JoinClassroomModal isOpen={isJoinModalOpen} onClose={onJoinModalClose} />
      <CreateClassroomModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
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
              onClick={onCreateModalOpen}
              className="py-2"
              key="create_classroom"
            >
              Create classroom
            </DropdownItem>
            <DropdownItem
              onClick={onJoinModalOpen}
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
              name={user?.first_name + " " + user?.last_name}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem onClick={onProfileModalOpen} key="profile">
              Profile
            </DropdownItem>
            <DropdownItem
              onClick={onConfigurationsModalOpen}
              showDivider
              key="configurations"
            >
              Configurations
            </DropdownItem>
            <DropdownItem onClick={() => signOut()} key="logout" color="danger">
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}
