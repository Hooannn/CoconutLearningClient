import { Button, Card, CardBody } from "@nextui-org/react";
import { Classwork, ClassworkType } from "../../types";
import { AiOutlineFileText, AiOutlineBook } from "react-icons/ai";
import dayjs from "../../libs/dayjs";
import { useNavigate } from "react-router-dom";
export default function PreviewClassworkCard(props: { classwork: Classwork }) {
  const navigate = useNavigate();
  return (
    <div className="p-1 w-full">
      <Card
        isPressable
        onPress={() => {
          navigate(
            `/classroom/${props.classwork.classroom.id}/classwork/${props.classwork.id}`
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
                {props.classwork.type === ClassworkType.EXAM ? (
                  <AiOutlineFileText size={18} />
                ) : (
                  <AiOutlineBook size={18} />
                )}
              </Button>
              <div className="text-sm">
                <div>{props.classwork.title}</div>
                <small className="text-xs opacity-70">
                  {props.classwork.classroom.name}
                </small>
              </div>
            </div>
            <div className="font-bold text-yellow-600">
              {props.classwork.deadline && (
                <small>Due {dayjs(props.classwork.deadline).fromNow()}</small>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
