import { IUser } from ".";
import { Classroom } from "./classroom";

export interface Meeting {
  start_at: string;
  end_at: string;
  name: string;
  id: string;
  created_by: IUser;
  created_at: string;
  updated_at: string;
  classroom: Classroom;
}
