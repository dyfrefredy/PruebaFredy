import { User } from "./user";

export class AutomaticAssignmentsUser {
    id: number;
    userId: number;
    quotes: boolean;
    bookings: boolean;
    available: boolean;
    user: User;
    createdUserId: number;
    updatedUserId: number;
}
