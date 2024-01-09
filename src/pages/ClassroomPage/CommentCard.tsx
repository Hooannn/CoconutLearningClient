import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Avatar,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { AiOutlineUser } from "react-icons/ai";
import { FaEllipsisVertical } from "react-icons/fa6";
import { Comment, IResponseData } from "../../types";
import dayjs from "../../libs/dayjs";
import useAuthStore from "../../stores/auth";
import ReactQuill from "react-quill";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { onError } from "../../utils/error-handlers";
import { Classroom } from "../../types/classroom";
import useAxiosIns from "../../hooks/useAxiosIns";

export default function CommentCard(props: {
  comment: Comment;
  classroom: Classroom;
}) {
  const axios = useAxiosIns();
  const { user } = useAuthStore();
  const author = props.comment.author;
  const isOwner = user?.id === author.id;
  const queryClient = useQueryClient();
  const deleteCommentMutation = useMutation({
    mutationFn: () =>
      axios.delete<IResponseData<unknown>>(
        `/api/v1/comments/${props.comment.id}`
      ),
    onError,
    onSuccess: (data) => {
      toast.success(data.data.message || "Deleted successfully");
      onDeleteModalClose();
      queryClient.invalidateQueries([
        "fetch/posts/classroom",
        props.classroom.id,
      ]);
    },
  });

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onOpenChange: onDeleteModalOpenChange,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  return (
    <>
      <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this comment.</p>
                <p>
                  <strong>This action cannot be undone.</strong>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={deleteCommentMutation.isLoading}
                  color="primary"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={deleteCommentMutation.isLoading}
                  color="danger"
                  onPress={() => {
                    deleteCommentMutation.mutate();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Avatar
            src={author?.avatar_url}
            showFallback
            fallback={
              <AiOutlineUser
                className="w-6 h-6 text-default-500"
                fill="currentColor"
                size={20}
              />
            }
          ></Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-small text-inherit w-full">
              <div>{author?.first_name + " " + author?.last_name}</div>{" "}
              <div className="text-tiny text-foreground-400">
                {dayjs(props.comment.created_at).fromNow()}
              </div>
            </div>
            <div className="text-wrap">
              <ReactQuill
                className="readonly"
                value={props.comment.body}
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
            </div>
          </div>
        </div>

        {isOwner && (
          <Dropdown placement="left-end">
            <DropdownTrigger>
              <Button radius="full" isIconOnly variant="light">
                <FaEllipsisVertical size={16} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Post action" variant="flat">
              <DropdownItem onClick={() => {}} className="py-2" key="edit_post">
                Edit
              </DropdownItem>
              <DropdownItem
                color="danger"
                onClick={onOpenDeleteModal}
                className="py-2"
                key="delete_post"
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    </>
  );
}
