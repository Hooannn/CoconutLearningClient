import {
  Avatar,
  Button,
  Card,
  CardBody,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { Comment, IResponseData, Post } from "../../types";
import { MdOutlinePeopleAlt } from "react-icons/md";
import useAuthStore from "../../stores/auth";
import { AiOutlineUser, AiOutlineSend } from "react-icons/ai";
import dayjs from "../../libs/dayjs";
import { FaEllipsisVertical } from "react-icons/fa6";
import ReactQuill from "react-quill";
import { useMemo, useRef, useState } from "react";
import { formats, modules } from "../../configs/quill";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { onError } from "../../utils/error-handlers";
import { Classroom } from "../../types/classroom";
import toast from "react-hot-toast";
import CommentCard from "./CommentCard";
import FileCard from "../../components/FileCard";
import EditPost from "./EditPost";
export default function PostCard(props: { post: Post; classroom: Classroom }) {
  const { user } = useAuthStore();
  const author = props.post.author;
  const isOwner = author.id === user?.id;
  const axios = useAxiosIns();
  const queryClient = useQueryClient();
  const quillRef = useRef<ReactQuill>(null);

  const [isCommenting, setIsCommenting] = useState(false);
  const [body, setBody] = useState("");

  const bodyInnerTextLength = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const innerText = (quillRef?.current?.editingArea as any)?.innerText;
    const replaceBreak = (innerText as string)?.replace("\n", "");
    const length = replaceBreak?.trim().length;
    return length;
  }, [body]);

  const onInputFocus = () => {
    setIsCommenting(true);
    setTimeout(() => {
      quillRef.current?.focus();
    }, 100);
  };

  const commentMutation = useMutation({
    mutationFn: (params: {
      body: string;
      classroom_id: string;
      post_id: string;
    }) => axios.post<IResponseData<Comment>>(`/api/v1/comments`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Commented successfully");
      queryClient.invalidateQueries([
        "fetch/posts/classroom",
        props.classroom.id,
      ]);
    },
  });

  const comment = async () => {
    await commentMutation.mutateAsync({
      body,
      classroom_id: props.classroom.id,
      post_id: props.post.id,
    });
    setBody("");
    setIsCommenting(false);
  };

  const deletePostMutation = useMutation({
    mutationFn: () =>
      axios.delete<IResponseData<unknown>>(
        `/api/v1/posts/${props.classroom.id}/${props.post.id}`
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

  const {
    onOpen: onOpenEditPost,
    isOpen: isEditPostOpen,
    onClose: onEditPostClose,
  } = useDisclosure();

  return (
    <>
      <EditPost
        classroom={props.classroom}
        post={props.post}
        isOpen={isEditPostOpen}
        onClose={onEditPostClose}
      />
      <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this post.</p>
                <p>
                  <strong>This action cannot be undone.</strong>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={deletePostMutation.isLoading}
                  color="primary"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={deletePostMutation.isLoading}
                  color="danger"
                  onPress={() => {
                    deletePostMutation.mutate();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Card shadow="sm">
        <CardBody className="items-start">
          <div className="flex items-center justify-between w-full">
            <User
              name={author?.first_name + " " + author?.last_name}
              description={dayjs(props.post.created_at).fromNow()}
              avatarProps={{
                src: author?.avatar_url,
                fallback: (
                  <AiOutlineUser
                    className="w-6 h-6 text-default-500"
                    fill="currentColor"
                    size={20}
                  />
                ),
                showFallback: true,
              }}
            />
            {isOwner && (
              <Dropdown placement="left-end">
                <DropdownTrigger>
                  <Button radius="full" isIconOnly variant="light">
                    <FaEllipsisVertical size={16} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Post action" variant="flat">
                  <DropdownItem
                    onClick={onOpenEditPost}
                    className="py-2"
                    key="edit_post"
                  >
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
          <div className="w-full p-2">
            <ReactQuill
              className="readonly"
              value={props.post.body}
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
            {props.post.files.length > 0 && (
              <div className="flex items-center w-full flex-wrap gap-4 mt-3">
                {props.post.files.map((file) => (
                  <FileCard
                    isSelected={false}
                    onClick={(file) => {
                      const fileHost = import.meta.env.VITE_FILE_HOST;
                      const fileUrl = `${fileHost}/${file.id}`;
                      window.open(fileUrl, "_blank");
                    }}
                    key={file.id}
                    file={file}
                    showCloseButton={false}
                  />
                ))}
              </div>
            )}
          </div>

          <Divider className="mt-2" />

          <div className="w-full">
            {props.post.comments.length > 0 && (
              <>
                <div className="flex items-center gap-2 text-small pt-3 px-2">
                  <MdOutlinePeopleAlt size={20} />
                  {props.post.comments.length == 1
                    ? `${props.post.comments.length} comment`
                    : `${props.post.comments.length} comments`}{" "}
                  about the class
                </div>
                {props.post.comments.map((comment) => (
                  <div key={comment.id} className="w-full pt-3">
                    <CommentCard
                      comment={comment}
                      classroom={props.classroom}
                    />
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="flex items-center justify-between w-full pt-3">
            <div>
              <Avatar
                src={user?.avatar_url}
                fallback={
                  <AiOutlineUser
                    className="w-6 h-6 text-default-500"
                    fill="currentColor"
                    size={20}
                  />
                }
                showFallback
                className="w-10 h-10"
              ></Avatar>
            </div>
            {isCommenting ? (
              <div className="w-5/6">
                <ReactQuill
                  ref={quillRef}
                  className={`comment transition`}
                  placeholder="Add comment to class..."
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  onBlur={() => {
                    setIsCommenting(false);
                  }}
                  value={body}
                  onChange={(e) => {
                    setBody(e);
                  }}
                />
              </div>
            ) : (
              <Input
                onFocus={onInputFocus}
                radius="full"
                placeholder="Add comment to class..."
                size="sm"
                variant="bordered"
                className="w-5/6"
                color="primary"
              />
            )}

            <Button
              isLoading={commentMutation.isLoading}
              isDisabled={bodyInnerTextLength === 0}
              isIconOnly
              radius="full"
              color="primary"
              variant="light"
              onClick={comment}
            >
              <AiOutlineSend size={24} />
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
