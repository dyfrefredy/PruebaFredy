import { UserCtsDetail } from "./user-cts-detail";
import { UserStation } from "./user-station";

export class ExternalUser {
  id: number;
  countryId: number;
  countryDescription: string;
  cityId: number;
  cityDescription: number;
  stateId: number;
  stateDescription: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  userTypeId: number;
  termsConditions: boolean;
  active: boolean
  userCtsDetail: UserCtsDetail;
  userStation: UserStation[];
  companyName: string;
  companyTypeId: number;
  iataCode: string;
  cassCode: string;
  address: string;
  postalCode: number;
  phoneNumber: number;
  mobileNumber: string;
  fax: string;
}
