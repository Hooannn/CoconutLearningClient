import { useQuery } from "@tanstack/react-query";
import {
  Classwork,
  ClassworkCategory,
  ClassworkType,
  IResponseData,
} from "../../types";
import { useParams, useSearchParams } from "react-router-dom";
import useAxiosIns from "../../hooks/useAxiosIns";
import { Spinner, Tab, Tabs } from "@nextui-org/react";
import { Classroom } from "../../types/classroom";
import useAuthStore from "../../stores/auth";
import NotFound from "../../components/NotFound";
import DetailsTab from "./DetailsTab";
import StudentAssignmentsTab from "./StudentAssignmentsTab";
import { useEffect, useState } from "react";

export default function ClassworkPage() {
  const { classroomId, classworkId } = useParams();
  const axios = useAxiosIns();
  const getClassworkCategoriesQuery = useQuery({
    queryKey: ["fetch/classwork_categories/classroom", classroomId],
    queryFn: () =>
      axios.get<IResponseData<ClassworkCategory[]>>(
        `/api/v1/classwork/${classroomId}/categories`
      ),
    refetchOnWindowFocus: false,
  });
  const getClassworkQuery = useQuery({
    queryKey: ["fetch/classwork/details", classroomId, classworkId],
    queryFn: () =>
      axios.get<IResponseData<Classwork>>(
        `/api/v1/classwork/${classroomId}/${classworkId}`
      ),
    refetchOnWindowFocus: false,
  });
  const getClassroomQuery = useQuery({
    queryKey: ["fetch/classroom/id", classroomId],
    refetchOnWindowFocus: false,
    queryFn: () =>
      axios.get<IResponseData<Classroom>>(`/api/v1/classrooms/${classroomId}`),
  });
  const { user } = useAuthStore();
  const classworkCategories =
    getClassworkCategoriesQuery.data?.data?.data || undefined;
  const classroom = getClassroomQuery.data?.data?.data || undefined;
  const classwork = getClassworkQuery.data?.data?.data || undefined;
  const isOwner = classroom?.owner.id === user?.id;
  const isProvider =
    classroom?.providers.some((p) => p.id === user?.id) || isOwner;

  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState("details");

  useEffect(() => {
    const tab = searchParams.get("tab") ?? "details";
    setTab(tab);
  }, [searchParams]);
  return (
    <>
      {getClassworkQuery.isLoading ||
      getClassroomQuery.isLoading ||
      getClassworkCategoriesQuery.isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div>
          <>
            {classroom === undefined || classwork === undefined ? (
              <NotFound
                text={
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (getClassroomQuery.error as any)?.response?.data?.message ||
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (getClassworkQuery.error as any)?.response?.data?.message ||
                  null
                }
              />
            ) : (
              <>
                {isProvider && classwork.type === ClassworkType.EXAM ? (
                  <Tabs
                    selectedKey={tab}
                    onSelectionChange={(key) => {
                      if (key == "details") {
                        searchParams.delete("tab");
                      } else {
                        searchParams.set("tab", key.toString());
                      }
                      setSearchParams(searchParams);
                    }}
                    color="primary"
                    variant="underlined"
                    className="w-full"
                    classNames={{
                      tabList:
                        "w-full relative rounded-none p-0 border-b border-divider h-12",
                      tab: "w-auto px-8 h-full font-semibold text-sm",
                    }}
                  >
                    <Tab
                      key="details"
                      title={
                        <div className="flex items-center space-x-2">
                          <span>Details</span>
                        </div>
                      }
                    >
                      <DetailsTab
                        classroom={classroom}
                        classwork={classwork}
                        classworkCategories={classworkCategories}
                        isProvider={isProvider}
                      />
                    </Tab>
                    <Tab
                      key="student_assignments"
                      title={
                        <div className="flex items-center space-x-2">
                          <span>Students assignment</span>
                        </div>
                      }
                    >
                      <StudentAssignmentsTab
                        classroom={classroom}
                        classwork={classwork}
                        isProvider={isProvider}
                      />
                    </Tab>
                  </Tabs>
                ) : (
                  <div className="pt-3">
                    <DetailsTab
                      classroom={classroom}
                      classwork={classwork}
                      isProvider={isProvider}
                      classworkCategories={classworkCategories}
                    />
                  </div>
                )}
              </>
            )}
          </>
        </div>
      )}
    </>
  );
}
