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
import { Classwork, IResponseData } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { Classroom } from "../../types/classroom";
import { useLocation, useNavigate } from "react-router-dom";

export default function DeleteClassworkModal(props: {
  isOpen: boolean;
  onClose: () => void;
  classroom: Classroom;
  classwork: Classwork;
}) {
  const axios = useAxiosIns();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const deleteClassworkMutation = useMutation({
    mutationFn: () =>
      axios.delete<IResponseData<unknown>>(
        `/api/v1/classwork/${props.classroom.id}/${props.classwork.id}`
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Deleted");
      if (location.pathname.includes(`/classwork/${props.classwork.id}`)) {
        navigate(-1);
      }
      queryClient.invalidateQueries([
        "fetch/classworks/classroom",
        props.classroom.id,
      ]);
    },
  });

  const confirm = async () => {
    await deleteClassworkMutation.mutateAsync();
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
                Are you sure you want to delete this classwork? All related data
                will be deleted.
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={deleteClassworkMutation.isLoading}
                  variant="light"
                  onPress={props.onClose}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={deleteClassworkMutation.isLoading}
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
