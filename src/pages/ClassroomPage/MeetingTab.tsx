import { useQuery } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { Classroom } from "../../types/classroom";
import { Meeting } from "../../types/meeting";
import { IResponseData } from "../../types";
import { Button, Divider, Spinner, useDisclosure } from "@nextui-org/react";
import SVG4 from "../../components/SVG4";
import { AiOutlinePlus } from "react-icons/ai";
import CreateMeetingModal from "./CreateMeetingModal";
import MeetingCard from "./MeetingCard";
import useAuthStore from "../../stores/auth";
export default function MeetingTab(props: {
  classroom: Classroom;
  isOwner: boolean;
  isProvider: boolean;
}) {
  const { user } = useAuthStore();
  const axios = useAxiosIns();
  const getMeetingQuery = useQuery({
    queryKey: ["fetch/meeting/classroom", props.classroom.id],
    queryFn: () => {
      return axios.get<IResponseData<Meeting[]>>(
        `/api/v1/meeting/classroom/${props.classroom.id}`
      );
    },
    refetchOnWindowFocus: false,
  });
  const meetings = getMeetingQuery.data?.data?.data || [];

  const {
    isOpen: isCreateMeetingModalOpen,
    onOpen: onOpenCreateMeetingModal,
    onClose: onCreateMeetingModalClose,
  } = useDisclosure();
  return (
    <>
      <CreateMeetingModal
        isOpen={isCreateMeetingModalOpen}
        onClose={onCreateMeetingModalClose}
        classroom={props.classroom}
      />
      <div className="flex flex-col gap-4 items-start max-w-[980px] mx-auto h-full">
        {getMeetingQuery.isLoading ? (
          <div className="w-full h-24 flex items-center justify-center">
            <Spinner size="lg"></Spinner>
          </div>
        ) : (
          <>
            {props.isProvider && (
              <Button
                onClick={onOpenCreateMeetingModal}
                className="py-6 px-5"
                color="primary"
              >
                <AiOutlinePlus size={16} />
                Create meeting
              </Button>
            )}
            <Divider className="my-1" />
            {meetings.length > 0 ? (
              <div className="w-full flex flex-col gap-2">
                {meetings.map((meeting) => (
                  <MeetingCard
                    minified={false}
                    key={meeting.id}
                    meeting={meeting}
                    classroom={props.classroom}
                    isOwner={meeting.created_by.id === user?.id}
                  ></MeetingCard>
                ))}
              </div>
            ) : (
              <div className="w-full flex items-center justify-center">
                <div className="w-56 mt-8">
                  <SVG4 />
                  <small className="opacity-70">
                    Good! There are no meeting in current.
                  </small>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
