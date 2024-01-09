import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import useAxiosIns from "../hooks/useAxiosIns";
import useAuthStore from "../stores/auth";
import { File, IResponseData } from "../types";
import FileCard from "./FileCard";

export default function UserFolder(props: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const axios = useAxiosIns();
  const { user } = useAuthStore();

  const getMyFilesQuery = useQuery({
    queryKey: ["fetch/files/folder", user?.id],
    queryFn: () => axios.get<IResponseData<File[]>>(`/api/v1/files/folder`),
    refetchOnWindowFocus: false,
  });

  const files = getMyFilesQuery.data?.data?.data || [];
  return (
    <Modal size="5xl" className="h-[80dvh]" isOpen={props.isOpen}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Folder</ModalHeader>
            <Divider />
            <ModalBody>
              <div className="h-96 overflow-auto">
                {getMyFilesQuery.isLoading ? (
                  <div className="w-full h-full flex flex-wrap gap-2 justify-center overflow-hidden">
                    {Array(16)
                      .fill(null)
                      .map((i) => (
                        <Skeleton
                          key={"Skeleton::asdasd" + i}
                          className="rounded-lg w-1/5"
                        >
                          <div className="w-1/4 rounded-lg bg-default-300"></div>
                        </Skeleton>
                      ))}
                  </div>
                ) : (
                  <>
                    {files.map((file) => (
                      <div key={file.id}>
                        <FileCard file={file} />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={props.onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
