import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { Classwork, ClassworkCategory } from "../../types";
import { Classroom } from "../../types/classroom";
import { FaEllipsisVertical } from "react-icons/fa6";
import SVG3 from "../../components/SVG3";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import ClassworkCard from "./ClassworkCard";
import { AiOutlineFileText } from "react-icons/ai";
import dayjs from "../../libs/dayjs";

export default function ClassworkCategoryCard(props: {
  classworkCategory: ClassworkCategory;
  classworks: Classwork[];
  classroom: Classroom;
  isProvider: boolean;
}) {
  const {
    isOpen: isUpdateCategoryModalOpen,
    onOpen: onOpenUpdateCategoryModal,
    onClose: onUpdateCategoryModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteCategoryModalOpen,
    onOpen: onOpenDeleteCategoryModal,
    onClose: onDeleteCategoryModalClose,
  } = useDisclosure();

  return (
    <>
      <EditCategoryModal
        isOpen={isUpdateCategoryModalOpen}
        onClose={onUpdateCategoryModalClose}
        classworkCategory={props.classworkCategory}
        classroom={props.classroom}
      />
      <DeleteCategoryModal
        isOpen={isDeleteCategoryModalOpen}
        onClose={onDeleteCategoryModalClose}
        classworkCategory={props.classworkCategory}
        classroom={props.classroom}
      />
      <Card shadow="sm" isPressable onPress={() => {}}>
        <CardHeader>
          <div className="flex items-center w-full justify-between">
            <div className="text-lg font-medium">
              {props.classworkCategory.name}
            </div>
            {props.isProvider && (
              <Dropdown placement="left-end">
                <DropdownTrigger>
                  <Button radius="full" isIconOnly variant="light">
                    <FaEllipsisVertical size={16} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Post action" variant="flat">
                  <DropdownItem
                    onClick={onOpenUpdateCategoryModal}
                    className="py-2"
                    key="edit_post"
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    color="danger"
                    className="py-2"
                    onClick={onOpenDeleteCategoryModal}
                    key="delete_post"
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="px-0">
          {props.classworks.length > 0 ? (
            <>
              <Accordion variant="splitted" selectionMode="multiple">
                {props.classworks.map((classwork, i) => (
                  <AccordionItem
                    key={i}
                    hideIndicator
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
            </>
          ) : (
            <>
              <div className="text-base mx-auto py-3">
                <div className="w-1/2 mx-auto">
                  <SVG3 />
                </div>
                <small>
                  Students will see this topic after you add an assignment
                </small>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
}
