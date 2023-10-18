export class ReportClaim {
  createdInitDate?: Date;
  formalInitDate?: Date;
  createdEndDate?: Date;
  formalEndDate?: Date;
  shipmentPrefix: number;
  masterDocumentNumber: number
  claimType: number;
  claimReason: number;
  delivered: boolean;
  claimStatus: Number;
  claimReasonCode: string;
}
