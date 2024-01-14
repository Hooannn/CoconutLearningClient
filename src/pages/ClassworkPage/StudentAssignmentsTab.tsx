import { Button } from "@nextui-org/react";
import { AiOutlineFileText } from "react-icons/ai";

export default function StudentAssignmentsTab(props: {
  classroom: Classroom;
  classwork: Classwork;
  isProvider: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 items-start max-w-[980px] mx-auto h-full">
      <div className="flex gap-2">
        <div>
          <Button
            isIconOnly
            className="opacity-100"
            color="primary"
            size="lg"
            isDisabled
            radius="full"
          >
            <AiOutlineFileText size={24} />
          </Button>
        </div>
        <div></div>
      </div>
    </div>
  );
}
