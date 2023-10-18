import { SpecialService } from "./special-service";
import { State } from "./state";
import { Station } from "./station";

export class SpecialServiceRoute {
    id: Number;
    specialServiceId: Number;
    stationDepartureId: Number;
    stationArrivalId: Number;
    flight: Number;
    dateFlight: Date;
    userCreatedId: Number;
    userUpdateId: Number;
    createdDate: Date;
    updatedDate: Date;
    stationDeparture: Station;
    stationArrival: Station;
    specialService:SpecialService;
}
