import {
  Modal,
  ModalContent,
  ModalHeader,
  Divider,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { File, IResponseData, Post } from "../../types";
import { AiOutlineUpload } from "react-icons/ai";
import ReactQuill from "react-quill";
import FileCard from "../../components/FileCard";
import { modules, formats } from "../../configs/quill";
import { useRef, useState } from "react";
import UserFolder from "../../components/UserFolder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Classroom } from "../../types/classroom";
import useAxiosIns from "../../hooks/useAxiosIns";
import { onError } from "../../utils/error-handlers";
import toast from "react-hot-toast";

export default function EditPost(props: {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  classroom: Classroom;
}) {
  const {
    onOpen: onOpenFolder,
    isOpen: isFolderOpen,
    onClose: onFolderClose,
  } = useDisclosure();

  const [selectedFiles, setSelectedFiles] = useState<File[]>(props.post.files);

  const onFilesSelected = (files: File[]) => {
    const newFiles = [...selectedFiles, ...files];
    const _files: File[] = [];

    newFiles.forEach((file) => {
      if (!_files.some((f) => f.id === file.id)) _files.push(file);
    });

    setSelectedFiles(_files);
  };

  const quillRef = useRef<ReactQuill>(null);
  const axios = useAxiosIns();
  const queryClient = useQueryClient();
  const [body, setBody] = useState(props.post.body);

  const updatePostMutation = useMutation({
    mutationFn: (params: {
      body: string;
      file_ids: string[];
      classroom_id: string;
    }) =>
      axios.put<IResponseData<Post>>(`/api/v1/posts/${props.post.id}`, params),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Updated successfully");
      queryClient.invalidateQueries([
        "fetch/posts/classroom",
        props.classroom.id,
      ]);
    },
  });

  const save = async () => {
    await updatePostMutation.mutateAsync({
      body,
      classroom_id: props.classroom.id,
      file_ids: selectedFiles.length
        ? selectedFiles.map((file) => file.id)
        : [],
    });
    props.onClose();
  };

  return (
    <>
      <UserFolder
        onSelect={onFilesSelected}
        isOpen={isFolderOpen}
        onClose={onFolderClose}
      />
      <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Post</ModalHeader>
              <Divider />
              <ModalBody>
                <ReactQuill
                  className="edit-post"
                  ref={quillRef}
                  placeholder="Announce something to this classroom."
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  value={body}
                  onChange={(e) => {
                    setBody(e);
                  }}
                />
                {selectedFiles.length > 0 && (
                  <div className="w-full flex items-center flex-wrap gap-4 mt-3">
                    {selectedFiles.map((file, index) => (
                      <FileCard
                        showCloseButton
                        onClose={(file) => {
                          const newFiles = selectedFiles.filter(
                            (f) => f.id !== file.id
                          );
                          setSelectedFiles(newFiles);
                        }}
                        file={file}
                        isSelected={false}
                        key={file.id + index}
                      />
                    ))}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <div className="flex items-center justify-between w-full">
                  <Tooltip content="Upload files">
                    <Button
                      isIconOnly
                      className="w-10 h-10"
                      isLoading={updatePostMutation.isLoading}
                      radius="full"
                      color="primary"
                      variant="flat"
                      onClick={onOpenFolder}
                    >
                      <AiOutlineUpload size={24} />
                    </Button>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    isLoading={updatePostMutation.isLoading}
                    onPress={props.onClose}
                    variant="light"
                  >
                    Cancel
                  </Button>
                  <Button
                    isLoading={updatePostMutation.isLoading}
                    onPress={save}
                    color="primary"
                  >
                    Save
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
