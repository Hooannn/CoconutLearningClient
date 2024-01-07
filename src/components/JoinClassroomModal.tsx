import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Divider,
  Card,
  CardBody,
  User,
  Input,
  Link,
} from "@nextui-org/react";
import { AiOutlineClose, AiOutlineUser } from "react-icons/ai";
import useAuthStore from "../stores/auth";
import useAuth from "../services/auth";
import { useState } from "react";
import { FaCircle } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onError } from "../utils/error-handlers";
import useAxiosIns from "../hooks/useAxiosIns";
import { IResponseData } from "../types";
import { Classroom } from "../types/classroom";
import toast from "react-hot-toast";

export default function JoinClassroomModal(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const axios = useAxiosIns();
  const { user } = useAuthStore();
  const { signOutMutation } = useAuth();
  const [code, setCode] = useState<string>("");

  const joinClassroomMutation = useMutation({
    mutationFn: (params: { code: string }) =>
      axios.post<IResponseData<Classroom>>(
        `/api/v1/classrooms/join/${params.code}`
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Joined classroom successfully");
      queryClient.invalidateQueries(["fetch/classrooms/teaching"]);
      queryClient.invalidateQueries(["fetch/classrooms/registered"]);
    },
  });

  const join = async () => {
    await joinClassroomMutation.mutateAsync({ code });
    props.onClose();
  };

  const signOut = async () => {
    signOutMutation.mutate();
  };
  return (
    <Modal
      hideCloseButton
      size="full"
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex py-2 items-center justify-between text-2xl">
              <div className="flex gap-2 items-center">
                <Button
                  isLoading={joinClassroomMutation.isLoading}
                  isIconOnly
                  onClick={onClose}
                >
                  <AiOutlineClose />
                </Button>
                <div>Join classroom</div>
              </div>

              <Button
                onClick={() => join()}
                isLoading={joinClassroomMutation.isLoading}
                isDisabled={code.length == 0 || code.trim().length == 0}
                color="primary"
                size="lg"
                className="px-10"
              >
                Join
              </Button>
            </ModalHeader>
            <Divider />
            <ModalBody className="flex items-center">
              <Card shadow="sm" radius="sm" className="w-[400px] px-2">
                <CardBody className="items-start">
                  <div className="text-muted-foreground text-gray-700 font-thin py-2 text-small">
                    You are signed in as
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <User
                      name={user?.first_name + " " + user?.last_name}
                      description={user?.role}
                      avatarProps={{
                        src: user?.avatar_url,
                        fallback: (
                          <AiOutlineUser
                            className="w-6 h-6 text-default-500"
                            fill="currentColor"
                            size={20}
                          />
                        ),
                        showFallback: true,
                        className: "w-12 h-12",
                      }}
                    />

                    <Button
                      onClick={() => signOut()}
                      isLoading={signOutMutation.isLoading}
                      color="primary"
                      variant="flat"
                    >
                      Change account
                    </Button>
                  </div>
                </CardBody>
              </Card>
              <Card shadow="sm" radius="sm" className="w-[400px] px-2">
                <CardBody className="items-start">
                  <div className="py-2">Invite code</div>
                  <Input
                    value={code}
                    onValueChange={(v) => setCode(v)}
                    variant="bordered"
                    color="primary"
                    size={"md"}
                    label="Code"
                  />
                </CardBody>
              </Card>
              <div className="w-[400px] px-2 flex flex-col gap-2">
                <div>How to log in with class code</div>
                <div className="flex gap-2 items-center text-small">
                  <FaCircle className="w-[5px] h-[5px] text-black" />
                  Use used account is allowed
                </div>
                <div className="flex gap-2 items-center text-small">
                  <FaCircle className="w-[5px] h-[5px] text-black" />
                  Use a class code that is 5-7 letters or numbers, with no
                  spaces or symbols
                </div>
                <span>
                  If you're having trouble joining a class, go to the{" "}
                  <span className="cursor-pointer">
                    <Link underline="hover">Help Center article</Link>
                  </span>
                </span>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
