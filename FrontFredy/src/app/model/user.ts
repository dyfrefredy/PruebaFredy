import { ExternalUserGroup } from "./external-user-group";
import { UserCtsDetail } from "./user-cts-detail";
import { UserStation } from "./user-station";

export class User {
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
  userLoginId: Number;
  externalUserGroup: ExternalUserGroup[];
}
