import { DryIceSupply } from "./dry-ice-supply";
import { Product } from "./product";
import { WaybillStatus } from "./waybill-status";

export class GuideActive {
    id: Number;
    carrier: String;
    fitNum: Number;
    orgStationId: Number;
    brdPtStationId: Number;
    destStationId: Number;
    offPtStationId: Number;
    offPtStationIata:String;
    date: Date;
    fitPrio: String;
    docNum: String;
    pieces: Number;
    weight: Number;
    agent: String;
    manifestDesc: String;
    shc: String;
    remarks: String;
    mvtSt: String;
    productId: Number;
    productTypeId: Number;
    productInitialRange: Number;
    productFinalRange: Number;
    originRedStationId: Number;
    destinyRedStationId: Number;
    reload: Boolean;
    waybillStatus: WaybillStatus;
    product:Product;
    destinyStationName:String;
    destinyStationIata:String;
    originStationName:String;
    originStationIata:String;
    dryIceSupply: DryIceSupply;
}
