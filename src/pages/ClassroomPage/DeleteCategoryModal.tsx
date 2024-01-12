import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ClassworkCategory, IResponseData } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { Classroom } from "../../types/classroom";

export default function DeleteCategoryModal(props: {
  isOpen: boolean;
  onClose: () => void;
  classroom: Classroom;
  classworkCategory: ClassworkCategory;
}) {
  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const deleteClassworkCategoryMutation = useMutation({
    mutationFn: () =>
      axios.delete<IResponseData<unknown>>(
        `/api/v1/classwork/${props.classroom.id}/categories/${props.classworkCategory.id}`
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Deleted");
      queryClient.invalidateQueries([
        "fetch/classwork_categories/classroom",
        props.classroom.id,
      ]);
    },
  });

  const confirm = async () => {
    await deleteClassworkCategoryMutation.mutateAsync();
    props.onClose();
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm</ModalHeader>
              <ModalBody>
                Are you sure you want to delete this category?
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={deleteClassworkCategoryMutation.isLoading}
                  variant="light"
                  onPress={props.onClose}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={deleteClassworkCategoryMutation.isLoading}
                  color="danger"
                  onPress={confirm}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
