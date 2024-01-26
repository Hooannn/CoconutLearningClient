import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Link,
  Skeleton,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { AiOutlineUpload } from "react-icons/ai";
import "react-quill/dist/quill.snow.css";
import { Classroom } from "../../types/classroom";
import toast from "react-hot-toast";
import { GrPowerReset } from "react-icons/gr";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { onError } from "../../utils/error-handlers";
import { Classwork, File, IResponseData, Post } from "../../types";
import useAuthStore from "../../stores/auth";
import { AiOutlineUser } from "react-icons/ai";
import SVG1 from "../../components/SVG1";
import { useRef, useState } from "react";
import ReactQuill from "react-quill";
import { formats, modules } from "../../configs/quill";
import PostCard from "./PostCard";
import UserFolder from "../../components/UserFolder";
import FileCard from "../../components/FileCard";
import dayjs from "../../libs/dayjs";
import { useNavigate } from "react-router-dom";

export default function FeedTab(props: {
  classroom: Classroom;
  isOwner: boolean;
  isProvider: boolean;
}) {
  const axios = useAxiosIns();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const resetInviteCodeMutation = useMutation({
    mutationFn: () =>
      axios.post<IResponseData<unknown>>(
        `/api/v1/classrooms/${props.classroom.id}/class_code/reset`
      ),
    onSuccess: (data) => {
      toast.success(data.data.message || "Reset successfully");
      queryClient.invalidateQueries(["fetch/classroom/id", props.classroom.id]);
    },
    onError,
  });

  const [isPosting, setIsPosting] = useState(false);
  const [body, setBody] = useState("");

  const getPostsQuery = useQuery({
    queryKey: ["fetch/posts/classroom", props.classroom.id],
    queryFn: () =>
      axios.get<IResponseData<Post[]>>(`/api/v1/posts/${props.classroom.id}`),
    refetchOnWindowFocus: false,
  });

  const getUpcomingClassworkQuery = useQuery({
    queryKey: ["fetch/upcoming/classworks", props.classroom.id],
    queryFn: () =>
      axios.get<IResponseData<Classwork[]>>(
        `/api/v1/classwork/${props.classroom.id}/upcoming/${
          props.isProvider ? "provider" : "student"
        }`
      ),
    refetchOnWindowFocus: false,
  });

  const upcomingClassworks = getUpcomingClassworkQuery.data?.data?.data || [];
  const posts = getPostsQuery.data?.data?.data || [];

  const quillRef = useRef<ReactQuill>(null);

  const postMutation = useMutation({
    mutationFn: (params: {
      classroom_id: string;
      body: string;
      file_ids: string[];
    }) => axios.post<IResponseData<Post>>(`/api/v1/posts`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Posted successfully");
      queryClient.invalidateQueries([
        "fetch/posts/classroom",
        props.classroom.id,
      ]);
    },
  });

  const cancelPost = () => {
    setBody("");
    setIsPosting(false);
    setSelectedFiles([]);
  };

  const post = async () => {
    await postMutation.mutateAsync({
      classroom_id: props.classroom.id,
      body,
      file_ids: selectedFiles.length
        ? selectedFiles.map((file) => file.id)
        : [],
    });
    cancelPost();
  };

  const navigate = useNavigate();

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

  return (
    <>
      <UserFolder
        onSelect={onFilesSelected}
        isOpen={isFolderOpen}
        onClose={onFolderClose}
      />
      <div className="flex flex-col gap-4 items-center max-w-[980px] mx-auto">
        <Card className="w-full h-[250px]" shadow="sm">
          <CardHeader className="absolute z-10 top-1 flex-col items-start justify-end h-full p-5">
            <p className="text-small text-white/80 font-bold">
              {props.classroom.description}
            </p>
            <h4 className="text-white font-medium text-2xl">
              {props.classroom.name}
            </h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Card background"
            className="z-0 w-full h-full object-cover"
            src={props.classroom.coverImageUrl}
          />
        </Card>
        <div className="flex gap-4 w-full">
          <div className="flex flex-col gap-4 w-1/4">
            {props.isOwner && (
              <Card shadow="sm">
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div className="text-small font-semibold">Invite code</div>
                    <Tooltip content="Reset invite code">
                      <Button
                        isLoading={resetInviteCodeMutation.isLoading}
                        onClick={() => {
                          resetInviteCodeMutation.mutate();
                        }}
                        radius="full"
                        variant="light"
                        isIconOnly
                        size="sm"
                      >
                        <GrPowerReset size={14} />
                      </Button>
                    </Tooltip>
                  </div>

                  <Link
                    onClick={() => {
                      navigator.clipboard
                        .writeText(props.classroom.inviteCode)
                        .then(() => {
                          toast.success("Copied invite code");
                        })
                        .catch((err) => {
                          toast.error(
                            "Error while copying invite code " + err?.message
                          );
                        });
                    }}
                    className="cursor-pointer"
                    size="lg"
                  >
                    <span className="text-xl font-bolder">
                      {props.classroom.inviteCode}
                    </span>
                  </Link>
                </CardBody>
              </Card>
            )}
            <Card shadow="sm">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="text-small font-semibold">Upcoming</div>
                </div>
                {getUpcomingClassworkQuery.isLoading ? (
                  <div className="flex flex-col gap-2 py-2">
                    {Array(3)
                      .fill(null)
                      .map((_, i) => (
                        <Skeleton
                          key={"Skeleton::sss" + i}
                          className="rounded-lg w-full"
                        >
                          <div className="w-full h-12 rounded-lg bg-default-300"></div>
                        </Skeleton>
                      ))}
                  </div>
                ) : (
                  <>
                    {upcomingClassworks.length > 0 ? (
                      <div className="flex flex-col gap-2 py-2">
                        {upcomingClassworks.map((classwork) => (
                          <Card
                            onPress={() => {
                              if (props.isProvider)
                                navigate(
                                  `/classroom/${props.classroom.id}/classwork/${classwork.id}?tab=student_assignments`
                                );
                              else
                                navigate(
                                  `/classroom/${props.classroom.id}/classwork/${classwork.id}`
                                );
                            }}
                            isPressable
                            shadow="sm"
                            radius="sm"
                            key={classwork.id}
                          >
                            <CardBody>
                              <small className="text-xs">
                                Due {dayjs(classwork.deadline).fromNow()}
                              </small>
                              <span className="truncate text-sm">
                                {classwork.title}
                              </span>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <small className="my-2">
                        There are no assignments due
                      </small>
                    )}
                  </>
                )}

                <Button
                  onClick={() => {
                    navigate(`/classroom/${props.classroom.id}?tab=classwork`);
                  }}
                  size="sm"
                  color="primary"
                  variant="light"
                >
                  <strong>See all</strong>
                </Button>
              </CardBody>
            </Card>
          </div>
          <div className="flex flex-col gap-4 w-3/4">
            {isPosting ? (
              <Card shadow="sm">
                <CardBody>
                  <div className="p-3">
                    <ReactQuill
                      ref={quillRef}
                      placeholder="Announce something to this classroom."
                      theme="snow"
                      modules={modules}
                      formats={formats}
                      value={body}
                      onChange={(e) => {
                        setBody(e);
                      }}
                    />
                    {selectedFiles.length > 0 && (
                      <div className="w-full flex items-center flex-wrap gap-4 mt-3">
                        {selectedFiles.map((file, index) => (
                          <FileCard
                            showCloseButton
                            onClose={(file) => {
                              const newFiles = selectedFiles.filter(
                                (f) => f.id !== file.id
                              );
                              setSelectedFiles(newFiles);
                            }}
                            file={file}
                            isSelected={false}
                            key={file.id + index}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-3">
                    <Tooltip content="Upload files">
                      <Button
                        isIconOnly
                        className="w-10 h-10"
                        radius="full"
                        color="primary"
                        variant="flat"
                        onClick={onOpenFolder}
                      >
                        <AiOutlineUpload size={24} />
                      </Button>
                    </Tooltip>

                    <div className="flex items-center gap-1">
                      <Button
                        isLoading={postMutation.isLoading}
                        variant="light"
                        onClick={cancelPost}
                      >
                        Cancel
                      </Button>
                      <Button
                        isLoading={postMutation.isLoading}
                        onClick={post}
                        color="primary"
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <Card
                shadow="sm"
                isPressable
                onPress={() => {
                  setIsPosting(true);
                  setTimeout(() => {
                    quillRef.current?.focus();
                  }, 100);
                }}
              >
                <CardBody>
                  <div className="px-2 flex gap-4 items-center">
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
                    ></Avatar>
                    <div className="text-small hover:text-primary text-gray-500 transition">
                      Announce something to your class
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
            {getPostsQuery.isLoading ? (
              <div className="flex flex-col gap-4">
                {Array(3)
                  .fill(null)
                  .map((_, i) => (
                    <Skeleton
                      key={"Skeleton:ss:" + i}
                      className="rounded-lg w-full"
                    >
                      <div className="w-full h-24 rounded-lg bg-default-300"></div>
                    </Skeleton>
                  ))}
              </div>
            ) : (
              <>
                {posts.length > 0 ? (
                  <>
                    {posts.map((post) => (
                      <PostCard
                        post={post}
                        key={post.id}
                        classroom={props.classroom}
                      />
                    ))}
                  </>
                ) : (
                  <Card shadow="sm">
                    <CardBody>
                      <div className="flex gap-4 items-center p-4">
                        <div className="w-60">
                          <SVG1 />
                        </div>
                        <div>
                          <h3 className="text-lg text-primary font-bold">
                            {props.isProvider
                              ? "This is where you communicate with your class"
                              : "This is where you can see updates about this class"}
                          </h3>
                          <div className="text-sm">
                            {props.isProvider
                              ? "Use the feed to make announcements, post assignments, and answer student questions"
                              : "Use the feed to interact with people in the classroom and check for announcements"}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
