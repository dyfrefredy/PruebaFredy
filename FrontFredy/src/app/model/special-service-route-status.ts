import { SpecialServiceRoute } from "./special-service-route";
import { StatusPharmaType } from "./status-pharma-type";

export class SpecialServiceRouteStatus {
  id:Number;
  specialServiceRouteId:Number
  statusId:Number;
  userCreatedId:Number;
  CreatedDate:any;
  specialServiceRoute:SpecialServiceRoute;
  status:StatusPharmaType;
  stationId: Number;
}
