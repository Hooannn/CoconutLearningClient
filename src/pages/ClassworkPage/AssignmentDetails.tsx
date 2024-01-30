// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Modal,
  ModalContent,
  ModalHeader,
  Divider,
  ModalBody,
  ModalFooter,
  Button,
  User,
  Textarea,
  Input,
} from "@nextui-org/react";
import { Assignment, Classwork, IResponseData } from "../../types";
import { AiOutlineUser } from "react-icons/ai";
import FileCard from "../../components/FileCard";
import SVG2 from "../../components/SVG2";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs from "../../libs/dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Classroom } from "../../types/classroom";
import toast from "react-hot-toast";
import { onError } from "../../utils/error-handlers";
import useAxiosIns from "../../hooks/useAxiosIns";
type CreateGradeInputs = {
  score: number;
  comment?: string;
};

export default function AssignmentDetails(props: {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment;
  classwork: Classwork;
  classroom: Classroom;
}) {
  const author = props.assignment.author;
  const isGraded = props.assignment.grade !== null;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGradeInputs>();
  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const createGradeMutation = useMutation({
    mutationFn: (params: { grade: number; comment?: string }) =>
      axios.post<IResponseData<unknown>>(
        `/api/v1/assignments/${props.classroom.id}/${props.classwork.id}/${props.assignment.author.id}/grade`,
        params
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Created grade successfully");
      queryClient.invalidateQueries([
        "fetch/classwork/details",
        props.classroom.id,
        props.classwork.id,
      ]);
    },
  });

  const updateGradeMutation = useMutation({
    mutationFn: (params: {
      grade: number;
      comment?: string;
      grade_id: string;
    }) =>
      axios.put<IResponseData<unknown>>(
        `/api/v1/assignments/grade/${params.grade_id}`,
        {
          grade: params.grade,
          comment: params.comment,
        }
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Updated");
      queryClient.invalidateQueries([
        "fetch/classwork/details",
        props.classroom.id,
        props.classwork.id,
      ]);
    },
  });

  const onSubmit: SubmitHandler<CreateGradeInputs> = async (data) => {
    await createGradeMutation.mutateAsync({
      comment: data.comment,
      grade: data.score,
    });
    props.onClose();
  };

  const onUpdate: SubmitHandler<CreateGradeInputs> = async (data) => {
    await updateGradeMutation.mutateAsync({
      comment: data.comment,
      grade: data.score,
      grade_id: props.assignment.grade.id,
    });
    props.onClose();
  };
  return (
    <>
      <Modal
        size="5xl"
        className="h-[80dvh]"
        hideCloseButton
        isDismissable={false}
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <div className="flex items-center justify-between w-full">
                  <User
                    name={author?.first_name + " " + author?.last_name}
                    avatarProps={{
                      src: author?.avatar_url,
                      fallback: (
                        <AiOutlineUser
                          className="w-4 h-4 text-default-500"
                          fill="currentColor"
                          size={20}
                        />
                      ),
                      showFallback: true,
                      className: "w-8 h-8",
                    }}
                  />
                  <small className="font-thin opacity-70">
                    last updated at:{" "}
                    {dayjs(props.assignment.updated_at).format(
                      "DD MMM YYYY HH:mm"
                    )}
                  </small>
                </div>
              </ModalHeader>
              <Divider />
              <ModalBody>
                <div>
                  <small>
                    {props.assignment.files?.length} files attached.
                  </small>
                </div>
                <div>
                  <>
                    {props.assignment.files.length > 0 ? (
                      <div className="flex flex-wrap gap-4">
                        {props.assignment.files.map((file) => (
                          <FileCard
                            showCloseButton={false}
                            isSelected={false}
                            key={file.id}
                            file={file}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-1/4">
                          <SVG2 />
                        </div>
                        <small className="text-xs mt-4">
                          No file presented.
                        </small>
                      </div>
                    )}
                  </>
                </div>
                {props.assignment.description?.length > 0 && (
                  <div>
                    <small>Description</small>
                    <Textarea readOnly value={props.assignment.description} />
                  </div>
                )}
                <Divider className="my-4" />
                <div>
                  <small>Score</small>
                  <Input
                    {...register("score", {
                      required: "Score is required",
                      min: {
                        value: 0,
                        message: "Score must be greater than 0 or equal to 0",
                      },
                      max: {
                        value: props.classwork.score,
                        message: `Score must be less than ${props.classwork.score} or equal to ${props.classwork.score}`,
                      },
                    })}
                    defaultValue={
                      isGraded ? props.assignment.grade?.grade?.toString() : ""
                    }
                    errorMessage={errors.score?.message}
                    min={0}
                    max={props.classwork.score}
                    type="number"
                    endContent={
                      <div className="text-default-500">
                        /{props.classwork.score}
                      </div>
                    }
                  />
                </div>
                <div>
                  <small>Comment</small>
                  <Textarea
                    {...register("comment", { required: false })}
                    defaultValue={
                      isGraded ? props.assignment.grade.comment : ""
                    }
                    placeholder="Optional"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={
                    createGradeMutation.isLoading ||
                    updateGradeMutation.isLoading
                  }
                  variant="light"
                  onClick={props.onClose}
                >
                  Close
                </Button>
                {isGraded ? (
                  <Button
                    isLoading={updateGradeMutation.isLoading}
                    onClick={handleSubmit(onUpdate)}
                    color="primary"
                  >
                    Update grade
                  </Button>
                ) : (
                  <Button
                    isLoading={createGradeMutation.isLoading}
                    onClick={handleSubmit(onSubmit)}
                    color="primary"
                  >
                    Submit grade
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
