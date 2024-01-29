import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  DatesSetArg,
  EventClickArg,
  EventSourceInput,
} from "@fullcalendar/core";
import useAuthStore from "../../stores/auth";
import { useQuery } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData, Classwork } from "../../types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
export default function CalendarPage() {
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const onDatesSet = (e: DatesSetArg) => {
    setStartDate(e.startStr);
    setEndDate(e.endStr);
  };
  const { classroomId } = useParams();

  const navigate = useNavigate();
  const { user } = useAuthStore();
  const axios = useAxiosIns();

  const getCalendarClasswork = useQuery({
    queryKey: [
      "fetch/classwork/calendar",
      user?.id,
      startDate,
      endDate,
      classroomId,
    ],
    queryFn: () => {
      if (!user?.id || !startDate || !endDate) return null;
      if (classroomId)
        return axios.get<IResponseData<Classwork[]>>(
          `/api/v1/classwork/${classroomId}/calendar`,
          {
            params: {
              startDate,
              endDate,
            },
          }
        );
      return axios.get<IResponseData<Classwork[]>>(
        `/api/v1/classwork/calendar`,
        {
          params: {
            startDate,
            endDate,
          },
        }
      );
    },
    refetchOnWindowFocus: false,
  });

  const calendarClassworks = getCalendarClasswork.data?.data?.data || [];

  const todoClassworks = calendarClassworks.filter(
    (c) => c.assignments === null || c.assignments === undefined
  );

  const reviewClassworks = calendarClassworks.filter(
    (c) => !todoClassworks.map((c) => c.id).includes(c.id)
  );

  const onEventClick = (e: EventClickArg) => {
    const classwork = calendarClassworks.find((c) => c.id === e.event.id);
    if (!classwork) return;
    if (e.event.constraint === "todo") {
      navigate(
        `/classroom/${classwork.classroom.id}/classwork/${classwork.id}`
      );
    } else if (e.event.constraint === "review") {
      navigate(
        `/classroom/${classwork.classroom.id}/classwork/${classwork.id}?tab=student_assignments`
      );
    }
  };

  const events: EventSourceInput = [
    ...todoClassworks.map((c) => ({
      id: c.id,
      title: c.title,
      constraint: "todo",
      date: c.deadline,
      backgroundColor: "#F87171",
    })),
    ...reviewClassworks.map((c) => ({
      id: c.id,
      constraint: "review",
      title: c.title,
      date: c.deadline,
      backgroundColor: "#60A5FA",
    })),
  ];

  return (
    <div className="py-4 px-2 max-w-[980px] mx-auto">
      {getCalendarClasswork.isLoading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-10 z-10 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      <FullCalendar
        initialView="dayGridMonth"
        weekends={false}
        datesSet={onDatesSet}
        height={"calc(100dvh - 82px - 42px - 16px)"}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          list: "List",
        }}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        eventClick={onEventClick}
        events={events}
      />
    </div>
  );
}
