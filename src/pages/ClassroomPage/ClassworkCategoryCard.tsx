import {
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
        <CardBody>
          {props.classworks.length > 0 ? (
            <></>
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
