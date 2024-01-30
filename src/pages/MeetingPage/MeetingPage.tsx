import useAuthStore from "../../stores/auth";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { IResponseData } from "../../types";
import useAxiosIns from "../../hooks/useAxiosIns";
import { useQuery } from "@tanstack/react-query";
import { Button, Image, Spinner } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { BsChevronLeft } from "react-icons/bs";
export default function MeetingPage() {
  const { user } = useAuthStore();
  const axios = useAxiosIns();
  const { meetingId } = useParams();
  const getTokenQuery = useQuery({
    queryKey: ["fetch/meeting/token/meetingId", user?.id, meetingId],
    queryFn: () =>
      axios.get<IResponseData<string>>(`/api/v1/meeting/token/${meetingId}`),
    refetchOnWindowFocus: false,
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        err?.response?.data?.message || err.message || "Unknown Error"
      );
    },
  });

  const token = getTokenQuery.data?.data?.data;
  const navigate = useNavigate();

  const renderSpinner = () => (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
  return (
    <div className="py-4 px-2 flex flex-col gap-2 items-center mx-auto">
      <div
        className="w-full"
        style={{ height: "calc(100dvh - 82px - 42px - 42px - 42px)" }}
      >
        <div>
          <Button
            variant="light"
            size="lg"
            className="mb-2"
            onClick={() => {
              navigate(-1);
            }}
          >
            <BsChevronLeft />
            Back
          </Button>
        </div>
        {getTokenQuery.isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {token ? (
              <>
                <JaaSMeeting
                  appId="vpaas-magic-cookie-5e1bea7efc554c97966b18a84fb92b44"
                  roomName={meetingId as string}
                  jwt={token}
                  configOverwrite={{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: true,
                    startScreenSharing: true,
                    enableEmailInStats: false,
                  }}
                  spinner={renderSpinner}
                  interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                  }}
                  getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = "100%";
                    iframeRef.style.width = "100%";
                    iframeRef.style.borderRadius = "12px !important";
                  }}
                  onReadyToClose={() => {
                    navigate(-1);
                  }}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 h-full w-full">
                <Image src="/8401.jpg" className="w-2/5 mx-auto" />
                <small className="text-muted-foreground">
                  {getTokenQuery.error?.response?.data?.message ||
                    getTokenQuery.error?.message ||
                    "Not found."}
                </small>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
