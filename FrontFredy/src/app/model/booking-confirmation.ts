import { BookingConfirmationLegs } from "./booking-confirmation-legs";

export class BookingConfirmation {
  id: Number;
  bookingId: Number;
  etd: string;
  eta: string;
  rate: Number;
  cutOffTime: Date;
  comments: string;
  emails: string;
  bookingConfirmationLegs: BookingConfirmationLegs[];
  createdUserId: number;
}
