import type { AxiosResponse } from "axios";

export interface IResponseData<T> {
  data: T;
  code: number;
  message: string;
  took?: number;
  total?: number;
}

export interface Response<T> extends AxiosResponse {
  data: IResponseData<T>;
}
