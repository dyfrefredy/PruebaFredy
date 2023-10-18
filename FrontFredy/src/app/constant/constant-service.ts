import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {
  public RESPONSE_OK: string = 'OK';
  public RESPONSE_WARNING: string = 'WARNING';

  public AIRLINE_URL: string = '/airline';
  public STATION_URL: string = '/station';
  public USER_URL: string = '/user';
  public DATE_URL: string = '/holiday';
  public CONFIG_URL: string = '/configurationsTable';
  public ROL_URL: string = '/role';
  public IMPORT_MUISCA_URL: string = '/importMuisca';
  public IMPORT_SKYCHAIN_URL: string = '/importSkychain';
  public SKYCHAIN_URL: string = '/skychain';
  public FILTER_URL: string = '/getPaginationAndFilter';
  public FILTER_REPORT_URL: string = '/getReportClaim';
  public FETCH_CLAIM_URL: string = '/FetchClaims';
  public SAVE_CLAIM_URL: string = '/SaveClaims';
  public FILTER_ACTIVES_URL: string = '/getPaginationAndFilterActives';
  public FILTER_ASIGNMENT_URL: string = '/getPaginationAndFilterAsignment';
  public IMPORT_DIAN_URL: string = '/importDian1166';
  public TRAVEL_DOCUMENT_TYPE_URL: string = '/travelDocumentType';
  public AIRPORT_URL: string = '/airport';
  public COUNTRY_URL: string = '/country';
  public DOCUMENT_TYPE_URL: string = '/documentType';
  public QUOTATION_URL: string = '/quotation';
  public QUOTATIONSTATUS_URL: string = '/quotationStatus ';
  public QUOTEDETAILS_URL: string = '/quoteDetails';
  public QUOTE_ASIGNMENT_URL: string = '/quotationAsignment';
  public CUSTOMER_TYPE_URL: string = '/customerType';
  public MEASUREMENT_UNIT_URL: string = '/MeasurementUnit';
  public LOAD_ITINERARY_URL: string = '/loadItinerary';
  public CHECK_ITINERARY_URL: string = '/SearchItinerary';
  public STATE_URL: string = '/State';
  public CITY_URL: string = '/City';
  public ROLE_URL: string = '/role';
  public MODULE_URL: string = '/module';
  public ROLE_MODULE_URL: string = '/roleModule';
  public LOAD_TYPE_URL: string = '/loadType';
  public CONTAINER_TYPE_URL: string = '/containerType';
  public SHIPMENT_TYPE_URL: string = '/shipmentType';
  public QUESTION_URL: string = '/question';
  public MENU_URL: string = '/Menu';
  public PROJECT_TYPE_URL: string = '/ProjectType';
  public WAYBILL_RPA_URL: string = '/WaybillRpa';
  public WAYBILL_TRACK_AWB_URL: string = '/WaybillTrackAwb';
  public WAYBILL_STATUS_URL: string = '/WaybillStatus';
  public USER_STATION_URL: string = '/UserStation';
  public USER_TYPE_URL: string = '/userType';
  public USER_CTS_DETAIL_URL: string = '/userCtsDetail';
  public PRODUCT_URL: string = '/Product';
  public PHARMA_CARE_URL: string = '/pharmaCare';
  public PHARMA_COOL_CARE_URL: string = '/PharmaCoolCare';
  public PHARMA_COOL_CARE_DETAIL_URL: string = '/PharmaCoolCareDetail';
  public MESSAGES_URL: string = '/Message';
  public NOTIFICATION_TYPE_URL: string = '/NotificationType'
  public ESCALATION_URL: string = '/Escalation';
  public IMPORT_ESCALATION_URL: string = 'ImportEscalation';
  public CLAIM_URL: string = '/Claim';
  public REPORT_CLAIM_URL: string = '/ReportClaim';
  public REPORT_CLAIM_ASSINGMENT_URL: string = '/getReportClaimAssingment';
  public COMMODITY_URL: string = '/CargoType';
  public REASON_URL: string = '/ClaimReason';
  public ICARGO_URL: string = '/ICargo';
  public SPECIAL_SERVICE_TYPE_URL: string = '/SpecialServiceType';
  public SPECIAL_SERVICE_URL: string = '/SpecialService';
  public SPECIAL_SERVICE_STATE_URL: string = '/SpecialServiceStatus';
  public SPECIAL_SERVICE_CURRENT_STATE_URL: string = '/SpecialServiceCurrentStatus';
  public SPECIAL_SERVICE_CONTAINER_URL: string = '/SpecialServiceContainer';
  public SPECIAL_SERVICE_ROUTE_URL: string = '/SpecialServiceRoute';
  public SPECIAL_SERVICE_ROUTE_STATE_URL: string = '/SpecialServiceRouteStatus';
  public DRY_ICE_SUPPLY_URL: string = '/DryIceSupply';
  public DRY_ICE_SUPPLY_STATION_URL: string = '/DryIceSupplyStation';
  public WAYBILL_RPA_DRY_ICE_SUPPY_URL: string = '/WaybillRpaDryIceSupply';
  public LANGUAGE_URL: string = '/language';
  public ESCALATION_LEVEL_URL = '/EscalationLevel';
  public USER_CAPACITY: string = '/UserCapacity';
  public EXTERNAL_USER_URL: string = '/externalUser';
  public COMPANY_TYPE_URL: string = '/companyType';
  public EXTERNAL_USER_APPROVAL_URL: string = '/externalUserApproval';
  public SHIPPER_INFORMATION: string = '/ShipperInformation';
  public CONSIGNEE_INFORMATION: string = '/ConsigneeInformation';
  public BOOKING_URL: string = '/Booking';
  public SETTING: string = '/Setting';
  public BOOKING_HISTORY_STATUS: string = '/BookingHistoryStatus';
  public AIRCRAF_TYPE_URL: string = '/AircraftType';
  public BOOKING_CONFIRMATION_URL: string = '/BookingConfirmation';
  public AUTOMATIC_ASSIGNMENTS_USER_URL: string = '/AutomaticAssignmentsUser';
  public AUTOMATIC_ASSIGNMENT_OF_TASKS: string = '/AutomaticAssignmentOfTasks';
  public LOADED_DOCUMENT: string = '/LoadedDocument';
  public TEMPERATURE_RANGE_URL: string = '/TemperatureRange';
  public EXTERNAL_USER_GROUP_TYPE: string = '/ExternalUserGroupType';
  public EXTERNAL_USER_GROUP: string = '/ExternalUserGroup';
  public FILE_IN_RESUME_URL: string = '/FileInResume';
  public FILE_OUT_RESUME_URL: string = '/FileOutResume';
  public FILE_ERROR_URL: string = '/FileError';
  public FILE_VALIDATION_URL: string = '/FileValidations';
  public COMPANY_URL: string = '/Company';
  
  // Session storage
  public SESSION_STORAGE_ROL = "currentUserRol";
  public SESSION_STORAGE_USER = "currentUser";

  public SESSION_STORAGE_LANGUAJE = "language";

  //Languaje
  public LANGUAGE: Array<{ name: string, value: string }> = [
    {
      name: "module.language.spanish", value: "es"
    },
    {
      name: "module.language.english", value: "en"
    }
  ];

  //Booking Status
  public BookingStatusIdOnHold: number = 3;
  public BookingStatusIdCancelled: number = 6;
  public BookingStatusIdPendi: number = 1;
  public BookingStatusIdPendiCancelled: number = 5 ;


  //FileResumeStatus
  public FileResumeStatusRecibido : number = 1;
  public FileResumeStatusValidado : number = 2;
  public FileResumeStatusExitoso : number = 3;
  public FileResumeStatusError : number = 4;
  public FileResumeStatusCSV : number = 5;


  //File Type
  public FileIn : Number = 1;
  public FileOut: Number = 2;
  public FileLog: Number = 3;


  //Roles:
  public Administrador: number = 4;
}
