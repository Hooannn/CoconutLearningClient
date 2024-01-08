import { IUser } from ".";
export interface Base {
  created_at: string;
  updated_at: string;
}
export interface File extends Base {
  id: string;
  name: string;
  eTag: string;
  size: number;
  creator: IUser;
}

export interface Post extends Base {
  id: string;
  body: string;
  author: IUser;
  comments: Comment[];
  files: File[];
}

export interface Comment extends Base {
  id: string;
  body: string;
  author: IUser;
}
