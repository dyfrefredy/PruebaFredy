import { User } from "./user";

export class FileInResume {
  id: Number;
  fileName: string;
  mawbPrefix: Number;
  mawbDocumentNumber: Number;
  fileResumeStatusId: Number;
  stateId: Number;
  createUserId: Number;
  active: boolean;
  rolId: Number;
  createDate: Date;
  userCreate: User;
  companyId: Number;
  createDateStart: Date;
  createDateEnd: Date;
}
