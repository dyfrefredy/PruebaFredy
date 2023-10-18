import { PharmaCare } from "./pharma-care";
import { PharmaCoolCare } from "./pharma-cool-care";

export class WaybillStatus {
    id:Number;
    waybillRpaId:Number;
    statusId:Number;
    stationId:Number;
    userId:Number;
    updatedDate:Date;
    pharmaCares: PharmaCare[];
    pharmaCoolCares:PharmaCoolCare[];
    noDownload: Boolean;
}
