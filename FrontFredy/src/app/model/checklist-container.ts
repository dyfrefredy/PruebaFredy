import { ChecklistContainerAnswer } from "./checklist-container-answer";

export class ChecklistContainer {
    id:Number;
    shipmentTypeId:Number;
    remark:String;
    createdUserId: Number;
    checklistContainerAnswer:ChecklistContainerAnswer[];
  }
  