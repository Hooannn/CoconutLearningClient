import { Base } from ".";

export interface Notification extends Base {
  id: string;
  title: string;
  content?: string;
  read: boolean;
  redirect_url: string;
  image_url: string;
  actions: NotificationAction[];
}

export enum ActionType {
  PRIMARY = "PRIMARY",
  DANGER = "DANGER",
  DEFAULT = "DEFAULT",
}

export interface NotificationAction {
  title: string;
  description: string;
  callback_url: string;
  type: ActionType;
}
