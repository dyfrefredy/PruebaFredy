import { Station } from "./station";
import { User } from "./user";

export class UserCapacity {
    id:Number
    userName:String;
    userId:Number;
    destinationStationId: Number;
    destinationStationName: String;
    originStationId: Number;
    originStationName: String;
    allDestination :Boolean;
    active:Boolean;
    createdUserId:Number;
    orgStation: Station;
    destStation: Station;
    user: User;
  }
  