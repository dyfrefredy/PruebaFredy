export class AirWaybill {
    id: Number;
    carrier: String;
    fitNum: Number;
    orgStationId: Number;
    brdPtStationId: Number;
    destStationId: Number;
    offPtStationId: Number;
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
    originRedStationId: Number;
    destinyRedStationId: Number;
    reload: Boolean;

    brdPtStationName:String;
    originRedStationName:String;
    offPtStationName:String;
    destinyRedStationName:String;
    productTypeId:Number;
    principal:Boolean;
    statusName:String
    statusId:Number;
}
