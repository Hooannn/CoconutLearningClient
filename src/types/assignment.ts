import { Classwork, File, IUser } from ".";

export interface Assignment {
  classwork: Classwork;
  author: IUser;
  files: File[];
  description?: string;
  submitted: boolean;
  created_at: string;
  updated_at: string;
  grade: {
    id: string;
    grade: number;
    comment?: string;
    created_at: string;
    updated_at: string;
    graded_by: IUser;
  };
}
