import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  Input,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onError } from "../utils/error-handlers";
import useAxiosIns from "../hooks/useAxiosIns";
import { IResponseData } from "../types";
import { Classroom } from "../types/classroom";
import toast from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";

type CreateClassroomInputs = {
  name: string;
  description?: string;
  room?: string;
  course?: string;
};

export default function CreateClassroomModal(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClassroomInputs>();

  const onSubmit: SubmitHandler<CreateClassroomInputs> = async (data) => {
    await createClassroomMutation.mutateAsync(data);
    props.onClose();
  };

  const queryClient = useQueryClient();
  const axios = useAxiosIns();

  const createClassroomMutation = useMutation({
    mutationFn: (params: {
      name: string;
      description?: string;
      room?: string;
      course?: string;
    }) => axios.post<IResponseData<Classroom>>(`/api/v1/classrooms`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Created classroom successfully");
      queryClient.invalidateQueries(["fetch/classrooms/teaching"]);
      queryClient.invalidateQueries(["fetch/classrooms/registered"]);
    },
  });
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Create classroom</ModalHeader>
            <ModalBody>
              <Input
                isRequired
                errorMessage={errors.name?.message}
                {...register("name", {
                  required: "Name is required",
                })}
                color="primary"
                variant="bordered"
                label="Name"
              />
              <Input
                {...register("description", { required: false })}
                color="primary"
                variant="bordered"
                label="Description"
              />
              <Input
                {...register("course", { required: false })}
                color="primary"
                variant="bordered"
                label="Course"
              />
              <Input
                {...register("room", { required: false })}
                color="primary"
                variant="bordered"
                label="Room"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={createClassroomMutation.isLoading}
                color="danger"
                variant="light"
                onPress={onClose}
              >
                Close
              </Button>
              <Button
                isLoading={createClassroomMutation.isLoading}
                color="primary"
                onClick={handleSubmit(onSubmit)}
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
