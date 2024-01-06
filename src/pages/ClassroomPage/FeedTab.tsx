import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Link,
  Tooltip,
} from "@nextui-org/react";
import { Classroom } from "../../types/classroom";
import toast from "react-hot-toast";
import { GrPowerReset } from "react-icons/gr";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosIns from "../../hooks/useAxiosIns";
import { onError } from "../../utils/error-handlers";
import { IResponseData } from "../../types";
import useAuthStore from "../../stores/auth";
import { AiOutlineUser } from "react-icons/ai";
import SVG1 from "../../components/SVG1";

export default function FeedTab(props: {
  classroom: Classroom;
  isOwner: boolean;
  isProvider: boolean;
}) {
  const axios = useAxiosIns();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const resetInviteCodeMutation = useMutation({
    mutationFn: () =>
      axios.post<IResponseData<unknown>>(
        `/api/v1/classrooms/${props.classroom.id}/class_code/reset`
      ),
    onSuccess: (data) => {
      toast.success(data.data.message || "Reset successfully");
      queryClient.invalidateQueries(["fetch/classroom/id", props.classroom.id]);
    },
    onError,
  });
  return (
    <div className="flex flex-col gap-4 items-center max-w-[980px] mx-auto">
      <Card className="w-full h-[250px]" shadow="sm">
        <CardHeader className="absolute z-10 top-1 flex-col items-start justify-end h-full p-5">
          <p className="text-small text-white/80 font-bold">
            {props.classroom.description}
          </p>
          <h4 className="text-white font-medium text-2xl">
            {props.classroom.name}
          </h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src={props.classroom.coverImageUrl}
        />
      </Card>
      <div className="flex gap-4 w-full">
        <div className="flex flex-col gap-4 w-1/4">
          <Card shadow="sm">
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="text-small font-semibold">Invite code</div>
                <Tooltip content="Reset invite code">
                  <Button
                    isLoading={resetInviteCodeMutation.isLoading}
                    onClick={() => {
                      resetInviteCodeMutation.mutate();
                    }}
                    radius="full"
                    variant="light"
                    isIconOnly
                    size="sm"
                  >
                    <GrPowerReset size={14} />
                  </Button>
                </Tooltip>
              </div>

              <Link
                onClick={() => {
                  navigator.clipboard
                    .writeText(props.classroom.inviteCode)
                    .then(() => {
                      toast.success("Copied invite code");
                    })
                    .catch((err) => {
                      toast.error(
                        "Error while copying invite code " + err?.message
                      );
                    });
                }}
                className="cursor-pointer"
                size="lg"
              >
                <span className="text-xl font-bolder">
                  {props.classroom.inviteCode}
                </span>
              </Link>
            </CardBody>
          </Card>
          <Card shadow="sm">
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="text-small font-semibold">Upcoming</div>
              </div>
              <small className="my-2">There are no assignments due</small>
              <Button size="sm" color="primary" variant="light">
                <strong>See all</strong>
              </Button>
            </CardBody>
          </Card>
        </div>
        <div className="flex flex-col gap-4 w-3/4">
          <Card shadow="sm" isPressable>
            <CardBody>
              <div className="px-2 flex gap-4 items-center">
                <Avatar
                  src={user?.avatar_url}
                  fallback={
                    <AiOutlineUser
                      className="w-6 h-6 text-default-500"
                      fill="currentColor"
                      size={20}
                    />
                  }
                  showFallback
                ></Avatar>
                <div className="text-small hover:text-primary text-gray-500 transition">
                  Announce something to your class
                </div>
              </div>
            </CardBody>
          </Card>
          <Card shadow="sm">
            <CardBody>
              <div className="flex gap-4 items-center p-4">
                <div className="w-60">
                  <SVG1 />
                </div>
                <div>
                  <h3 className="text-lg text-primary font-bold">
                    {props.isProvider
                      ? "This is where you communicate with your class"
                      : "This is where you can see updates about this class"}
                  </h3>
                  <div className="text-sm">
                    {props.isProvider
                      ? "Use the feed to make announcements, post assignments, and answer student questions"
                      : "Use the feed to interact with people in the classroom and check for announcements"}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
