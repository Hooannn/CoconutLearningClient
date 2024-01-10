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
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosIns from "../hooks/useAxiosIns";
import useAuthStore from "../stores/auth";
import { File, IResponseData } from "../types";
import FileCard from "./FileCard";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { onError } from "../utils/error-handlers";
import toast from "react-hot-toast";
import { AiOutlineClose, AiOutlineUpload } from "react-icons/ai";

export default function UserFolder(props: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (files: File[]) => void;
}) {
  const axios = useAxiosIns();
  const { user } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const isSelecting = selectedFile.length > 0;

  const getMyFilesQuery = useQuery({
    queryKey: ["fetch/files/folder", user?.id],
    queryFn: () => axios.get<IResponseData<File[]>>(`/api/v1/files/folder`),
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const uploadFileMutation = useMutation({
    mutationFn: (params: { formData: FormData }) =>
      axios.postForm<IResponseData<File>>(
        `/api/v1/files/upload`,
        params.formData
      ),
    onError,
    onSuccess: (data) => {
      toast.success(data.data?.message || "Uploaded");
      getMyFilesQuery.refetch();
    },
  });

  const removeFilesMutation = useMutation({
    mutationFn: (params: { file_ids: string[] }) =>
      axios.post<IResponseData<File>>(`/api/v1/files/remove/many`, params),
    onError,
    onSuccess: (data) => {
      toast.success(data.data?.message || "Removed");
      getMyFilesQuery.refetch();
    },
  });

  const files = getMyFilesQuery.data?.data?.data || [];

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("files", file);
    uploadFileMutation.mutate({ formData });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileCardClicked = (file: File) => {
    if (isSelected(file)) {
      const newFiles = selectedFile.filter((f) => f.id !== file.id);
      setSelectedFile(newFiles);
    } else {
      const newFiles = [...selectedFile, file];
      setSelectedFile(newFiles);
    }
  };

  const select = () => {
    props.onSelect(selectedFile);
    setSelectedFile([]);
    props.onClose();
  };

  const remove = async () => {
    await removeFilesMutation.mutateAsync({
      file_ids: selectedFile.map((file) => file.id),
    });
    setSelectedFile([]);
  };

  const isSelected = (file: File) => selectedFile.some((f) => f.id === file.id);

  const isLoading =
    removeFilesMutation.isLoading || uploadFileMutation.isLoading;

  useEffect(() => {
    if (props.isOpen) {
      getMyFilesQuery.refetch();
    }
  }, [props.isOpen]);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple={false}
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Modal
        size="5xl"
        className="h-[80dvh]"
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Folder</ModalHeader>
              <Divider />
              <ModalBody>
                <div className="h-full overflow-auto">
                  {getMyFilesQuery.isLoading ? (
                    <div className="w-full h-full flex flex-wrap gap-2 justify-center overflow-hidden">
                      {Array(16)
                        .fill(null)
                        .map((_, i) => (
                          <Skeleton
                            key={"Skeleton::asdasd" + i}
                            className="rounded-lg w-1/5"
                          >
                            <div className="w-1/4 rounded-lg bg-default-300"></div>
                          </Skeleton>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      {files.map((file) => (
                        <FileCard
                          showCloseButton={false}
                          onClick={onFileCardClicked}
                          isSelected={isSelected(file)}
                          key={file.id}
                          file={file}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                {isSelecting ? (
                  <div className="w-full flex items-center justify-between">
                    <div className="font-bold text-lg">
                      <Button
                        onClick={() => {
                          setSelectedFile([]);
                        }}
                        isIconOnly
                        size="sm"
                        className="mr-2"
                      >
                        <AiOutlineClose />
                      </Button>
                      {selectedFile.length}{" "}
                      {selectedFile.length > 0 ? "file" : "files"} is selected
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        isLoading={isLoading}
                        onClick={select}
                        color="primary"
                      >
                        Select
                      </Button>
                      <Button
                        isLoading={isLoading}
                        onClick={remove}
                        color="danger"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button
                      isLoading={isLoading}
                      color="primary"
                      onPress={() => {
                        fileInputRef.current?.click();
                      }}
                    >
                      <AiOutlineUpload size={16} />
                      Upload
                    </Button>
                    <Button
                      isLoading={isLoading}
                      color="primary"
                      variant="light"
                      onPress={props.onClose}
                    >
                      Close
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
