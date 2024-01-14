import { Base, Comment, File, IUser } from ".";
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
  files: File[];
  category?: ClassworkCategory;
  author: IUser;
  comments: Comment[];
}

export interface ClassworkCategory {
  id: string;
  name: string;
}
