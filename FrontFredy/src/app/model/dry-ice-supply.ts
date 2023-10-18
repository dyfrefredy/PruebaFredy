import { Station } from "./station";
import { WaybillRpaDryIceSupply } from "./waybill-rpa-dry-ice-supply";

export class DryIceSupply {
    id: number;
    airWaybill: string;
    amountIce: Number;
    stationId: Number;
    status: string;
    dryIceSupplyCant:number;
    active:Boolean;
    station:Station;
    waybillRpaDryIceSupply: WaybillRpaDryIceSupply[];
    CreatedUserId: number;
}
