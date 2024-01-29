import {
  Button,
  Divider,
  Select,
  SelectItem,
  Tooltip,
} from "@nextui-org/react";
import { AiOutlineSetting } from "react-icons/ai";
import { Classwork } from "../../types/classwork";
import { Classroom } from "../../types/classroom";
import AssignmentCard from "./AssignmentCard";
import { useState } from "react";
import SVG2 from "../../components/SVG2";

export default function StudentAssignmentsTab(props: {
  classroom: Classroom;
  classwork: Classwork;
  isProvider: boolean;
}) {
  const [selected, setSelected] = useState("ALL");

  const selections = [
    { key: "ALL", value: "All" },
    { key: "SUBMITTED", value: "Submitted" },
    { key: "UNSUBMITTED", value: "Unsubmitted" },
    { key: "GRADED", value: "Graded" },
  ];

  const assignments = props.classwork.assignments;

  const filterAssignments = (key: string) => {
    switch (key) {
      case "ALL":
        return assignments;
      case "SUBMITTED":
        return assignments?.filter((a) => a.submitted);
      case "UNSUBMITTED":
        return assignments?.filter((a) => !a.submitted);
      case "GRADED":
        return assignments?.filter((a) => a.grade !== null);
    }
  };
  return (
    <div className="flex flex-col gap-2 items-start max-w-[980px] mx-auto h-full">
      <div className="flex items-center justify-between w-full px-3">
        <div className="flex flex-col">
          <div className="font-medium text-lg">{props.classwork.title}</div>
          <h1 className="text-base">{props.classwork.score} scores</h1>
        </div>
        <Tooltip content="Setting">
          <Button isIconOnly radius="full" variant="light">
            <AiOutlineSetting size={18} />
          </Button>
        </Tooltip>
      </div>
      <Divider />
      <div className="flex flex-col items-start w-full px-3">
        <div className="flex items-center pb-5">
          <div className="flex flex-col pr-3 w-24">
            <div className="text-4xl">
              {props.classwork.assignments?.filter((a) => a.submitted).length ||
                0}
            </div>
            <small className="opacity-60 text-xs">Submitted</small>
          </div>
          <div className="flex flex-col border-l-2 border-gray px-3 w-24">
            <div className="text-4xl">{props.classwork.assignees.length}</div>
            <small className="opacity-60 text-xs">Assigned</small>
          </div>
          <div className="flex flex-col border-l-2 border-gray px-3 w-24">
            <div className="text-4xl">
              {props.classwork.assignments?.filter((a) => a.grade !== null)
                .length || 0}
            </div>
            <small className="opacity-60 text-xs">Graded</small>
          </div>
        </div>
        <div>
          <Select
            selectedKeys={[selected]}
            onSelectionChange={(selection) => {
              const keys = Array.from(selection) as string[];
              setSelected(keys[0]?.toString());
            }}
            disallowEmptySelection
            size="sm"
            className="w-36"
          >
            {selections.map((s) => (
              <SelectItem key={s.key} value={s.value}>
                {s.value}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex flex-wrap gap-4 pt-5 w-full">
          {filterAssignments(selected)?.length > 0 ? (
            <>
              {filterAssignments(selected)?.map((assignment) => (
                <AssignmentCard
                  classroom={props.classroom}
                  classwork={props.classwork}
                  assignment={assignment}
                />
              ))}
            </>
          ) : (
            <div className="h-48 mx-auto w-48 text-center pt-6">
              <SVG2 />
              <small className="opacity-60">No data.</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
