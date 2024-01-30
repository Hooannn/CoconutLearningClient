import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { Classroom, Meeting } from "../../types";
import dayjs from "../../libs/dayjs";
import { AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FaEllipsisVertical } from "react-icons/fa6";
import DeleteMeetingModal from "./DeleteMeetingModal";
import EditMeetingModal from "./EditMeetingModal";
export default function MeetingCard(props: {
  meeting: Meeting;
  classroom: Classroom;
  isOwner: boolean;
}) {
  const {
    isOpen: isDeleteMeetingModalOpen,
    onOpen: onOpenDeleteMeetingModal,
    onClose: onDeleteMeetingModalClose,
  } = useDisclosure();

  const {
    isOpen: isUpdateMeetingModalOpen,
    onOpen: onOpenUpdateMeetingModal,
    onClose: onUpdateMeetingModalClose,
  } = useDisclosure();
  const navigate = useNavigate();

  const isDoing =
    dayjs().isAfter(props.meeting.start_at) &&
    dayjs().isBefore(props.meeting.end_at);

  return (
    <>
      {props.isOwner && (
        <>
          <DeleteMeetingModal
            isOpen={isDeleteMeetingModalOpen}
            onClose={onDeleteMeetingModalClose}
            classroom={props.classroom}
            meeting={props.meeting}
          />
          <EditMeetingModal
            isOpen={isUpdateMeetingModalOpen}
            onClose={onUpdateMeetingModalClose}
            classroom={props.classroom}
            meeting={props.meeting}
          />
        </>
      )}
      <Card
        onClick={() => {
          navigate(
            `/classroom/${props.classroom.id}/meeting/${props.meeting.id}`
          );
        }}
        className={isDoing ? "bg-orange-100" : ""}
        isPressable
        shadow="sm"
        radius="sm"
      >
        <CardBody className="p-5">
          <div className="flex items-center justify-between w-full">
            <div>
              {isDoing && (
                <>
                  <div className="text-sm text-yellow-600 font-bold">
                    Meeting is in progress
                  </div>
                </>
              )}
              <div className="text-sm opacity-80">
                {dayjs(props.meeting.start_at).format("MMMM D, YYYY HH:mm")} -{" "}
                {dayjs(props.meeting.end_at).format("MMMM D, YYYY HH:mm")}
              </div>
              <div className="text-lg font-bold">{props.meeting.name}</div>
            </div>
            {props.isOwner && (
              <Dropdown placement="left-end">
                <DropdownTrigger>
                  <Button radius="full" isIconOnly variant="light">
                    <FaEllipsisVertical size={14} className="opacity-70" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Post action" variant="flat">
                  <DropdownItem
                    onClick={onOpenUpdateMeetingModal}
                    className="py-2"
                    key="edit_meeting"
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    onClick={onOpenDeleteMeetingModal}
                    color="danger"
                    className="py-2"
                    key="delete_meeting"
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
          <div className="mt-2">
            <User
              name={
                props.meeting.created_by?.first_name +
                " " +
                props.meeting.created_by?.last_name
              }
              avatarProps={{
                src: props.meeting.created_by?.avatar_url,
                fallback: (
                  <AiOutlineUser
                    className="w-6 h-6 text-default-500"
                    fill="currentColor"
                    size={20}
                  />
                ),
                showFallback: true,
                className: "w-10 h-10",
              }}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
}
