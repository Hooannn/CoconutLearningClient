import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { IResponseData } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { Classroom } from "../../types/classroom";

export default function CreateCategoryModal(props: {
  isOpen: boolean;
  onClose: () => void;
  classroom: Classroom;
}) {
  const [name, setName] = useState("");
  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const createClassworkCategoryMutation = useMutation({
    mutationFn: (params: { name: string }) =>
      axios.post<IResponseData<unknown>>(
        `/api/v1/classwork/${props.classroom.id}/categories`,
        params
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Created");
      queryClient.invalidateQueries([
        "fetch/classwork_categories/classroom",
        props.classroom.id,
      ]);
    },
  });

  const create = async () => {
    await createClassworkCategoryMutation.mutateAsync({ name });
    props.onClose();
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create category
              </ModalHeader>
              <ModalBody>
                <Input
                  value={name}
                  onValueChange={(v) => setName(v)}
                  variant="bordered"
                  color="primary"
                  size={"md"}
                  label="Name"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={createClassworkCategoryMutation.isLoading}
                  color="primary"
                  variant="light"
                  onPress={props.onClose}
                >
                  Close
                </Button>
                <Button
                  isLoading={createClassworkCategoryMutation.isLoading}
                  color="primary"
                  onPress={create}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
