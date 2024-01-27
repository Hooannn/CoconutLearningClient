import {
  Accordion,
  AccordionItem,
  Divider,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Classwork } from "../../types";
import { Classroom } from "../../types/classroom";
import { useState } from "react";
import dayjs from "../../libs/dayjs";
import PreviewClassworkCard from "./PreviewClassworkCard";
export default function AssignTab(props: {
  classworks: Classwork[];
  registeredClassrooms: Classroom[];
}) {
  const getClassrooms = () => [
    { id: "ALL", name: "All" },
    ...props.registeredClassrooms,
  ];
  const [selectedClassroom, setSelectedClassroom] = useState<string>("ALL");

  const getClassworks = () =>
    props.classworks.filter(
      (c) => c.classroom.id == selectedClassroom || selectedClassroom == "ALL"
    );

  const noDeadlineClassworks = getClassworks().filter((c) => !c.deadline);
  const upcomingClassworks = getClassworks().filter((c) =>
    dayjs(c.deadline).isBefore(dayjs().add(1, "week"))
  );

  const laterClassworks = getClassworks().filter(
    (c) =>
      !noDeadlineClassworks.map((c) => c.id).includes(c.id) &&
      !upcomingClassworks.map((c) => c.id).includes(c.id)
  );

  const accordions = [
    {
      key: "1",
      title: "No deadline",
      classworks: noDeadlineClassworks,
    },
    {
      key: "2",
      title: "Upcoming",
      classworks: upcomingClassworks,
    },
    {
      key: "3",
      title: "Later",
      classworks: laterClassworks,
    },
  ];
  return (
    <div className="flex flex-col gap-4 items-start max-w-[980px] mx-auto h-full">
      {props.registeredClassrooms.length > 0 && (
        <>
          <div className="w-1/3">
            <Select
              items={getClassrooms()}
              placeholder="Select a category"
              variant="bordered"
              color="primary"
              disallowEmptySelection
              selectedKeys={[selectedClassroom]}
              onSelectionChange={(selection) => {
                const keys = Array.from(selection) as string[];
                setSelectedClassroom(keys[0]?.toString());
              }}
            >
              {(category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              )}
            </Select>
          </div>

          <Divider className="my-1" />

          <Accordion
            selectionMode="multiple"
            defaultExpandedKeys={
              accordions[1].classworks.length > 0 ? ["2"] : []
            }
            showDivider={false}
          >
            {accordions.map((accordion) => (
              <AccordionItem
                key={accordion.key}
                aria-label={accordion.title}
                isDisabled={accordion.classworks.length == 0}
                title={
                  <div className="flex items-center justify-between w-full">
                    <div>{accordion.title}</div>
                    <div className="text-sm text-primary">
                      {accordion.classworks.length}
                    </div>
                  </div>
                }
              >
                {
                  <div className="flex flex-col gap-2">
                    {accordion.classworks.map((c) => (
                      <PreviewClassworkCard
                        classwork={c}
                        key={c.id}
                      ></PreviewClassworkCard>
                    ))}
                  </div>
                }
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
    </div>
  );
}
