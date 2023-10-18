export class AirWaybillItinerary {
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
}
