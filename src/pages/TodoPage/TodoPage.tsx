import { useQuery } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { Classwork, IResponseData } from "../../types";
import useAuthStore from "../../stores/auth";
import { Tabs, Tab, Spinner } from "@nextui-org/react";
import DoneTab from "./DoneTab";
import AssignTab from "./AssignTab";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useClassroomStore from "../../stores/classroom";

export default function TodoPage() {
  const axios = useAxiosIns();
  const { user } = useAuthStore();
  const getTodoClasswork = useQuery({
    queryKey: ["fetch/classwork/todo", user?.id],
    queryFn: () =>
      axios.get<IResponseData<Classwork[]>>(`/api/v1/classwork/todo`),
    refetchOnWindowFocus: false,
  });

  const getDoneClasswork = useQuery({
    queryKey: ["fetch/classwork/done", user?.id],
    queryFn: () =>
      axios.get<IResponseData<Classwork[]>>(`/api/v1/classwork/done`),
    refetchOnWindowFocus: false,
  });

  const { registeredClassrooms } = useClassroomStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState("assign");

  useEffect(() => {
    const tab = searchParams.get("tab") ?? "assign";
    setTab(tab);
  }, [searchParams]);

  const todoClassworks = getTodoClasswork.data?.data?.data || [];
  const doneClassworks = getDoneClasswork.data?.data?.data || [];
  return (
    <div>
      {getTodoClasswork.isLoading ? (
        <div className="w-full h-24 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <Tabs
            selectedKey={tab}
            onSelectionChange={(key) => {
              if (key == "assign") {
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
              key="assign"
              title={
                <div className="flex items-center space-x-2">
                  <span>Assigned</span>
                </div>
              }
            >
              <AssignTab
                registeredClassrooms={registeredClassrooms}
                classworks={todoClassworks}
              />
            </Tab>
            <Tab
              key="done"
              title={
                <div className="flex items-center space-x-2">
                  <span>Done</span>
                </div>
              }
            >
              <DoneTab
                registeredClassrooms={registeredClassrooms}
                classworks={doneClassworks}
              />
            </Tab>
          </Tabs>
        </>
      )}
    </div>
  );
}
