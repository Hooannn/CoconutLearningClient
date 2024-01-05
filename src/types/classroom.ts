import { IUser } from ".";

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
  invitations: { id: string; email: string }[];
}
