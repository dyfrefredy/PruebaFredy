import { FileInResume } from "./file-in-resume";

export class FileError {
    id: Number;
    createDate: Date;
    fileInResumeId: Number;
    description: string;
    line: Number;
    fileInResume: FileInResume;
    rolId: Number;
    createDateStart: Date;
    createDateEnd: Date;
}
