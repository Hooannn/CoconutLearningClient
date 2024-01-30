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
import { IResponseData, Meeting, Classroom } from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";

export default function DeleteMeetingModal(props: {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting;
  classroom: Classroom;
}) {
  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const deleteMeetingMutation = useMutation({
    mutationFn: () =>
      axios.delete<IResponseData<unknown>>(
        `/api/v1/meeting/${props.meeting.id}`
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Deleted");
      queryClient.invalidateQueries([
        "fetch/meeting/classroom",
        props.classroom.id,
      ]);
    },
  });

  const confirm = async () => {
    await deleteMeetingMutation.mutateAsync();
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
                Are you sure you want to delete this meeting?
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={deleteMeetingMutation.isLoading}
                  variant="light"
                  onPress={props.onClose}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={deleteMeetingMutation.isLoading}
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
