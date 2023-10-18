import { User } from "./user";

export class QuotationStatus {
  id: Number;
  comments: String;
  rate: Number;
  status:String;
  creationDate: Date;
  creationUser: User;
  description:String;
  quotationId : Number;
  rejectedType : String;
  stateId:Number;
}
