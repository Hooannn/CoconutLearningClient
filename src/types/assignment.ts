import { Classwork, File, IUser } from ".";

export interface Assignment {
  classwork: Classwork;
  author: IUser;
  files: File[];
  description?: string;
  score?: number;
  submitted: boolean;
}
