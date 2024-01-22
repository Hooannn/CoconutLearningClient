import { Card, CardBody, User, useDisclosure } from "@nextui-org/react";
import { Assignment, Classwork } from "../../types";
import { AiOutlineFileText, AiOutlineUser } from "react-icons/ai";
import FileCard from "../../components/FileCard";
import AssignmentDetails from "./AssignmentDetails";
import { Classroom } from "../../types/classroom";

export default function AssignmentCard(props: {
  assignment: Assignment;
  classwork: Classwork;
  classroom: Classroom;
}) {
  const author = props.assignment.author;
  const file = props.assignment.files?.[0];

  const {
    isOpen: isDetailsModalOpen,
    onOpen: onOpenDetailsModal,
    onClose: onDetailsModalClose,
  } = useDisclosure();
  return (
    <>
      <AssignmentDetails
        classroom={props.classroom}
        assignment={props.assignment}
        classwork={props.classwork}
        onClose={onDetailsModalClose}
        isOpen={isDetailsModalOpen}
      />
      <div className="w-44 h-54">
        <Card
          onPress={onOpenDetailsModal}
          isPressable
          className="w-full h-full"
          shadow="sm"
          radius="sm"
        >
          <CardBody className="w-full h-full items-start overflow-hidden">
            <div className="w-full overflow-hidden">
              <User
                name={
                  <div className="truncate">
                    {author?.first_name + " " + author?.last_name}
                  </div>
                }
                avatarProps={{
                  src: author?.avatar_url,
                  fallback: (
                    <AiOutlineUser
                      className="w-2 h-2 text-default-500"
                      fill="currentColor"
                      size={20}
                    />
                  ),
                  showFallback: true,
                  className: "w-6 h-6",
                }}
              />
            </div>
            <div className="mx-auto">
              {file ? (
                <FileCard
                  file={file}
                  isSelected={false}
                  showCloseButton={false}
                />
              ) : (
                <div className="py-3 opacity-60 flex flex-col items-center">
                  <div className="py-1">
                    <AiOutlineFileText size={30} />
                  </div>
                  <div className="text-xs">No file presented.</div>
                </div>
              )}
            </div>
            <div>
              <small>{props.assignment.files?.length} files attached.</small>
            </div>
            <div>
              <>
                {props.assignment.submitted ? (
                  <div className="text-green-600">
                    <small>Submitted</small>
                  </div>
                ) : (
                  <div className="opacity-60">
                    <small>Unsubmitted</small>
                  </div>
                )}
              </>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
