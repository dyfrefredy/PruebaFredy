import { DryIceResupply } from "./dry-ice-resupply";
import { Positioning } from "./positioning";
import { Station } from "./station";

export class Container {
    id: Number;
    usingPharmaId: Number;
    quantityContainer: Number;
    containerTypeId: Number;
    containerTypeDesc: String;
    temperatureRangeId: Number;
    temperatureRangeDesc: String;
    dryIceResupplyAnswer: String;
    positioningAnswer: String;
    repositioningAnswer: String;
    repositioningStationId: Number;

    dryIceResupply: DryIceResupply;
    positioning: Positioning;
    repositioningStation: Station;    
}
