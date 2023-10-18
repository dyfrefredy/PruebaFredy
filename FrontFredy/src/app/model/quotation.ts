import { City } from "./city";
import { QuotationAsignment } from "./quotation-asignment";
import { QuotationStatus } from "./quotation-status";
import { QuotationAnimal } from "./quotationAnimal";
import { QuoteDetails } from "./quote-details";
import { Station } from "./station";
import { UsingPerishable } from "./using-perishable";
import { UsingPharma } from "./using-pharma";

export class Quotation {
  id: number;
  name: String;
  email: String;
  originStationId: Number;
  originStationDesc: String;
  destinationStationId: Number;
  destinationStationDesc: String;
  customerTypeId: Number;
  customerType: String;
  numberPieces: Number;
  description: String;
  creationDate: Date;
  creationDateStart: Date;
  creationDateEnd: Date;
  loadTypeId: Number;
  loadType: String;
  removable: String;
  grossWeight: Number;
  volumetricWeight: Number;
  languageId: Number;
  company: String;
  status: number;
  chargableWeight: number;
  creationDateTimeZone: any;
  originStationName : String;
  userCreatedId: Number;

  quotationAsignment: QuotationAsignment;
  quotationStatus: QuotationStatus;
  originStation: Station;
  destinationStation: Station;
  customerQuoteId :string;
  optionalEmail :string;
  quoteDetails: QuoteDetails[];
  quotationAnimal :QuotationAnimal;
  usingPerishable: UsingPerishable;
  usingPharma: UsingPharma;
}

