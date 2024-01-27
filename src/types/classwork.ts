import { Assignment, Base, Comment, File, IUser } from ".";
import { Classroom } from "./classroom";
export enum ClassworkType {
  EXAM = "EXAM",
  LAB = "LAB",
  QUESTION = "QUESTION",
  DOCUMENT = "DOCUMENT",
}
export interface Classwork extends Base {
  id: string;
  title: string;
  description?: string;
  type: ClassworkType;
  score: number;
  deadline: Date;
  assignees: IUser[];
  assignments?: Assignment[];
  files: File[];
  category?: ClassworkCategory;
  author: IUser;
  comments: Comment[];
  classroom: Classroom;
}

export interface ClassworkCategory {
  id: string;
  name: string;
}
