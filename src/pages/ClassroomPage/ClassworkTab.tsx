import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import useAxiosIns from "../../hooks/useAxiosIns";
import useAuthStore from "../../stores/auth";
import { Classwork, ClassworkCategory, IResponseData } from "../../types";
import { LuUserSquare } from "react-icons/lu";
import { onError } from "../../utils/error-handlers";
import { Classroom } from "../../types/classroom";
import {
  Accordion,
  AccordionItem,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import {
  AiOutlineBars,
  AiOutlineBook,
  AiOutlineFileText,
  AiOutlineFileUnknown,
  AiOutlinePlus,
} from "react-icons/ai";
import SVG3 from "../../components/SVG3";
import CreateCategoryModal from "./CreateCategoryModal";
import ClassworkCategoryCard from "./ClassworkCategoryCard";
import CreateExamModal from "./CreateExamModal";
import dayjs from "dayjs";
import ClassworkCard from "./ClassworkCard";
import { FaEllipsisVertical } from "react-icons/fa6";

export default function ClassworkTab(props: {
  classroom: Classroom;
  isOwner: boolean;
  isProvider: boolean;
}) {
  const axios = useAxiosIns();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const getClassworkCategoriesQuery = useQuery({
    queryKey: ["fetch/classwork_categories/classroom", props.classroom.id],
    queryFn: () =>
      axios.get<IResponseData<ClassworkCategory[]>>(
        `/api/v1/classwork/${props.classroom.id}/categories`
      ),
    refetchOnWindowFocus: false,
  });

  const getClassworksQuery = useQuery({
    queryKey: ["fetch/classworks/classroom", props.classroom.id],
    queryFn: () =>
      axios.get<IResponseData<Classwork[]>>(
        `/api/v1/classwork/${props.classroom.id}`
      ),
    refetchOnWindowFocus: false,
  });

  const classworks = getClassworksQuery.data?.data?.data || [];
  const classworkCategories =
    getClassworkCategoriesQuery.data?.data?.data || [];

  const getCategories = () => {
    return [{ name: "All categories", id: "ALL" }, ...classworkCategories];
  };

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const isLoading =
    getClassworkCategoriesQuery.isLoading || getClassworksQuery.isLoading;

  const {
    isOpen: isCreateCategoryModalOpen,
    onOpen: onOpenCreateCategoryModal,
    onClose: onCreateCategoryModalClose,
  } = useDisclosure();

  const {
    isOpen: isCreateExamModalOpen,
    onOpen: onOpenCreateExamModal,
    onClose: onCreateExamModalClose,
  } = useDisclosure();

  return (
    <div className="flex flex-col gap-4 items-start max-w-[980px] mx-auto h-full">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <CreateCategoryModal
            classroom={props.classroom}
            isOpen={isCreateCategoryModalOpen}
            onClose={onCreateCategoryModalClose}
          />
          <CreateExamModal
            classroom={props.classroom}
            classworkCategories={classworkCategories}
            isOpen={isCreateExamModalOpen}
            onClose={onCreateExamModalClose}
          />
          {props.isProvider ? (
            <Dropdown>
              <DropdownTrigger>
                <Button className="py-6 px-5" color="primary">
                  <AiOutlinePlus size={16} />
                  Create
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                className="text-lg"
                variant="faded"
                color="primary"
                aria-label="Dropdown menu with icons"
              >
                <DropdownItem
                  key="exam"
                  className="py-2"
                  onClick={onOpenCreateExamModal}
                  startContent={<AiOutlineFileText size={20} />}
                >
                  Exam
                </DropdownItem>
                <DropdownItem
                  key="lab"
                  className="py-2"
                  startContent={<AiOutlineFileText size={20} />}
                >
                  Lab
                </DropdownItem>
                <DropdownItem
                  key="question"
                  className="py-2"
                  startContent={<AiOutlineFileUnknown size={20} />}
                >
                  Question
                </DropdownItem>
                <DropdownItem
                  key="document"
                  showDivider
                  startContent={<AiOutlineBook />}
                >
                  Document
                </DropdownItem>
                <DropdownItem
                  onClick={onOpenCreateCategoryModal}
                  key="category"
                  startContent={<AiOutlineBars />}
                >
                  Category
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button color="primary" variant="light">
              <LuUserSquare size={16} />
              See your assignments
            </Button>
          )}

          {classworkCategories.length > 0 && (
            <div className="w-1/3">
              <Select
                items={getCategories()}
                placeholder="Select a category"
                variant="bordered"
                color="primary"
                disallowEmptySelection
                selectedKeys={[selectedCategory]}
                onSelectionChange={(selection) => {
                  const keys = Array.from(selection) as string[];
                  setSelectedCategory(keys[0]?.toString());
                }}
              >
                {(category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                )}
              </Select>
            </div>
          )}

          <Divider className="my-1" />
          {classworkCategories.length == 0 && classworks.length == 0 ? (
            <div className="flex flex-col w-full items-center justify-center">
              <div className="w-1/4">
                <SVG3 />
              </div>
              <div className="mt-3">This is where assignments are assigned</div>
              <small>
                You can add assignments and other classwork and organize them
                into topics
              </small>
            </div>
          ) : (
            <div className="w-full">
              {selectedCategory === "ALL" &&
                classworks.filter((c) => !c.category).length > 0 && (
                  <Accordion
                    variant="splitted"
                    className="p-0 mb-8"
                    selectionMode="multiple"
                  >
                    {classworks
                      .filter((c) => !c.category)
                      .map((classwork, i) => (
                        <AccordionItem
                          hideIndicator
                          key={i}
                          title={
                            <div className="flex items-center justify-between text-base">
                              <div className="flex items-center gap-2">
                                <Button
                                  isIconOnly
                                  className="opacity-100"
                                  color="primary"
                                  size="sm"
                                  isDisabled
                                  radius="full"
                                >
                                  <AiOutlineFileText size={18} />
                                </Button>
                                <div>{classwork.title}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <small className="opacity-60">
                                  {classwork.deadline
                                    ? dayjs(classwork.deadline).fromNow()
                                    : "No deadline"}
                                </small>
                                {props.isProvider && (
                                  <Dropdown placement="left-end">
                                    <DropdownTrigger>
                                      <Button
                                        radius="full"
                                        isIconOnly
                                        variant="light"
                                      >
                                        <FaEllipsisVertical
                                          size={14}
                                          className="opacity-70"
                                        />
                                      </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                      aria-label="Post action"
                                      variant="flat"
                                    >
                                      <DropdownItem
                                        className="py-2"
                                        key="edit_classwork"
                                      >
                                        Edit
                                      </DropdownItem>
                                      <DropdownItem
                                        color="danger"
                                        className="py-2"
                                        key="delete_classwork"
                                      >
                                        Delete
                                      </DropdownItem>
                                    </DropdownMenu>
                                  </Dropdown>
                                )}
                              </div>
                            </div>
                          }
                        >
                          <ClassworkCard
                            key={classwork.id}
                            classwork={classwork}
                            classroom={props.classroom}
                            isProvider={props.isProvider}
                          />
                        </AccordionItem>
                      ))}
                  </Accordion>
                )}
              {classworkCategories.length > 0 ? (
                <div className="flex flex-col gap-8">
                  {classworkCategories
                    .filter((c) => {
                      if (selectedCategory === "ALL") return c.id !== "ALL";
                      return c.id === selectedCategory;
                    })
                    .map((category) => (
                      <ClassworkCategoryCard
                        classworkCategory={category}
                        classworks={classworks.filter(
                          (c) => c.category?.id === category.id
                        )}
                        isProvider={props.isProvider}
                        classroom={props.classroom}
                        key={category.id}
                      />
                    ))}
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
