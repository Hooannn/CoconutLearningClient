import { useQuery } from "@tanstack/react-query";
import { IResponseData, Classwork } from "../../types";
import useAuthStore from "../../stores/auth";
import useAxiosIns from "../../hooks/useAxiosIns";
import SVG4 from "../../components/SVG4";
import useClassroomStore from "../../stores/classroom";
import {
  Accordion,
  AccordionItem,
  Divider,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { useState } from "react";
import dayjs from "../../libs/dayjs";
import PreviewClassworkCard from "../TodoPage/PreviewClassworkCard";

export default function NeedReviewPage() {
  const { user } = useAuthStore();
  const axios = useAxiosIns();
  const getNeedReviewClasswork = useQuery({
    queryKey: ["fetch/classwork/need-review", user?.id],
    queryFn: () =>
      axios.get<IResponseData<Classwork[]>>(`/api/v1/classwork/need-review`),
    refetchOnWindowFocus: false,
  });
  const { teachingClassrooms } = useClassroomStore();

  const getClassrooms = () => [
    { id: "ALL", name: "All" },
    ...teachingClassrooms,
  ];
  const [selectedClassroom, setSelectedClassroom] = useState<string>("ALL");
  const needReviewClassworks = getNeedReviewClasswork.data?.data?.data || [];

  const getClassworks = () =>
    needReviewClassworks.filter(
      (c) => c.classroom.id == selectedClassroom || selectedClassroom == "ALL"
    );

  const noDeadlineClassworks = getClassworks().filter((c) => !c.deadline);
  const deadlinePassedClassworks = getClassworks().filter((c) =>
    dayjs(c.deadline).isBefore(dayjs())
  );
  const doingClassworks = getClassworks().filter(
    (c) =>
      !noDeadlineClassworks.map((c) => c.id).includes(c.id) &&
      !deadlinePassedClassworks.map((c) => c.id).includes(c.id)
  );

  const accordions = [
    {
      key: "1",
      title: "No deadline",
      classworks: noDeadlineClassworks,
    },
    {
      key: "2",
      title: "Doing",
      classworks: doingClassworks,
    },
    {
      key: "3",
      title: "Deadline passed",
      classworks: deadlinePassedClassworks,
    },
  ];
  return (
    <div className="flex flex-col gap-4 items-start max-w-[980px] mx-auto h-full">
      {getNeedReviewClasswork.isLoading ? (
        <div className="w-full h-24 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          {teachingClassrooms.length > 0 ? (
            <>
              <div className="w-1/3 mt-3">
                <Select
                  items={getClassrooms()}
                  placeholder="Select a classroom"
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
                            isProvider
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
          ) : (
            <div className="w-full h-96 flex flex-col items-center justify-center">
              <div className="w-1/4">
                <SVG4 />
              </div>
              <div>
                <small>Good! You have nothing to do.</small>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
