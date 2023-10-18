import { SpecialServiceContainer } from "./special-service-container";
import { SpecialServiceCurrentState } from "./special-service-current-state";
import { SpecialServiceRoute } from "./special-service-route";
import { SpecialServiceType } from "./special-service-type";
import { Station } from "./station";

export class SpecialService {
    id: Number;
    repositioningId:Number;
    specialServiceTypeId: Number;
    stationOriginId: Number;
    stationDestinyId: Number;
    awb: String;
    arrivalDate: Date;
    userCreatedId: Number;
    userUpdateId: Number;
    createdDate: Date;
    updatedDate: Date;
    active: Boolean;
    specialServiceTypeDescription:String;
    stationOriginDescription:String;
    stationDestinyDescription:String;
    specialServiceCurrentState:SpecialServiceCurrentState;
    specialServiceRoutes: SpecialServiceRoute[];
    specialServiceContainers:SpecialServiceContainer[];
}
