import {
  Modal,
  ModalContent,
  ModalHeader,
  Button,
  Divider,
  ModalBody,
} from "@nextui-org/react";
import { AiOutlineClose } from "react-icons/ai";

export default function ConfigurationsModal(props: {
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
                <div>Configurations</div>
              </div>
            </ModalHeader>
            <Divider />
            <ModalBody className="flex items-center"></ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
