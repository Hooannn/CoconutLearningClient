export interface Notification {
  id: string;
  title: string;
  content?: string;
  read: boolean;
  redirect_url: string;
  image_url: string;
  actions: NotificationAction[];
}

export interface NotificationAction {
  title: string;
  description: string;
  callback_url: string;
}
