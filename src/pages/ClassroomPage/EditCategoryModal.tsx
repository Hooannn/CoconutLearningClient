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
import { ClassworkCategory, IResponseData } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { Classroom } from "../../types/classroom";

export default function EditCategoryModal(props: {
  isOpen: boolean;
  onClose: () => void;
  classroom: Classroom;
  classworkCategory: ClassworkCategory;
}) {
  const [name, setName] = useState(props.classworkCategory.name);
  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const updateClassworkCategoryMutation = useMutation({
    mutationFn: (params: { name: string }) =>
      axios.put<IResponseData<unknown>>(
        `/api/v1/classwork/${props.classroom.id}/categories/${props.classworkCategory.id}`,
        params
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Updated");
      queryClient.invalidateQueries([
        "fetch/classwork_categories/classroom",
        props.classroom.id,
      ]);
    },
  });

  const save = async () => {
    await updateClassworkCategoryMutation.mutateAsync({ name });
    props.onClose();
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update category
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
                  isLoading={updateClassworkCategoryMutation.isLoading}
                  color="primary"
                  variant="light"
                  onPress={props.onClose}
                >
                  Close
                </Button>
                <Button
                  isLoading={updateClassworkCategoryMutation.isLoading}
                  color="primary"
                  onPress={save}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
