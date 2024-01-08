import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Skeleton,
  User,
} from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData, IUser } from "../../types";
import { useDebounce } from "@uidotdev/usehooks";
import SVG2 from "../../components/SVG2";
import {
  AiFillCheckCircle,
  AiOutlineClose,
  AiOutlineUser,
} from "react-icons/ai";
import toast from "react-hot-toast";
import { onError } from "../../utils/error-handlers";
import { Classroom } from "../../types/classroom";
export enum InviteType {
  PROVIDER = "PROVIDER",
  USER = "USER",
}
let typingTimeout: NodeJS.Timeout | null = null;
export default function InviteModal(props: {
  isOpen: boolean;
  onClose: () => void;
  type: InviteType;
  classroom: Classroom;
}) {
  const axios = useAxiosIns();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const isSearching = query && query.trim().length > 0;

  const lookupUsersQuery = useQuery({
    queryKey: ["lookupUsers", debouncedQuery],
    queryFn: () => {
      if (isSearching)
        return axios.get<IResponseData<IUser[]>>(
          `/api/v1/search/users/lookup`,
          {
            params: { q: debouncedQuery },
          }
        );
      return null;
    },
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (
        data?.data?.data.length == 0 &&
        debouncedQuery.match("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}")
      ) {
        data.data.data = [
          { id: debouncedQuery, email: debouncedQuery } as never,
        ];
      } else if (data?.data.data.length) {
        data.data.data = data.data.data.filter(
          (u) =>
            !props.classroom.invitations.map((i) => i.email).includes(u.email)
        );
      }
    },
  });

  const inviteMutation = useMutation({
    mutationFn: (params: {
      emails: string[];
      class_id: string;
      type: InviteType;
    }) =>
      axios.post<IResponseData<unknown>>(
        `/api/v1/classrooms/invite/many`,
        params
      ),
    onSuccess: (data) => {
      toast.success(data.data?.message || "Invited successfully");
      queryClient.invalidateQueries(["fetch/classroom/id", props.classroom.id]);
      props.onClose();
    },
    onError,
  });

  const onSearchInputChange = (v: string) => {
    setQuery(v);
    setIsTyping(true);
    if (typingTimeout) clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 500);
  };

  const users = lookupUsersQuery.data?.data?.data || [];

  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);

  const isSelected = (userId: string) =>
    selectedUsers.some((u) => u.id === userId);

  const invite = () => {
    const emails = selectedUsers.map((u) => u.email);
    inviteMutation.mutate({
      emails,
      class_id: props.classroom.id,
      type: props.type,
    });
  };

  const topContent = useMemo(() => {
    if (!selectedUsers.length) {
      return null;
    }

    return (
      <div className="w-full flex flex-wrap gap-1 py-2">
        {selectedUsers.map((user) => (
          <div
            key={user.id}
            className="text-small flex items-center gap-1 bg-sky-100 rounded-full px-2 py-1"
          >
            <User
              name={
                user.first_name && user.last_name
                  ? user.first_name + " " + user.last_name
                  : user.email
              }
              avatarProps={{
                src: user.avatar_url,
                fallback: (
                  <AiOutlineUser
                    className="text-default-500"
                    fill="currentColor"
                    size={20}
                  />
                ),
                className: "w-7 h-7",
                showFallback: true,
              }}
            />
            <Button
              variant="light"
              size="sm"
              className="h-5"
              isIconOnly
              radius="full"
              onClick={() => {
                setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
              }}
            >
              <AiOutlineClose />
            </Button>
          </div>
        ))}
      </div>
    );
  }, [selectedUsers]);
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="pb-0">
              {props.type == InviteType.PROVIDER
                ? "Invite providers"
                : "Invite users"}
            </ModalHeader>
            <ModalBody className="pt-0 gap-0">
              <Input
                color="primary"
                variant="underlined"
                type="email"
                placeholder="Enter email or name"
                value={query}
                onValueChange={onSearchInputChange}
              />
              {topContent}
              {isTyping || lookupUsersQuery.isLoading ? (
                <div className="flex flex-col gap-2 py-2">
                  {Array(4)
                    .fill(null)
                    .map((_, a) => (
                      <Skeleton
                        key={"Skeletonss::" + a}
                        className="rounded-lg w-full"
                      >
                        <div className="w-full h-24 rounded-lg bg-default-300"></div>
                      </Skeleton>
                    ))}
                </div>
              ) : (
                <>
                  {users.length > 0 ? (
                    <>
                      <div className="flex flex-col items-start py-1 max-h-[300px] overflow-auto">
                        {users.map((user) => (
                          <div
                            onClick={() => {
                              if (isSelected(user.id)) {
                                setSelectedUsers((prev) => {
                                  const newState = prev.filter(
                                    (u) => u.id !== user.id
                                  );
                                  return newState;
                                });
                              } else {
                                setSelectedUsers((prev) => [...prev, user]);
                              }
                            }}
                            key={"uu::" + user.id}
                            className="w-full hover:bg-slate-200 rounded-lg transition cursor-pointer p-2 flex items-center justify-between"
                          >
                            <User
                              as="button"
                              avatarProps={{
                                src: user?.avatar_url,
                                fallback: (
                                  <AiOutlineUser
                                    className="text-default-500"
                                    fill="currentColor"
                                    size={20}
                                  />
                                ),
                                showFallback: true,
                              }}
                              className="transition-transform"
                              description={
                                user?.first_name && user?.last_name
                                  ? user?.email
                                  : null
                              }
                              name={
                                user?.first_name && user?.last_name
                                  ? user?.first_name + " " + user?.last_name
                                  : user.email
                              }
                            />
                            {isSelected(user.id) && (
                              <AiFillCheckCircle
                                className="text-green-500"
                                size={20}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {isSearching ? (
                        <div className="flex flex-col items-center py-12">
                          <div className="w-40 py-4">
                            <SVG2 />
                          </div>
                          <small>Not found.</small>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-12">
                          <div className="w-40 py-4">
                            <SVG2 />
                          </div>
                          <small>
                            {props.type == InviteType.PROVIDER
                              ? "Start inviting provider"
                              : "Start inviting students"}
                          </small>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={inviteMutation.isLoading}
                color="danger"
                variant="light"
                onPress={onClose}
              >
                Close
              </Button>
              <Button
                isLoading={inviteMutation.isLoading}
                onClick={invite}
                color="primary"
              >
                Invite
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
