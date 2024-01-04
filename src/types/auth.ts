export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  PROVIDER = "PROVIDER",
}

export interface IUser {
  id: string;
  email: string;
  first_name: string;
  fullName: string;
  last_name: string;
  avatar_url?: string;
  verified: boolean;
  enabled: boolean;
  role: Role[];
}

export interface Credentials {
  access_token: string;
  refresh_token: string;
}
