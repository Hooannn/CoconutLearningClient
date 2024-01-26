export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  PROVIDER = "PROVIDER",
}

export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  verified: boolean;
  role: Role[];
  enabled_push_notification: boolean;
  enabled_email_notification: boolean;
}

export interface Credentials {
  access_token: string;
  refresh_token: string;
}
