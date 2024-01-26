import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Divider,
  Card,
  CardBody,
  Input,
  useDisclosure,
  Avatar,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ClassworkCategory,
  ClassworkType,
  File,
  IResponseData,
  IUser,
} from "../../types";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
import { Classroom } from "../../types/classroom";
import {
  AiOutlineBook,
  AiOutlineClose,
  AiOutlineUpload,
  AiOutlineUser,
} from "react-icons/ai";
import ReactQuill from "react-quill";
import FileCard from "../../components/FileCard";
import { modules, formats } from "../../configs/quill";
import { useState } from "react";
import UserFolder from "../../components/UserFolder";
export default function CreateDocumentModal(props: {
  isOpen: boolean;
  onClose: () => void;
  classroom: Classroom;
  classworkCategories: ClassworkCategory[];
}) {
  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const createClassworkMutation = useMutation({
    mutationFn: (params: {
      title: string;
      description?: string;
      type: ClassworkType;
      score?: number;
      assignee_ids: string[];
      file_ids: string[];
      category_id?: string;
    }) =>
      axios.post<IResponseData<unknown>>(
        `/api/v1/classwork/${props.classroom.id}`,
        params
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Created");
      queryClient.invalidateQueries([
        "fetch/classworks/classroom",
        props.classroom.id,
      ]);
    },
  });

  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const {
    onOpen: onOpenFolder,
    isOpen: isFolderOpen,
    onClose: onFolderClose,
  } = useDisclosure();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onFilesSelected = (files: File[]) => {
    const newFiles = [...selectedFiles, ...files];
    const _files: File[] = [];

    newFiles.forEach((file) => {
      if (!_files.some((f) => f.id === file.id)) _files.push(file);
    });

    setSelectedFiles(_files);
  };

  const getUser = (userId?: string) => {
    if (userId === "ALL")
      return { id: "ALL", first_name: "All students" } as IUser;
    return props.classroom.users.find((user) => user.id === userId);
  };

  const getUsers: () => IUser[] = () => [
    { id: "ALL", first_name: "All students" } as IUser,
    ...props.classroom.users,
  ];

  const [assignees, setAssignees] = useState<string[]>([
    "ALL",
    ...props.classroom.users.map((user) => user.id),
  ]);

  const [category, setCategory] = useState<string>();

  const create = async () => {
    if (assignees.filter((a) => a !== "ALL").length === 0) {
      toast.error("Assignees must have at least one");
      return;
    }
    if (title.length === 0 || title.trim().length === 0) {
      toast.error("Title must not be empty");
      return;
    }

    await createClassworkMutation.mutateAsync({
      title,
      description,
      type: ClassworkType.DOCUMENT,
      score: 0,
      assignee_ids: assignees.filter((a) => a !== "ALL"),
      file_ids: selectedFiles.map((f) => f.id),
      category_id: category,
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
      <Modal
        hideCloseButton
        size="full"
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex py-2 items-center justify-between text-2xl">
                <div className="flex gap-2 items-center">
                  <Button
                    isIconOnly
                    isLoading={createClassworkMutation.isLoading}
                    onClick={props.onClose}
                  >
                    <AiOutlineClose />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      className="opacity-100"
                      color="primary"
                      variant="flat"
                      isDisabled
                      radius="full"
                    >
                      <AiOutlineBook size={24} />
                    </Button>
                    Document
                  </div>
                </div>

                <Button
                  onClick={create}
                  color="primary"
                  size="lg"
                  isLoading={createClassworkMutation.isLoading}
                  className="px-10"
                >
                  Create
                </Button>
              </ModalHeader>
              <Divider />
              <ModalBody className="overflow-auto">
                <div className="max-w-[980px] w-full py-4 mx-auto flex flex-col gap-4 items-center">
                  <Card shadow="sm" className="w-full">
                    <CardBody>
                      <div className="p-3 flex flex-col gap-4">
                        <Input
                          value={title}
                          onValueChange={(v) => setTitle(v)}
                          variant="bordered"
                          label="Title"
                        />
                        <div>
                          <ReactQuill
                            placeholder="Description (optional)"
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            value={description}
                            onChange={(e) => {
                              setDescription(e);
                            }}
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card shadow="sm" className="w-full">
                    <CardBody>
                      <div className="p-3 flex flex-col gap-4">
                        <div>Files</div>
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
                        <div className="mx-auto flex flex-col items-center gap-2">
                          <Button
                            isIconOnly
                            className="w-14 h-14"
                            radius="full"
                            color="primary"
                            variant="flat"
                            onClick={onOpenFolder}
                          >
                            <AiOutlineUpload size={24} />
                          </Button>
                          <div className="text-sm">Upload files</div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card shadow="sm" className="w-full overflow-visible">
                    <CardBody className="overflow-visible">
                      <div className="p-3 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                          <div>Assignees</div>
                          <Select
                            selectionMode="multiple"
                            items={getUsers()}
                            placeholder="Select a student"
                            variant="flat"
                            disallowEmptySelection
                            selectedKeys={assignees}
                            onSelectionChange={(selection) => {
                              const keys = Array.from(selection) as string[];
                              const newKey = keys.filter(
                                (key) => !assignees.includes(key)
                              );
                              if (newKey.length > 0) {
                                const key = newKey[0];
                                if (key === "ALL") {
                                  setAssignees([
                                    "ALL",
                                    ...props.classroom.users.map((u) => u.id),
                                  ]);
                                  return;
                                }
                                const keysWithOutAll = keys.filter(
                                  (key) => key !== "ALL"
                                );
                                if (
                                  keysWithOutAll.length ===
                                  props.classroom.users.length
                                ) {
                                  setAssignees(["ALL", ...keysWithOutAll]);
                                  return;
                                }
                              } else {
                                const deletedKey = assignees.filter(
                                  (key) => !keys.includes(key)
                                )[0];
                                if (deletedKey === "ALL") return;
                                else {
                                  const _keys = keys.filter(
                                    (key) => key !== "ALL"
                                  );
                                  setAssignees(_keys);
                                  return;
                                }
                              }

                              setAssignees(keys);
                            }}
                            renderValue={(items) => {
                              return (
                                <div className="flex items-center gap-2 w-full overflow-hidden">
                                  {items.map((u) => u.key).includes("ALL") ? (
                                    <>
                                      <div className="flex gap-2 items-center">
                                        <Avatar
                                          alt={
                                            getUser(
                                              items
                                                .find((i) => i.key === "ALL")
                                                ?.key?.toString()
                                            )?.first_name +
                                            " " +
                                            getUser(
                                              items
                                                .find((i) => i.key === "ALL")
                                                ?.key?.toString()
                                            )?.last_name
                                          }
                                          className="flex-shrink-0"
                                          src={
                                            getUser(
                                              items
                                                .find((i) => i.key === "ALL")
                                                ?.key?.toString()
                                            )?.avatar_url
                                          }
                                          showFallback
                                          fallback={
                                            <AiOutlineUser
                                              className="w-6 h-6 text-default-500"
                                              fill="currentColor"
                                              size={20}
                                            />
                                          }
                                        />
                                        <div className="flex flex-col">
                                          <span className="text-small">
                                            {`${
                                              getUser(
                                                items
                                                  .find((i) => i.key === "ALL")
                                                  ?.key?.toString()
                                              )?.first_name
                                            } 
                                            ${
                                              getUser(
                                                items
                                                  .find((i) => i.key === "ALL")
                                                  ?.key?.toString()
                                              )?.last_name
                                                ? " " +
                                                  getUser(
                                                    items
                                                      .find(
                                                        (i) => i.key === "ALL"
                                                      )
                                                      ?.key?.toString()
                                                  )?.last_name
                                                : ""
                                            }`}
                                          </span>
                                          <span className="text-tiny text-default-400">
                                            {
                                              getUser(
                                                items
                                                  .find((i) => i.key === "ALL")
                                                  ?.key?.toString()
                                              )?.email
                                            }
                                          </span>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      {items.map((item) => (
                                        <div className="flex gap-2 items-center">
                                          <Avatar
                                            alt={
                                              getUser(item?.key?.toString())
                                                ?.first_name +
                                              " " +
                                              getUser(item?.key?.toString())
                                                ?.last_name
                                            }
                                            className="flex-shrink-0"
                                            src={
                                              getUser(item?.key?.toString())
                                                ?.avatar_url
                                            }
                                            showFallback
                                            fallback={
                                              <AiOutlineUser
                                                className="w-6 h-6 text-default-500"
                                                fill="currentColor"
                                                size={20}
                                              />
                                            }
                                          />
                                          <div className="flex flex-col">
                                            <span className="text-small">
                                              {`${
                                                getUser(item?.key?.toString())
                                                  ?.first_name
                                              } 
                                            ${
                                              getUser(item?.key?.toString())
                                                ?.last_name
                                                ? " " +
                                                  getUser(item?.key?.toString())
                                                    ?.last_name
                                                : ""
                                            }`}
                                            </span>
                                            <span className="text-tiny text-default-400">
                                              {
                                                getUser(item?.key?.toString())
                                                  ?.email
                                              }
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </div>
                              );
                            }}
                          >
                            {(user) => (
                              <SelectItem
                                key={user.id}
                                textValue={
                                  user.first_name + " " + user?.last_name
                                }
                              >
                                <div className="flex gap-2 items-center">
                                  <Avatar
                                    alt={
                                      user.first_name + " " + user?.last_name
                                    }
                                    className="flex-shrink-0"
                                    src={user?.avatar_url}
                                    showFallback
                                    fallback={
                                      <AiOutlineUser
                                        className="w-6 h-6 text-default-500"
                                        fill="currentColor"
                                        size={20}
                                      />
                                    }
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-small">
                                      {`${user.first_name} ${
                                        user.last_name
                                          ? " " + user.last_name
                                          : ""
                                      }`}
                                    </span>
                                    <span className="text-tiny text-default-400">
                                      {user?.email}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            )}
                          </Select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <div>Category</div>
                          <Select
                            items={props.classworkCategories}
                            placeholder="Select a category"
                            onSelectionChange={(selection) => {
                              const keys = Array.from(selection) as string[];
                              setCategory(keys[0]?.toString() ?? "");
                            }}
                          >
                            {(category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            )}
                          </Select>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
