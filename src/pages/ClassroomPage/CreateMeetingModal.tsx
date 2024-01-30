import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Classroom } from "../../types/classroom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import useAxiosIns from "../../hooks/useAxiosIns";
import { IResponseData } from "../../types";
import { onError } from "../../utils/error-handlers";
import { Meeting } from "../../types/meeting";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import dayjs from "../../libs/dayjs";
export default function CreateMeetingModal(props: {
  isOpen: boolean;
  onClose: () => void;
  classroom: Classroom;
}) {
  const [name, setName] = useState("");
  const [startAtTime, setStartAtTime] = useState("");
  const [endAtTime, setEndAtTime] = useState("");
  const [startAtDate, setStartAtDate] = useState<DateValueType>({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const [endAtDate, setEndAtDate] = useState<DateValueType>({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

  const handleStartAtDateChange = (newValue: DateValueType) => {
    setStartAtDate(newValue);
    setEndAtDate(newValue);
  };

  const handleEndAtDateChange = (newValue: DateValueType) => {
    setEndAtDate(newValue);
  };

  const isValidTime = (time: string) => dayjs(time, "HH:mm", true).isValid();

  const axios = useAxiosIns();
  const queryClient = useQueryClient();

  const createMeetingMutation = useMutation({
    mutationFn: (params: { name: string; start_at: string; end_at: string }) =>
      axios.post<IResponseData<Meeting>>(
        `/api/v1/meeting/${props.classroom.id}`,
        params
      ),
    onError,
    onSuccess(data) {
      toast.success(data.data?.message || "Created");
      queryClient.invalidateQueries([
        "fetch/meeting/classroom",
        props.classroom.id,
      ]);
    },
  });

  const create = async () => {
    if (!isValidTime(startAtTime) || !isValidTime(endAtTime)) {
      toast.error("Invalid time or missing time");
      return;
    }

    if (name.length === 0 || name.trim().length === 0) {
      toast.error("Name must not be empty");
      return;
    }

    const startAt = `${startAtDate?.startDate} ${startAtTime}`.trim();
    const endAt = `${endAtDate?.startDate} ${endAtTime}`.trim();
    let parseStartAt;
    let parseEndAt;
    try {
      const d = dayjs(startAt);
      parseStartAt = d.toISOString();
      const d1 = dayjs(endAt);
      parseEndAt = d1.toISOString();

      if (d.isAfter(d1)) {
        toast.error("Start time must be before end time");
        return;
      }

      if (d1.isBefore(dayjs())) {
        toast.error("End time must be in the future");
        return;
      }
    } catch (error) {
      toast.error("Missing time");
      return;
    }
    await createMeetingMutation.mutateAsync({
      name,
      start_at: parseStartAt,
      end_at: parseEndAt,
    });
    props.onClose();
  };

  return (
    <>
      <Modal
        hideCloseButton
        size="full"
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create meeting
              </ModalHeader>
              <ModalBody className="max-w-[980px] mx-auto w-full">
                <div className="flex flex-col gap-1">
                  <div>Name</div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={name}
                      placeholder="Meeting name"
                      className="w-full"
                      onValueChange={(v) => setName(v)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div>Start time</div>
                  <div className="flex items-center gap-2">
                    <Datepicker
                      inputClassName="relative w-full inline-flex tap-highlight-transparent shadow-sm px-3 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-unit-10 rounded-medium flex-col items-start justify-center gap-0 transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background h-14 py-2 is-filled"
                      containerClassName="relative w-full"
                      useRange={false}
                      asSingle={true}
                      value={startAtDate}
                      onChange={handleStartAtDateChange}
                    />
                    <Input
                      onClear={() => setStartAtTime("")}
                      isInvalid={
                        startAtTime.length != 0 && !isValidTime(startAtTime)
                      }
                      errorMessage={
                        isValidTime(startAtTime) || startAtTime.length == 0
                          ? null
                          : "Invalid time"
                      }
                      isClearable
                      onFocus={() => {
                        if (startAtTime.length == 0) setStartAtTime("07:00");
                      }}
                      value={startAtTime}
                      onValueChange={(v) => {
                        setStartAtTime(v);
                      }}
                      placeholder="HH:mm (optional)"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div>End time</div>
                  <div className="flex items-center gap-2">
                    <Datepicker
                      inputClassName="relative w-full inline-flex tap-highlight-transparent shadow-sm px-3 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-unit-10 rounded-medium flex-col items-start justify-center gap-0 transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background h-14 py-2 is-filled"
                      containerClassName="relative w-full"
                      useRange={false}
                      asSingle={true}
                      value={endAtDate}
                      onChange={handleEndAtDateChange}
                    />
                    <Input
                      onClear={() => setEndAtTime("")}
                      isInvalid={
                        endAtTime.length != 0 && !isValidTime(endAtTime)
                      }
                      errorMessage={
                        isValidTime(endAtTime) || endAtTime.length == 0
                          ? null
                          : "Invalid time"
                      }
                      isClearable
                      onFocus={() => {
                        if (endAtTime.length == 0) setEndAtTime("11:00");
                      }}
                      value={endAtTime}
                      onValueChange={(v) => {
                        setEndAtTime(v);
                      }}
                      placeholder="HH:mm (optional)"
                      className="w-full"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={createMeetingMutation.isLoading}
                  color="primary"
                  variant="light"
                  onPress={props.onClose}
                >
                  Close
                </Button>
                <Button
                  isLoading={createMeetingMutation.isLoading}
                  color="primary"
                  onPress={create}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
