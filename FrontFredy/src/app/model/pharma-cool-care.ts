import { ChecklistContainer } from "./checklist-container";
import { PharmaCoolCareDetail } from "./pharma-cool-care-detail";

export class PharmaCoolCare {
  id: Number;
  container: String;
  minTemp: Number;
  maxTemp: Number;
  setTemp: Number;
  voltage: Number;
  temperature: Number;
  userId: Number;
  waybillStatusId: Number;
  createdDate:any;
  pharmaCoolCareDetail: PharmaCoolCareDetail;
  checklistContainer: ChecklistContainer[];
}

export class PharmaCoolCareView {
  container: String;
  setTemp: Number;
  voltage: Number;
  temperature: Number;
}
