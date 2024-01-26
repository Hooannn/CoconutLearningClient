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
  Skeleton,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import {
  AiOutlineFileText,
  AiOutlinePlus,
  AiOutlineSend,
  AiOutlineUser,
} from "react-icons/ai";
import { Classroom } from "../../types/classroom";
import {
  Assignment,
  Classwork,
  ClassworkCategory,
  File,
  IResponseData,
} from "../../types";
import { FaEllipsisVertical } from "react-icons/fa6";
import dayjs from "../../libs/dayjs";
import { FaCircle } from "react-icons/fa";
import ReactQuill from "react-quill";
import { MdOutlinePeopleAlt } from "react-icons/md";
import CommentCard from "../ClassroomPage/CommentCard";
import { modules, formats } from "../../configs/quill";
import useAuthStore from "../../stores/auth";
import { useRef, useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import FileCard from "../../components/FileCard";
import UserFolder from "../../components/UserFolder";
import DeleteClassworkModal from "../ClassroomPage/DeleteClassworkModal";
import EditClassworkModal from "../ClassroomPage/EditClassworkModal";

export default function DetailsTab(props: {
  classroom: Classroom;
  classwork: Classwork;
  isProvider: boolean;
  classworkCategories?: ClassworkCategory[];
}) {
  const { user } = useAuthStore();
  const quillRef = useRef<ReactQuill>(null);
  const axios = useAxiosIns();

  const [isCommenting, setIsCommenting] = useState(false);
  const [body, setBody] = useState("");
  const [description, setDescription] = useState("");

  const bodyInnerTextLength = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const innerText = (quillRef?.current?.editingArea as any)?.innerText;
    const replaceBreak = (innerText as string)?.replace("\n", "");
    const length = replaceBreak?.trim().length;
    return length;
  }, [body]);

  const queryClient = useQueryClient();

  const onInputFocus = () => {
    setIsCommenting(true);
    setTimeout(() => {
      quillRef.current?.focus();
    }, 100);
  };

  const submitMutation = useMutation({
    mutationFn: (params: {
      description?: string;
      submitted: boolean;
      file_ids: string[];
      classwork_id: string;
      classroom_id: string;
    }) => axios.post<IResponseData<Assignment>>(`/api/v1/assignments`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Created successfully");
      queryClient.invalidateQueries([
        "fetch/assignment",
        props.classroom.id,
        props.classwork.id,
        user?.id,
      ]);
    },
  });

  const changeStatusToUnsubmittedMutation = useMutation({
    mutationFn: () =>
      axios.put<IResponseData<unknown>>(
        `/api/v1/assignments/${props.classroom.id}/${props.classwork.id}/mark/unsubmitted`
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Updated successfully");
      queryClient.invalidateQueries([
        "fetch/assignment",
        props.classroom.id,
        props.classwork.id,
        user?.id,
      ]);
    },
  });

  const commentMutation = useMutation({
    mutationFn: (params: {
      body: string;
      classroom_id: string;
      classwork_id: string;
    }) =>
      axios.post<IResponseData<Comment>>(`/api/v1/comments/classwork`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Commented successfully");
      queryClient.invalidateQueries([
        "fetch/classwork/details",
        props.classroom.id,
        props.classwork.id,
      ]);
    },
  });

  const getAssignmentQuery = useQuery({
    queryKey: [
      "fetch/assignment",
      props.classroom.id,
      props.classwork.id,
      user?.id,
    ],
    queryFn: () =>
      axios.get<IResponseData<Assignment>>(
        `/api/v1/assignments/${props.classroom.id}/${props.classwork.id}/${user?.id}`
      ),
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: !props.isProvider,
    onSuccess(data) {
      setSelectedFiles(data.data?.data?.files || []);
      setDescription(data.data?.data?.description || "");
    },
  });

  const assignment = getAssignmentQuery.data?.data?.data || undefined;

  const isGraded = assignment?.grade !== null;

  const {
    onOpen: onOpenFolder,
    isOpen: isFolderOpen,
    onClose: onFolderClose,
  } = useDisclosure();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onFilesSelected = (files: File[]) => {
    const newFiles = [...selectedFiles, ...files];
    const _files: File[] = [];

    newFiles.forEach((file) => {
      if (!_files.some((f) => f.id === file.id)) _files.push(file);
    });

    setSelectedFiles(_files);
  };

  const comment = async () => {
    await commentMutation.mutateAsync({
      body,
      classroom_id: props.classroom.id,
      classwork_id: props.classwork.id,
    });
    setBody("");
    setIsCommenting(false);
  };

  const cancel = async () => {
    await changeStatusToUnsubmittedMutation.mutateAsync();
  };

  const submit = async () => {
    await submitMutation.mutateAsync({
      classroom_id: props.classroom.id,
      classwork_id: props.classwork.id,
      file_ids: selectedFiles.map((file) => file.id) || [],
      submitted: true,
      description,
    });
  };

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
    <>
      <UserFolder
        onSelect={onFilesSelected}
        isOpen={isFolderOpen}
        onClose={onFolderClose}
      />
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
            classworkCategories={props.classworkCategories || []}
          />
        </>
      )}
      <div className="flex flex-col gap-4 items-start max-w-[980px] mx-auto h-full">
        <div className="flex gap-4 w-full">
          <div>
            <Button
              isIconOnly
              className="opacity-100"
              color="primary"
              isDisabled
              radius="full"
            >
              <AiOutlineFileText size={24} />
            </Button>
          </div>
          <div className="flex flex-col w-full gap-1">
            <div className="flex items-center justify-between">
              <div className="text-primary text-3xl">
                {props.classwork.title}
              </div>
              {props.isProvider && (
                <Dropdown placement="left-end">
                  <DropdownTrigger>
                    <Button radius="full" isIconOnly variant="light">
                      <FaEllipsisVertical size={18} className="opacity-70" />
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
            <div className="flex items-center gap-2 text-sm opacity-60">
              <div>
                {props.classwork.author.first_name +
                  " " +
                  props.classwork.author.last_name}
              </div>
              <div>
                <FaCircle size={4} />
              </div>
              <div>{dayjs(props.classwork.created_at).fromNow()}</div>
            </div>

            {props.classwork.score > 0 && (
              <div>{props.classwork.score} scores</div>
            )}

            <Divider className="bg-primary my-3" />
            {(props.classwork.description?.length > 0 ||
              props.classwork.files.length > 0) && (
              <div>
                {props.classwork.description?.length > 0 && (
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
                <Divider className="mt-3" />
              </div>
            )}
            <div className="w-full">
              {props.classwork.comments?.length > 0 && (
                <>
                  <div className="flex items-center gap-2 text-small px-2 pt-3">
                    <MdOutlinePeopleAlt size={20} />
                    {props.classwork.comments?.length == 1
                      ? `${props.classwork.comments?.length} comment`
                      : `${props.classwork.comments?.length} comments`}{" "}
                    about the class
                  </div>
                  {props.classwork.comments?.map((comment) => (
                    <div key={comment.id} className="w-full pt-3">
                      <CommentCard
                        comment={comment}
                        classwork={props.classwork}
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
          </div>
          {!props.isProvider && props.classwork.score > 0 && (
            <>
              {getAssignmentQuery.isLoading ? (
                <div className="flex flex-col w-96 gap-2">
                  {Array(4)
                    .fill(null)
                    .map((_, i) => (
                      <Skeleton
                        key={"Skeleton::" + i}
                        className="rounded-lg w-full"
                      >
                        <div className="w-full h-24 rounded-lg bg-default-300"></div>
                      </Skeleton>
                    ))}
                </div>
              ) : (
                <>
                  <div className="w-96 flex flex-col gap-4">
                    {isGraded && assignment?.grade?.comment?.length > 0 && (
                      <Card shadow="sm" radius="sm">
                        <CardBody className="p-5">
                          <div className="text-sm flex items-center justify-between">
                            <div>Provider's comment</div>
                          </div>
                          <div className="flex flex-col gap-2 pt-2">
                            <div className="w-full flex items-center flex-col">
                              <Textarea
                                isReadOnly
                                value={assignment?.grade.comment}
                              />
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    )}
                    <Card shadow="sm" radius="sm">
                      <CardBody className="p-5">
                        <div className="text-sm flex items-center justify-between">
                          <div>Your assignment</div>
                          <div>
                            {assignment == undefined ? (
                              <>
                                {dayjs(props.classwork.deadline).isBefore(
                                  dayjs()
                                ) ? (
                                  <div className="opacity-60">
                                    Deadline has passed
                                  </div>
                                ) : (
                                  <div className="opacity-60">Unsubmitted</div>
                                )}
                              </>
                            ) : (
                              <>
                                {isGraded ? (
                                  <div className="text-green-700">
                                    {assignment.grade.grade}/
                                    {props.classwork.score}
                                  </div>
                                ) : (
                                  <>
                                    {assignment.submitted ? (
                                      <div className="text-green-600">
                                        Submitted
                                      </div>
                                    ) : (
                                      <>
                                        {dayjs(
                                          props.classwork.deadline
                                        ).isBefore(dayjs()) ? (
                                          <div className="opacity-60">
                                            Deadline has passed
                                          </div>
                                        ) : (
                                          <div className="opacity-60">
                                            Unsubmitted
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                          {assignment == undefined ? (
                            <>
                              <div className="w-full flex items-center flex-col">
                                <>
                                  {selectedFiles.length > 0 ? (
                                    <>
                                      {selectedFiles?.map((file: File) => (
                                        <FileCard
                                          showCloseButton
                                          onClose={(file) => {
                                            setSelectedFiles(
                                              selectedFiles.filter(
                                                (f) => f.id !== file.id
                                              )
                                            );
                                          }}
                                          file={file}
                                          isSelected={false}
                                        />
                                      ))}
                                    </>
                                  ) : (
                                    <div className="py-3 opacity-60 flex flex-col items-center">
                                      <div className="py-1">
                                        <AiOutlineFileText size={30} />
                                      </div>
                                      <div className="text-xs">
                                        No file presented.
                                      </div>
                                    </div>
                                  )}
                                </>
                              </div>
                              <Button
                                onClick={onOpenFolder}
                                isLoading={submitMutation.isLoading}
                                color="primary"
                                variant="flat"
                              >
                                <AiOutlinePlus />
                                Add or create
                              </Button>
                              <Button
                                isLoading={submitMutation.isLoading}
                                color="primary"
                                onClick={submit}
                              >
                                Submit
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="w-full flex items-center flex-col">
                                {selectedFiles.length > 0 ? (
                                  <>
                                    {selectedFiles?.map((file: File) => (
                                      <FileCard
                                        showCloseButton={!assignment.submitted}
                                        onClose={(file) => {
                                          setSelectedFiles(
                                            selectedFiles.filter(
                                              (f) => f.id !== file.id
                                            )
                                          );
                                        }}
                                        file={file}
                                        isSelected={false}
                                      />
                                    ))}
                                  </>
                                ) : (
                                  <div className="py-3 opacity-60 flex flex-col items-center">
                                    <div className="py-1">
                                      <AiOutlineFileText size={30} />
                                    </div>
                                    <div className="text-xs">
                                      No file presented.
                                    </div>
                                  </div>
                                )}
                              </div>
                              {assignment.submitted ? (
                                <Button
                                  onClick={cancel}
                                  color="primary"
                                  variant="flat"
                                  isDisabled={isGraded}
                                  isLoading={
                                    changeStatusToUnsubmittedMutation.isLoading
                                  }
                                >
                                  Cancel
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    onClick={onOpenFolder}
                                    isDisabled={isGraded}
                                    color="primary"
                                    variant="flat"
                                  >
                                    <AiOutlinePlus />
                                    Add or create
                                  </Button>
                                  <Button
                                    isLoading={submitMutation.isLoading}
                                    color="primary"
                                    onClick={submit}
                                    isDisabled={isGraded}
                                  >
                                    Submit
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </CardBody>
                    </Card>

                    <Card shadow="sm" radius="sm">
                      <CardBody className="p-5">
                        <div className="text-sm flex items-center justify-between">
                          <div>Description (optional)</div>
                        </div>
                        <Textarea
                          isDisabled={assignment?.submitted}
                          value={description}
                          onValueChange={(v) => setDescription(v)}
                          className="mt-2"
                          placeholder="Add some description for provider"
                        />
                      </CardBody>
                    </Card>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
