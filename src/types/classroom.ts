import { IUser } from ".";
import { InviteType } from "../pages/ClassroomPage/InviteModal";

export interface Classroom {
  id: string;
  inviteCode: string;
  name: string;
  description?: string;
  room?: string;
  course?: string;
  coverImageUrl?: string;
  owner: IUser;
  providers: IUser[];
  users: IUser[];
  invitations: { id: string; email: string; type: InviteType }[];
  classwork_categories: { id: string; name: string }[];
}
