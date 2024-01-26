import {
  Modal,
  ModalContent,
  ModalHeader,
  Button,
  Divider,
  ModalBody,
  Card,
  CardBody,
  CardHeader,
  Switch,
} from "@nextui-org/react";
import { AiOutlineClose } from "react-icons/ai";
import useAuthStore from "../stores/auth";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IResponseData, IUser } from "../types";
import { onError } from "../utils/error-handlers";
import useAxiosIns from "../hooks/useAxiosIns";

export default function ConfigurationsModal(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const axios = useAxiosIns();
  const { user, setUser } = useAuthStore();
  const [enabledEmailNotification, setEnabledEmailNotification] = useState(
    user?.enabled_email_notification
  );
  const [enabledPushNotification, setEnabledPushNotification] = useState(
    user?.enabled_push_notification
  );

  const updateProfileMutation = useMutation({
    mutationFn: (params: {
      enabled_email_notification?: boolean;
      enabled_push_notification?: boolean;
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

  const update = async () => {
    await updateProfileMutation.mutateAsync({
      enabled_email_notification: enabledEmailNotification,
      enabled_push_notification: enabledPushNotification,
    });
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
                <Button isLoading={false} isIconOnly onClick={onClose}>
                  <AiOutlineClose />
                </Button>
                <div>Configurations</div>
              </div>
            </ModalHeader>
            <Divider />
            <ModalBody className="flex items-center">
              <Card
                shadow="sm"
                radius="sm"
                className="w-full max-w-lg items-center p-5"
              >
                <CardHeader className="w-full text-lg">
                  Notifications
                </CardHeader>
                <CardBody className="items-center w-full">
                  <div className="w-full flex flex-col gap-4">
                    <div className="w-full flex items-center justify-between">
                      <div className="text-sm opacity-80">
                        Enable email notification
                      </div>
                      <Switch
                        size="lg"
                        onValueChange={setEnabledEmailNotification}
                        isSelected={enabledEmailNotification}
                      />
                    </div>
                    <div className="w-full flex items-center justify-between">
                      <div className="text-sm opacity-80">
                        Enable push notification
                      </div>
                      <Switch
                        onValueChange={setEnabledPushNotification}
                        size="lg"
                        isSelected={enabledPushNotification}
                      />
                    </div>
                    <Button
                      onClick={update}
                      color="primary"
                      size="lg"
                      isLoading={updateProfileMutation.isLoading}
                      className="mt-2"
                    >
                      Update
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
