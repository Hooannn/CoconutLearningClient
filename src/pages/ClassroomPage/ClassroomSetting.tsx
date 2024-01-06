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
  Image,
} from "@nextui-org/react";
import { AiOutlineClose } from "react-icons/ai";
import { Classroom } from "../../types/classroom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData } from "../../types";
import { onError } from "../../utils/error-handlers";
import toast from "react-hot-toast";
type UpdateClassroomInputs = {
  name: string;
  description?: string;
  room?: string;
  course?: string;
};

type UpdateClassroomParams = {
  name: string;
  description?: string;
  room?: string;
  course?: string;
  cover_image_url: string;
};
export default function ClassroomSetting(props: {
  isOpen: boolean;
  onClose: () => void;
  classroom: Classroom;
}) {
  const queryClient = useQueryClient();
  const axios = useAxiosIns();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateClassroomInputs>();

  const updateClassroomMutation = useMutation({
    mutationFn: (params: UpdateClassroomParams) =>
      axios.put<IResponseData<unknown>>(
        `/api/v1/classrooms/${props.classroom.id}`,
        params
      ),
    onError,
    onSuccess: (data) => {
      toast.success(data.data.message || "Updated successfully");
      queryClient.invalidateQueries(["fetch/classroom/id", props.classroom.id]);
    },
  });

  const availableCoverImages = [
    "/Honors_thumb.jpg",
    "/img_backtoschool_thumb.jpg",
    "/img_bookclub_thumb.jpg",
    "/img_breakfast_thumb.jpg",
    "/img_code_thumb.jpg",
    "/img_graduation_thumb.jpg",
    "/img_learnlanguage_thumb.jpg",
    "/img_reachout_thumb.jpg",
    "/img_read_thumb.jpg",
  ];

  const [currentCoverImage, setCurrentCoverImage] = useState(
    props.classroom.coverImageUrl || availableCoverImages[0]
  );

  const onSubmit: SubmitHandler<UpdateClassroomInputs> = async (data) => {
    await updateClassroomMutation.mutateAsync({
      ...data,
      cover_image_url: currentCoverImage,
    });
    props.onClose();
  };

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
                <Button
                  isIconOnly
                  isLoading={updateClassroomMutation.isLoading}
                  onClick={onClose}
                >
                  <AiOutlineClose />
                </Button>
                <div>Classroom setting</div>
              </div>

              <Button
                onClick={handleSubmit(onSubmit)}
                color="primary"
                size="lg"
                isLoading={updateClassroomMutation.isLoading}
                className="px-10"
              >
                Save
              </Button>
            </ModalHeader>
            <Divider />
            <ModalBody className="flex items-center">
              <div className="flex flex-wrap gap-4 w-full justify-center">
                {availableCoverImages.map((path) => (
                  <Image
                    onClick={() => {
                      setCurrentCoverImage(path);
                    }}
                    className={`${
                      currentCoverImage === path ? "border-2" : ""
                    } transition cursor-pointer border-orange-500 border-solid w-1/4`}
                    removeWrapper
                    src={path}
                  />
                ))}
              </div>
              <Card shadow="sm" radius="sm" className="w-[500px]">
                <CardBody className="items-start">
                  <div className="py-2 font-bold text-lg">
                    Classroom information
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Input
                      isRequired
                      defaultValue={props.classroom.name}
                      errorMessage={errors.name?.message}
                      {...register("name", {
                        required: "Name is required",
                      })}
                      color="primary"
                      variant="bordered"
                      label="Name"
                    />
                    <Input
                      {...register("description", { required: false })}
                      defaultValue={props.classroom.description}
                      color="primary"
                      variant="bordered"
                      label="Description"
                    />
                    <Input
                      {...register("course", { required: false })}
                      defaultValue={props.classroom.course}
                      color="primary"
                      variant="bordered"
                      label="Course"
                    />
                    <Input
                      {...register("room", { required: false })}
                      defaultValue={props.classroom.room}
                      color="primary"
                      variant="bordered"
                      label="Room"
                    />
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
