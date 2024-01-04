import type { IResponseData } from "../types";
import type { AxiosError } from "axios";
import { toast } from "react-hot-toast";
export const onError = (error: Error) => {
  toast.error(
    (
      error as AxiosError<IResponseData<unknown>>
    ).response?.data?.message?.toString() || error.message
  );
};
