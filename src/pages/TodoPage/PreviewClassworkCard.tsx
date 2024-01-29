import { Button, Card, CardBody } from "@nextui-org/react";
import { Classwork, ClassworkType } from "../../types";
import { AiOutlineFileText, AiOutlineBook } from "react-icons/ai";
import dayjs from "../../libs/dayjs";
import { useNavigate } from "react-router-dom";
export default function PreviewClassworkCard({
  classwork,
  isProvider = false,
}: {
  classwork: Classwork;
  isProvider?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className="p-1 w-full">
      <Card
        isPressable
        onPress={() => {
          if (isProvider) {
            navigate(
              `/classroom/${classwork.classroom.id}/classwork/${classwork.id}?tab=student_assignments`
            );
            return;
          }
          navigate(
            `/classroom/${classwork.classroom.id}/classwork/${classwork.id}`
          );
        }}
        shadow="sm"
        radius="sm"
        className="w-full"
      >
        <CardBody>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                className="opacity-100"
                color="primary"
                size="sm"
                isDisabled
                radius="full"
              >
                {classwork.type === ClassworkType.EXAM ? (
                  <AiOutlineFileText size={18} />
                ) : (
                  <AiOutlineBook size={18} />
                )}
              </Button>
              <div className="text-sm">
                <div>{classwork.title}</div>
                <small className="text-xs opacity-70">
                  {classwork.classroom.name}
                </small>
                {isProvider && (
                  <div className="font-bold text-yellow-600">
                    {classwork.deadline && (
                      <small>Due {dayjs(classwork.deadline).fromNow()}</small>
                    )}
                  </div>
                )}
              </div>
            </div>
            {isProvider && (
              <div className="flex items-center">
                <div className="flex flex-col w-20">
                  <div className="text-lg">
                    {classwork.assignments?.filter((a) => a.submitted).length ||
                      0}
                  </div>
                  <small className="opacity-60 text-xs">Submitted</small>
                </div>
                <div className="flex flex-col w-20">
                  <div className="text-lg">{classwork.assignees.length}</div>
                  <small className="opacity-60 text-xs">Assigned</small>
                </div>
                <div className="flex flex-col w-20">
                  <div className="text-lg">
                    {classwork.assignments?.filter((a) => a.grade !== null)
                      .length || 0}
                  </div>
                  <small className="opacity-60 text-xs">Graded</small>
                </div>
              </div>
            )}
            {!isProvider && (
              <div className="font-bold text-yellow-600">
                {classwork.deadline && (
                  <small>Due {dayjs(classwork.deadline).fromNow()}</small>
                )}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
