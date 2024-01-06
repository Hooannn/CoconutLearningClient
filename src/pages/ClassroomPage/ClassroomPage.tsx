import { Button, Spinner, Tab, Tabs, Tooltip } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import useAuthStore from "../../stores/auth";
import {
  AiOutlineSetting,
  AiOutlineCalendar,
  AiOutlineFolderOpen,
} from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData } from "../../types";
import { Classroom } from "../../types/classroom";
import FeedTab from "./FeedTab";
import ClassworkTab from "./ClassworkTab";
import MembersTab from "./MembersTab";
import ScoresTab from "./ScoresTab";
import NotFound from "../../components/NotFound";
import ClassroomSetting from "./ClassroomSetting";
import { useState } from "react";
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
  return (
    <>
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
                {isOwner && (
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
                )}
              </div>
              <Tabs
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
                  <ClassworkTab />
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
