import { BookingStatus } from "./booking-status";
import { User } from "./user";

export class BookingHistoryStatus {
  id: Number;
  bookingId: Number;
  bookingStatusId: Number;
  userAssigmentId: Number;
  active: boolean;
  createdUserId: Number;
  createdDate: Date;
  updatedUserId: Number;
  updatedDate: Date;
  user: User;
  bookingStatus: BookingStatus;
}
