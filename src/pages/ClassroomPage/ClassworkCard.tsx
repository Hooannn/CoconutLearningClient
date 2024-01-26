import ReactQuill from "react-quill";
import { Classwork, ClassworkCategory, ClassworkType } from "../../types";
import { Classroom } from "../../types/classroom";
import dayjs from "../../libs/dayjs";
import FileCard from "../../components/FileCard";
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { AiOutlineBook, AiOutlineFileText } from "react-icons/ai";
import { FaEllipsisVertical } from "react-icons/fa6";
import DeleteClassworkModal from "./DeleteClassworkModal";
import { useNavigate } from "react-router-dom";
import EditClassworkModal from "./EditClassworkModal";

export default function ClassworkCard(props: {
  classwork: Classwork;
  classroom: Classroom;
  isProvider: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div>
      {props.classwork.type === ClassworkType.EXAM && (
        <div className="opacity-60 pb-3">
          <small>Published {dayjs(props.classwork.created_at).fromNow()}</small>
        </div>
      )}

      <div className="flex items-center justify-between pb-3">
        <div>
          {props.classwork.description!.length > 0 && (
            <ReactQuill
              className="readonly"
              value={props.classwork.description}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "code-block",
                "list",
                "bullet",
                "indent",
                "link",
                "image",
              ]}
              readOnly={true}
              theme={"snow"}
              modules={{ toolbar: false }}
            ></ReactQuill>
          )}
        </div>
        {props.isProvider && props.classwork.type === ClassworkType.EXAM && (
          <div className="flex items-center">
            <div className="flex flex-col border-l-2 border-gray px-3 w-28">
              <div className="text-4xl">
                {props.classwork.assignments?.filter((a) => a.submitted)
                  .length || 0}
              </div>
              <small className="opacity-60 text-xs">Submitted</small>
            </div>
            <div className="flex flex-col border-l-2 border-gray px-3 w-28">
              <div className="text-4xl">{props.classwork.assignees.length}</div>
              <small className="opacity-60 text-xs">Assigned</small>
            </div>
          </div>
        )}
      </div>

      {props.classwork.files.length > 0 && (
        <div className="w-full flex items-center flex-wrap gap-4 mt-3">
          {props.classwork.files.map((file, index) => (
            <FileCard
              showCloseButton={false}
              file={file}
              isSelected={false}
              key={file.id + index}
            />
          ))}
        </div>
      )}
      <Divider />
      <div className="pt-2">
        <Button
          onClick={() => {
            navigate(
              `/classroom/${props.classroom.id}/classwork/${props.classwork.id}`
            );
          }}
          color="primary"
          variant="light"
        >
          See details
        </Button>
      </div>
    </div>
  );
}

export function ClassworkCardTitle(props: {
  classwork: Classwork;
  classroom: Classroom;
  isProvider: boolean;
  classworkCategories: ClassworkCategory[];
}) {
  const {
    isOpen: isDeleteClassworkModalOpen,
    onOpen: onOpenDeleteClassworkModal,
    onClose: onDeleteClassworkModalClose,
  } = useDisclosure();

  const {
    isOpen: isUpdateClassworkModalOpen,
    onOpen: onOpenUpdateClassworkModal,
    onClose: onUpdateClassworkModalClose,
  } = useDisclosure();
  return (
    <div className="flex items-center justify-between text-small">
      {props.isProvider && (
        <>
          <DeleteClassworkModal
            isOpen={isDeleteClassworkModalOpen}
            onClose={onDeleteClassworkModalClose}
            classroom={props.classroom}
            classwork={props.classwork}
          />
          <EditClassworkModal
            isOpen={isUpdateClassworkModalOpen}
            onClose={onUpdateClassworkModalClose}
            classroom={props.classroom}
            classwork={props.classwork}
            classworkCategories={props.classworkCategories}
          />
        </>
      )}
      <div className="flex items-center gap-2">
        <Button
          isIconOnly
          className="opacity-100"
          color="primary"
          size="sm"
          isDisabled
          radius="full"
        >
          {props.classwork.type === ClassworkType.EXAM ? (
            <AiOutlineFileText size={18} />
          ) : (
            <AiOutlineBook size={18} />
          )}
        </Button>
        <div>{props.classwork.title}</div>
      </div>
      <div className="flex items-center gap-2">
        <small className="opacity-60">
          {props.classwork.type === ClassworkType.EXAM ? (
            <>
              {props.classwork.deadline
                ? dayjs(props.classwork.deadline).isBefore(dayjs())
                  ? "Deadline has passed"
                  : dayjs(props.classwork.deadline).fromNow()
                : "No deadline"}
            </>
          ) : (
            <>{dayjs(props.classwork.created_at).fromNow()}</>
          )}
        </small>
        {props.isProvider && (
          <Dropdown placement="left-end">
            <DropdownTrigger>
              <Button radius="full" isIconOnly variant="light">
                <FaEllipsisVertical size={14} className="opacity-70" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Post action" variant="flat">
              <DropdownItem
                onClick={onOpenUpdateClassworkModal}
                className="py-2"
                key="edit_classwork"
              >
                Edit
              </DropdownItem>
              <DropdownItem
                color="danger"
                className="py-2"
                key="delete_classwork"
                onClick={onOpenDeleteClassworkModal}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    </div>
  );
}
