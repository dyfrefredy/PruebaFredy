import { ClaimDetail } from "./claim-detaill";

export class Claim {
  id: Number;
  cargoTypeId: Number;
  claimReasonId: Number;
  stationClaimId: Number;
  stationClaimCodeDest: String;
  stationClaimCode: String;
  claimReferenceNumber: Number;
  shipmentPrefix: Number
  masterDocumentNumber: Number;
  sequenceNumber: Number;
  duplicateNumber: Number;
  documentOwnerId: Number;
  claimAmount: Number;
  freightAmount: Number;
  daughterDocumentNumber: String;
  otherAmount: Number;
  totalAmount: Number;
  createdDate: Date;
  formalDate: Date;
  preeliminarDate: Date;
  updateDate: Date;
  userCreateId: Number;
  policieAccepted: boolean;
  policieAcceptedDate: Date;

  claimantName: String;
  commentary: String;
  zipCodeClaimant: String;
  claimantAddress: String;
  claimantFax: Number;
  claimantPhone: Number;
  claimantEmail: String;
  invoiceNumber: Number;
  commodityId: Number;
  selectionReason: any;
  ArrivalDate: Date;

  claimExist: boolean;


  createdInitDate: Date;
  formalInitDate: Date;
  createdEndDate: Date;
  formalEndDate: Date;


  email: String;
  language: String;


  isLoaded: boolean;


  asignadoA: String;
  descriptionSpanish: string;
  descriptionEnglish: string;
  reclamacion: String;

  userFirstName: string;
  userLastName: string;

  idLoadedDoc: number;
  loadedDate: Date;
  claimDetails: ClaimDetail[];

  insertBD :boolean;



}
