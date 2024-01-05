import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosIns from "../hooks/useAxiosIns";
import { GetQuery, IResponseData } from "../types";
import { Classroom } from "../types/classroom";
import useClassroomStore from "../stores/classroom";

const useClassrooms = () => {
  const axios = useAxiosIns();
  const [query, setQuery] = useState<GetQuery>({
    offset: 0,
    limit: 5,
  });

  const { setRegisteredClassrooms, setTeachingClassrooms } =
    useClassroomStore();

  const getTeachingClassroomsQuery = useQuery({
    queryKey: ["fetch/classrooms/teaching", query],
    queryFn: () =>
      axios.get<IResponseData<Classroom[]>>(`/api/v1/classrooms/teaching`, {
        params: query,
      }),
    refetchOnWindowFocus: false,
    onSuccess(data) {
      setTeachingClassrooms(data.data?.data || []);
    },
  });

  const getRegisteredClassroomsQuery = useQuery({
    queryKey: ["fetch/classrooms/registered", query],
    queryFn: () =>
      axios.get<IResponseData<Classroom[]>>(`/api/v1/classrooms/registered`, {
        params: query,
      }),
    refetchOnWindowFocus: false,
    onSuccess(data) {
      setRegisteredClassrooms(data.data?.data || []);
    },
  });

  const isLoading =
    getRegisteredClassroomsQuery.isLoading ||
    getTeachingClassroomsQuery.isLoading;

  return {
    setQuery,
    getTeachingClassroomsQuery,
    getRegisteredClassroomsQuery,
    isLoading,
  };
};

export default useClassrooms;
