import { Classroom } from "../../types/classroom";
import useAuthStore from "../../stores/auth";
import { useEffect } from "react";
export default function MeetingTab(props: {
  classroom: Classroom;
  isOwner: boolean;
  isProvider: boolean;
}) {
  const { user } = useAuthStore();

  useEffect(() => {});
  return (
    <div className="py-4 px-2 flex flex-col gap-2 items-center mx-auto">
      <div
        className="w-full"
        style={{ height: "calc(100dvh - 82px - 42px - 42px - 42px)" }}
      >
        <iframe
          id="mirotalk-iframe"
          title="Video Conference"
          allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; autoplay"
          src={`https://sfu.mirotalk.com/join?room=${
            props.classroom.id
          }&name=${`${user?.first_name} ${user?.last_name}`}&audio=0&video=0`}
          style={{ height: "100%", width: "100%", border: "0px" }}
        ></iframe>
      </div>
    </div>
  );
}
