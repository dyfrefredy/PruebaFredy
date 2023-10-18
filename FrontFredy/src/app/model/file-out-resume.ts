import { FileInResume } from "./file-in-resume";

export class FileOutResume {
    id: Number;
    fileName: string;
    fileResumeStatusId: Number;
    path: string;
    createDate: Date;
    fileInResume: FileInResume;
    rolId: Number;
    createDateStart: Date;
    createDateEnd: Date;
}
