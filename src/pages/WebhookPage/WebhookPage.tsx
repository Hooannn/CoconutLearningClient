import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAxiosIns from "../../hooks/useAxiosIns";
import { onError } from "../../utils/error-handlers";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { IResponseData } from "../../types";
import { useEffect } from "react";
import { Spinner } from "@nextui-org/react";

export default function WebhookPage() {
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get("invite_code");
  const axios = useAxiosIns();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const acceptInvitation = useMutation({
    mutationFn: () =>
      axios.post<IResponseData<unknown>>(
        `/api/v1/classrooms/webhook/accept/${inviteCode}?notificationId=none`
      ),
    onError: (error: AxiosError<{ message: string }>) => {
      onError(error);
      navigate("/");
    },
    onSuccess(data) {
      toast.success(data.data?.message || "Success");
      queryClient.invalidateQueries(["fetch/classrooms/teaching"]);
      queryClient.invalidateQueries(["fetch/classrooms/registered"]);
      navigate("/");
    },
  });

  useEffect(() => {
    if (inviteCode) acceptInvitation.mutate();
  }, []);

  return (
    <div className="h-48 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
