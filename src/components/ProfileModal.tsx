import {
  Modal,
  ModalContent,
  ModalHeader,
  Button,
  Divider,
  ModalBody,
  Tab,
  Tabs,
  Card,
  CardBody,
  Avatar,
  Input,
  useDisclosure,
  user,
} from "@nextui-org/react";
import {
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineProfile,
  AiOutlineUser,
} from "react-icons/ai";
import { MdOutlinePassword } from "react-icons/md";
import useAuthStore from "../stores/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAxiosIns from "../hooks/useAxiosIns";
import { IResponseData, IUser } from "../types";
import { onError } from "../utils/error-handlers";
import toast from "react-hot-toast";
import UserFolder from "./UserFolder";
import { useState } from "react";

export default function ProfileModal(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
                <Button isLoading={false} isIconOnly onClick={onClose}>
                  <AiOutlineClose />
                </Button>
                <div>Profile</div>
              </div>
            </ModalHeader>
            <Divider />
            <ModalBody className="flex items-center">
              <div className="flex w-full flex-col">
                <Tabs aria-label="Options" color="primary" variant="underlined">
                  <Tab
                    key="profile"
                    title={
                      <div className="flex items-center space-x-2">
                        <AiOutlineProfile />
                        <span>Profile</span>
                      </div>
                    }
                  >
                    <div className="w-full pt-4">
                      <UpdateProfileTab />
                    </div>
                  </Tab>
                  <Tab
                    key="change-password"
                    title={
                      <div className="flex items-center space-x-2">
                        <MdOutlinePassword />
                        <span>Change password</span>
                      </div>
                    }
                  >
                    <UpdatePasswordTab />
                  </Tab>
                </Tabs>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

type UpdateProfileInputs = {
  firstName: string;
  lastName: string;
};

export function UpdateProfileTab() {
  const { user, setUser } = useAuthStore();
  const [currentAvatar, setCurrentAvatar] = useState(user?.avatar_url);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInputs>();
  const axios = useAxiosIns();

  const updateProfileMutation = useMutation({
    mutationFn: (params: {
      first_name?: string;
      last_name?: string;
      avatar_url?: string;
    }) => axios.put<IResponseData<IUser>>(`/api/v1/profile`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Updated");
      const user = data.data?.data;
      if (user) {
        setUser(user);
      }
    },
  });

  const {
    onOpen: onOpenFolder,
    isOpen: isFolderOpen,
    onClose: onFolderClose,
  } = useDisclosure();

  const onSubmit: SubmitHandler<UpdateProfileInputs> = async (data) => {
    const params = {
      first_name: data.firstName,
      last_name: data.lastName,
      avatar_url: currentAvatar,
    };
    if (
      currentAvatar === null ||
      currentAvatar === undefined ||
      currentAvatar.length === 0
    )
      delete params.avatar_url;
    await updateProfileMutation.mutateAsync(params);
  };

  return (
    <>
      <UserFolder
        onSelect={(files) => {
          const file = files[0];
          const fileHost = import.meta.env.VITE_FILE_HOST;
          const fileUrl = `${fileHost}/${file.id}`;
          setCurrentAvatar(fileUrl);
        }}
        isOpen={isFolderOpen}
        filter={["image"]}
        multipleSelect={false}
        onClose={onFolderClose}
      />
      <Card shadow="sm" radius="sm">
        <CardBody className="items-center">
          <Avatar
            onClick={onOpenFolder}
            className="w-24 h-24 hover:opacity-70 cursor-pointer transition"
            fallback={
              <AiOutlineUser
                className="w-12 h-12 text-default-500"
                fill="currentColor"
                size={20}
              />
            }
            showFallback
            src={currentAvatar}
          />
          <div className="text-lg mt-2">
            {user?.last_name + " " + user?.first_name}
          </div>
          <div className="max-w-lg w-full flex flex-col gap-4 mt-4 pb-2">
            <div>
              <div>
                <small>First name</small>
              </div>
              <Input
                errorMessage={errors.firstName?.message}
                {...register("firstName", {
                  required: "First name is required",
                })}
                defaultValue={user?.first_name}
                color="primary"
                variant="bordered"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <div>
                <small>Last name</small>
              </div>
              <Input
                errorMessage={errors.lastName?.message}
                defaultValue={user?.last_name}
                {...register("lastName", {
                  required: "Last name is required",
                })}
                color="primary"
                variant="bordered"
                placeholder="Enter your last name"
              />
            </div>
            <Button
              isLoading={updateProfileMutation.isLoading}
              onClick={handleSubmit(onSubmit)}
              color="primary"
              size="lg"
            >
              Update
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

type UpdatePasswordInputs = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};
export function UpdatePasswordTab() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UpdatePasswordInputs>();
  const watchPassword = watch("password", "");

  const onSubmit: SubmitHandler<UpdatePasswordInputs> = async (data) => {
    updatePasswordMutation.mutate({
      old_password: data.oldPassword,
      new_password: data.confirmPassword,
    });
  };

  const axios = useAxiosIns();

  const updatePasswordMutation = useMutation({
    mutationFn: (params: { old_password: string; new_password: string }) =>
      axios.put<IResponseData<IUser>>(`/api/v1/profile/password`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Updated");
    },
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibility2 = () => setIsVisible2(!isVisible2);
  const toggleVisibility3 = () => setIsVisible3(!isVisible3);
  return (
    <Card shadow="sm" radius="sm">
      <CardBody className="items-center">
        <div className="max-w-lg w-full flex flex-col gap-4">
          <div>
            <div>
              <small>Current password</small>
            </div>
            <Input
              errorMessage={errors.oldPassword?.message}
              {...register("oldPassword", {
                required: "Current password is required",
                minLength: {
                  value: 6,
                  message:
                    "Current password must be at least 6 characters long",
                },
              })}
              color="primary"
              variant="bordered"
              placeholder="Enter your current password"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <AiOutlineEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
            />
          </div>
          <div>
            <div>
              <small>Current password</small>
            </div>
            <Input
              errorMessage={errors.password?.message}
              {...register("password", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "New password must be at least 6 characters long",
                },
              })}
              color="primary"
              variant="bordered"
              placeholder="Enter your new password"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility2}
                >
                  {isVisible2 ? (
                    <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <AiOutlineEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible2 ? "text" : "password"}
            />
          </div>
          <div>
            <div>
              <small>Confirm password</small>
            </div>
            <Input
              errorMessage={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === watchPassword || "Passwords do not match",
              })}
              color="primary"
              label="Confirm password"
              variant="bordered"
              placeholder="Enter your password again"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility3}
                >
                  {isVisible3 ? (
                    <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <AiOutlineEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible3 ? "text" : "password"}
            />
          </div>
          <Button
            isLoading={updatePasswordMutation.isLoading}
            onClick={handleSubmit(onSubmit)}
            color="primary"
            size="lg"
          >
            Update
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
