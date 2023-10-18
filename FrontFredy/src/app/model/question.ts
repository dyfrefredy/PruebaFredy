import { AnswerType } from "./answer-type";

export class Question {
    id: Number;
    name: String;
    active: boolean;
    answerTypeId:Number;
    answerTypeDto:AnswerType[];
  }
  