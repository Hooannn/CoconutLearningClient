import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Tab,
  Tabs,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useAuthStore from "../../stores/auth";
import {
  AiOutlineSetting,
  AiOutlineCalendar,
  AiOutlineFolderOpen,
} from "react-icons/ai";
import { IoExitOutline } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData } from "../../types";
import { Classroom } from "../../types/classroom";
import FeedTab from "./FeedTab";
import ClassworkTab from "./ClassworkTab";
import MembersTab from "./MembersTab";
import ScoresTab from "./ScoresTab";
import NotFound from "../../components/NotFound";
import ClassroomSetting from "./ClassroomSetting";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { onError } from "../../utils/error-handlers";
export default function ClassroomPage() {
  const { classroomId } = useParams();
  const { user } = useAuthStore();
  const axios = useAxiosIns();
  const getClassroomQuery = useQuery({
    queryKey: ["fetch/classroom/id", classroomId],
    refetchOnWindowFocus: false,
    queryFn: () =>
      axios.get<IResponseData<Classroom>>(`/api/v1/classrooms/${classroomId}`),
  });
  const classroom = getClassroomQuery.data?.data?.data || null;

  const isOwner = classroom?.owner.id === user?.id;
  const isProvider =
    classroom?.providers.some((p) => p.id === user?.id) || isOwner;

  const [shouldOpenSetting, setOpenSetting] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState("feed");

  useEffect(() => {
    const tab = searchParams.get("tab") ?? "feed";
    setTab(tab);
  }, [searchParams]);

  const {
    isOpen: isLeaveModalOpen,
    onOpen: onOpenLeaveModal,
    onOpenChange: onLeaveModalOpenChange,
    onClose: onLeaveModalClose,
  } = useDisclosure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const leaveClassroomMutation = useMutation({
    mutationFn: () =>
      axios.post<IResponseData<unknown>>(
        `/api/v1/classrooms/leave/${classroom?.id}`
      ),
    onError,
    onSuccess: (data) => {
      toast.success(data.data.message || "Left classroom.");
      onLeaveModalClose();
      queryClient.invalidateQueries(["fetch/classrooms/teaching"]);
      queryClient.invalidateQueries(["fetch/classrooms/registered"]);
      navigate("/");
    },
  });
  return (
    <>
      <Modal isOpen={isLeaveModalOpen} onOpenChange={onLeaveModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm</ModalHeader>
              <ModalBody>
                <div>Are you sure you want to leave this classroom.</div>
                <div>
                  <strong>
                    You will no longer be enable to access to resources in this
                    class.
                  </strong>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={leaveClassroomMutation.isLoading}
                  color="primary"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={leaveClassroomMutation.isLoading}
                  color="danger"
                  onPress={() => {
                    leaveClassroomMutation.mutate();
                  }}
                >
                  Leave
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {getClassroomQuery.isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {classroom != null ? (
            <>
              <ClassroomSetting
                classroom={classroom}
                isOpen={shouldOpenSetting}
                onClose={() => setOpenSetting(false)}
              />
              <div className="absolute right-2 flex items-center h-12 gap-1 z-10">
                <Tooltip content="Calendar">
                  <Button isIconOnly radius="full" variant="light">
                    <AiOutlineCalendar size={18} />
                  </Button>
                </Tooltip>
                <Tooltip content="Folder">
                  <Button isIconOnly radius="full" variant="light">
                    <AiOutlineFolderOpen size={18} />
                  </Button>
                </Tooltip>
                {isOwner ? (
                  <Tooltip content="Setting">
                    <Button
                      onClick={() => setOpenSetting(true)}
                      isIconOnly
                      radius="full"
                      variant="light"
                    >
                      <AiOutlineSetting size={18} />
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip content="Leave">
                    <Button
                      onClick={() => onOpenLeaveModal()}
                      isIconOnly
                      radius="full"
                      variant="light"
                    >
                      <IoExitOutline size={18} />
                    </Button>
                  </Tooltip>
                )}
              </div>
              <Tabs
                selectedKey={tab}
                onSelectionChange={(key) => {
                  if (key == "feed") {
                    searchParams.delete("tab");
                  } else {
                    searchParams.set("tab", key.toString());
                  }
                  setSearchParams(searchParams);
                }}
                color="primary"
                variant="underlined"
                className="w-full"
                classNames={{
                  tabList:
                    "w-full relative rounded-none p-0 border-b border-divider h-12",
                  tab: "w-auto px-8 h-full font-semibold text-sm",
                }}
              >
                <Tab
                  key="feed"
                  title={
                    <div className="flex items-center space-x-2">
                      <span>Feed</span>
                    </div>
                  }
                >
                  <FeedTab
                    isOwner={isOwner}
                    isProvider={isProvider}
                    classroom={classroom}
                  />
                </Tab>
                <Tab
                  key="classwork"
                  title={
                    <div className="flex items-center space-x-2">
                      <span>Classwork</span>
                    </div>
                  }
                >
                  <ClassworkTab
                    isOwner={isOwner}
                    isProvider={isProvider}
                    classroom={classroom}
                  />
                </Tab>
                <Tab
                  key="members"
                  title={
                    <div className="flex items-center space-x-2">
                      <span>Members</span>
                    </div>
                  }
                >
                  <MembersTab
                    isOwner={isOwner}
                    isProvider={isProvider}
                    classroom={classroom}
                  />
                </Tab>
                {isProvider && (
                  <Tab
                    key="scores"
                    title={
                      <div className="flex items-center space-x-2">
                        <span>Scores</span>
                      </div>
                    }
                  >
                    <ScoresTab />
                  </Tab>
                )}
              </Tabs>
            </>
          ) : (
            <NotFound
              text={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (getClassroomQuery.error as any)?.response?.data?.message ||
                null
              }
            />
          )}
        </>
      )}
    </>
  );
}
