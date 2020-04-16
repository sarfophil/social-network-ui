/** Notification Model **/
import {NotificationCode} from "./notificationcode";

export interface NotificationResponse {
  _id: string;
  message: string;
  status: boolean;
  hasViewed: boolean;
  messageType: NotificationCode;
  topic: string;
  createdDate: string;
}
