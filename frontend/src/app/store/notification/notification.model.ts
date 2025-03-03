export type NotificationContent = {
  type: NotificationType;
  message: string;
} | null;

export interface NotificationPayload<T = undefined> {
  notification: NotificationContent;
  data: T;
}

export type NotificationType = 'success' | 'error';

export const NOTIFICATION_CONFIGS_MAP: {
  [key in NotificationType]: { duration: number | undefined; panelClass: string };
} = {
  success: { duration: 1500, panelClass: 'app-notification-success' },
  error: { duration: 4000, panelClass: 'app-notification-error' },
};

export type NotificationState = {
  showing: boolean;
  notifications: NotificationContent[];
};

export const initialState: NotificationState = {
  showing: false,
  notifications: [],
};
