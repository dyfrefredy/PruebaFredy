import { Station } from "./station";

export class Positioning {
    id: Number;
    originStationId: Number;
    destinationStationId: Number;

    destinationStation: Station;
    originStation: Station;
}
