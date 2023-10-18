import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { ConstantService } from '../../../../constant/constant-service';
import { Awb } from '../../../../model/awb';
import { Claim } from '../../../../model/claim';
import { ClaimDetail } from '../../../../model/claim-detaill';
import { ClaimSummary } from '../../../../model/claim-summary';
import { FilterQuery } from '../../../../model/filter-query';
import { FlightBooking } from '../../../../model/flight-booking.model';
import { Pagination } from '../../../../model/pagination';
import { ShipmentDetailsFilter } from '../../../../model/shipment-details-filter.model';
import { User } from '../../../../model/user';
import { AuthService } from '../../../../services/auth.service';
import { TransactionService } from '../../../../services/transaction.service';
import { StorageService } from '../../../../services/storage.service';
import { ClaimAttachment } from '../../../../model/claim-attachment.model';
import moment from 'moment';

@Component({
  selector: 'app-fetch-claim',
  templateUrl: './fetch-claim.component.html',
  styleUrls: ['./fetch-claim.component.css']
})
export class FetchClaimComponent implements OnInit {
  user: User;
  claimFetchForm: FormGroup;
  claim: Claim;
  value2: number;
  claimMotive: any[];
  loading: boolean;
  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;

  awb: Awb;
  claimDetail: ClaimDetail;
  claimSummary: ClaimSummary;
  claimSummaries: ClaimSummary[];
  claimSummariesFetch: ClaimSummary[];
  claimAttachment: ClaimAttachment;

  claimAttachments: ClaimAttachment[];
  flightBooking: FlightBooking[];
  claimDialog: boolean;
  submitted: boolean;
  claimFilter: Claim;
  edit: boolean;
  selectionStation: any;
  value1: string = "AV";
  stateOptions: any[];
  sourceSystemValue: string;
  policieAccepted: boolean;
  policieAcceptedDate: string;
  fetchClaim: ShipmentDetailsFilter;
  reasonDesc: String;
  language: String;
  attachmentName: string;
  attachmentData: string;
  attachmentRemark: string;
  base64textString: string;
  reasonCode: string;
  commodityCode: string;
  monthNames: any[];
  daugtherDocumentNumber: String;

  //Atributos para la edicion del Reclamo
  id: Number;
  createdDate: Date;
  lang: string;

  //Agregar Archivo

  fileVisible: boolean;

  //Campos Remarks Invoice
  //Invoice: String;
  Remarks: String

  loadedDocument: boolean;
  isFormal: boolean;

  constructor(private fb: FormBuilder,
    private transactionService: TransactionService,
    private messageService: MessageService,
    private constantService: ConstantService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private storageService: StorageService,
    private route: Router) {

    this.monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    this.stateOptions = [{ label: 'Avianca', value: 'AV' }, { label: 'Aerounion', value: 'AEROUNION' }];

    this.user = this.authService.currentUserValue;

    this.claimFetchForm = this.fb.group({
      claimNatureId: [''],
      confirmarAwb: [''],
      airline: ['AV'],
      stationClaimId: [''],
      stationResposible: [''],
      customerClientId: [''],
      commodityCode: [''],
      claimReasonId: [''],
      claimReasonDescEsn: [''],
      claimReasonDescEng: [''],
      claimNatureDesc: [''],
      numberOfPieces: [''],
      weight: [''],
      destinationPort: [''],
      claimStationId: [''],
      claimAmount: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{1,7}(\.[0-9]{1,2})?$/)]),
      cargoAmount: ['0'],
      freightAmount: [''],
      otherAmount: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{1,7}(\.[0-9]{1,2})?$/)]),
      totalClaimAmount: new FormControl({ value: '0', disabled: true }),
      commentary: [''],
      flightArrivalDate: [''],
      flightDepartureDate: [''],
      claimDescription: [''],
      claimantName: [''],
      claimantAdress: [''],
      daughterDocumentNumber:[''],
      claimantAddress2: [''],
      claimantZipCode: [''],
      claimantTelephoneNumber: [''],
      claimantCountry: [''],
      claimantEmail: [''],
      masterDocumentNumber: [''],
      approvedAmount: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{1,7}(\.[0-9]{1,2})?$/)]),
      reasonCodeId: [''],
      attachment: [''],
      attachmentRemark: [''],
     invoiceNumber: ['']
    });
  }

  get f() {
    return this.claimFetchForm.controls;
  }

  ngOnInit(): void {
    this.claimSummariesFetch = [];
    this.claimAttachment = new ClaimAttachment();

    this.loadedDocument = false;
    this.isFormal = false;

    this.claimAttachments = [];
    this.claim = new Claim();
    this.attachmentData = "";
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
    this.claimFilter = new Claim();
    this.language = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE).lang
    this.fileVisible = true;

    this.confirmation();
  }

  hideDialog() {
    this.claimDialog = false;
    this.submitted = false;
  }

  editClaim(claimSummary: ClaimSummary) {
    this.loading = true;
    this.claimSummary = { ...claimSummary };

    this.claimDetail = new ClaimDetail();

    this.id = claimSummary.id;
    this.createdDate = claimSummary.createdDate;

    this.fetchClaim = new ShipmentDetailsFilter();
    this.fetchClaim.claimReferenceNumber = claimSummary.claimReferenceNumber.toString();
    this.fetchClaim.duplicateNumber = claimSummary.duplicateNumber.toString();
    this.fetchClaim.masterDocumentNumber = claimSummary.masterDocumentNumber.toString();
    this.fetchClaim.ownerId = claimSummary.documentOwnerId.toString();
    this.fetchClaim.sequenceNumber = claimSummary.sequenceNumber.toString();
    this.fetchClaim.shipmentPrefix = claimSummary.shipmentPrefix.toString();
    this.fetchClaim.sourceSystem = this.sourceSystemValue;

    let filter = new FilterQuery();

    filter = {
      filterDto: this.fetchClaim,
      paginationDto: null
    };

    this.transactionService.fetchClaim(environment.claimsAPI, this.constantService.ICARGO_URL, filter.filterDto).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.claimSummariesFetch = data.businessDto[0];
          this.daugtherDocumentNumber = this.claimSummaries[0].daughterDocumentNumber;
          this.claimDetail = data.businessDto[0].claimDetails[0];
          this.claimSummary.claimAttachments = data.businessDto[0].claimAttachments;

          if (this.claimSummary.claimAttachments.length != 0) {
            this.loadedDocument = true;
          }

          //Inicio Configuracion Campos Remarks Invoice
          let indice = data.businessDto[0].remarks.split('\nHAWB:');

          //this.Invoice = indice[1].trim();
          this.Remarks = indice[0].trim();
          //let invoiceCut = this.Invoice.indexOf(" ");
          //this.Invoice = this.Invoice.substring(0, invoiceCut);
          //this.f.invoiceNumber.setValue(this.Invoice);
          this.f.claimDescription.setValue(this.Remarks);

          //End

          //Inicio

          this.transactionService.GetList(environment.claimsAPI, this.constantService.CLAIM_URL, '/' + 'GetById' + '/' + this.id).subscribe(
            (data) => {
              if (data.responseDto.response === this.constantService.RESPONSE_OK) {
                this.claim = data.businessDto[0];

                if (data.businessDto[0].formalDate != null || data.businessDto[0].formalDate != "") {
                  this.isFormal = false;
                } else {
                  this.isFormal = true;
                }

                this.claimDialog = true;
              }
              else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail:
                    this.translateService.instant(data.responseDto.message, "moduleName"),
                  life: 8000,
                });
              }

              this.loading = false;
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Claim',
                detail: this.translateService.instant('module.directClaims.serviceMessages.errorConsult', "moduleName"),
                life: 8000,
              });

              this.loading = false;
            })
          //Fin
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              this.translateService.instant(data.responseDto.message, "moduleName"),
            life: 8000,
          });

          this.loading = false;
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Claim',
          detail: this.translateService.instant('module.directClaims.serviceMessages.error', "moduleName"),
          life: 8000,
        });

        this.loading = false;
      }
    )
  }

  sumValues() {


    var claimAmount = this.f.claimAmount.value == "" ? 0 : this.f.claimAmount.value;
    var approvedAmount = this.f.approvedAmount.value == "" ? 0 : this.f.approvedAmount.value;
    var otherAmount = this.f.otherAmount.value == "" ? 0 : this.f.otherAmount.value;

    this.f.totalClaimAmount.patchValue(Number(claimAmount) + Number(approvedAmount) + Number(otherAmount));

    /*  if(this.f.totalAmount!=undefined){
       this.f.totalAmount.setValue(claimAmount + approvedAmount + otherAmount);
     } */


  }



  deleteClaim(claimSummary: ClaimSummary) {
    this.claimSummary = { ...claimSummary };
    this.id = claimSummary.id;
    this.createdDate = claimSummary.createdDate;

    this.fetchClaim = new ShipmentDetailsFilter();
    this.fetchClaim.claimReferenceNumber = claimSummary.claimReferenceNumber.toString();
    this.fetchClaim.duplicateNumber = claimSummary.duplicateNumber.toString();
    this.fetchClaim.masterDocumentNumber = claimSummary.masterDocumentNumber.toString();
    this.fetchClaim.ownerId = claimSummary.documentOwnerId.toString();
    this.fetchClaim.sequenceNumber = claimSummary.sequenceNumber.toString();
    this.fetchClaim.shipmentPrefix = claimSummary.shipmentPrefix.toString();

    let filter = new FilterQuery();

    filter = {
      filterDto: this.fetchClaim,
      paginationDto: null
    };

    this.confirmationService.confirm({
      message: this.translateService.instant('module.directClaims.deleteMessage', "moduleName") + ' ' + claimSummary.shipmentPrefix + claimSummary.masterDocumentNumber + '?', header: 'Claims',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        ids.push(this.id);

        this.transactionService.fetchClaim(environment.claimsAPI, this.constantService.ICARGO_URL, filter.filterDto).subscribe(
          (data) => {
            if (data.responseDto.response === this.constantService.RESPONSE_OK) {
              this.claimSummariesFetch = data.businessDto[0];
              this.claimDetail = data.businessDto[0].claimDetails[0];
              this.claimSummary.claimAttachments = data.businessDto[0].claimAttachments;


              //Delete Begin

              var today = new Date();
              var currentDate = String(today.getDate()).padStart(2, '0') + '-' + (this.monthNames[today.getMonth()]) + '-' + today.getFullYear();

              this.claimSummary.shipmentPrefix = data.businessDto[0].shipmentPrefix;
              this.claimSummary.claimReferenceNumber = data.businessDto[0].claimReferenceNumber;
              this.claimSummary.claimantCode = data.businessDto[0].claimantCode;
              this.claimSummary.stationCode = data.businessDto[0].stationCode;
              this.claimSummary.shipmentPrefix = data.businessDto[0].shipmentPrefix;
              this.claimSummary.documentOwnerId = data.businessDto[0].documentOwnerId;
              this.claimSummary.masterDocumentNumber = data.businessDto[0].masterDocumentNumber;
              this.claimSummary.sequenceNumber = data.businessDto[0].sequenceNumber;
              this.claimSummary.duplicateNumber = data.businessDto[0].duplicateNumber;
              this.claimSummary.companyCode = data.businessDto[0].companyCode;
              this.claimSummary.claimDate = data.businessDto[0].claimDate;
              this.claimSummary.communicationMode = "M";
              this.claimSummary.claimStatus = "N";
              this.claimSummary.totalClaimAmount = data.businessDto[0].totalClaimAmount;
              this.claimSummary.totalClaimAmountCurrency = "USD";
              this.claimSummary.claimantName = data.businessDto[0].claimantName;
              this.claimSummary.claimantAddress1 = data.businessDto[0].claimantAddress1;
              this.claimSummary.daughterDocumentNumber = data.businessDto[0].daughterDocumentNumber;
              this.claimSummary.claimantAddress2 = data.businessDto[0].claimantAddress2;
              this.claimSummary.claimantZipCode = data.businessDto[0].claimantZipCode;
              this.claimSummary.claimantCountry = data.businessDto[0].claimantCountry;
              this.claimSummary.claimantTelephoneNumber = data.businessDto[0].claimantTelephoneNumber;
              this.claimSummary.claimantEmail = data.businessDto[0].claimantEmail;
              this.claimSummary.remarks = "";
              this.claimSummary.remarks = data.businessDto[0].remarks;
              this.claimSummary.sourceSystem = data.businessDto[0].companyCode.toString();

              this.claimDetail.numberOfPieces = data.businessDto[0].claimDetails[0].numberOfPieces;
              this.claimDetail.weight = data.businessDto[0].claimDetails[0].weight;
              this.claimDetail.weightUnit = data.businessDto[0].claimDetails[0].weightUnit;
              this.claimDetail.volume = data.businessDto[0].claimDetails[0].volume;
              this.claimDetail.volumeUnit = data.businessDto[0].claimDetails[0].volumeUnit;
              this.claimDetail.portOfDelivery = data.businessDto[0].claimDetails[0].portOfDelivery;
              this.claimDetail.stationResposible = data.businessDto[0].claimDetails[0].stationResposible;
              this.claimDetail.claimAmount = data.businessDto[0].claimDetails[0].claimAmount;
              this.claimDetail.claimAmountCurrency = "USD";
              this.claimDetail.approvedAmount = data.businessDto[0].claimDetails[0].claimAmount.toString();
              this.claimDetail.approvedAmountCurrency = "USD";
              this.claimDetail.reasonCode = data.businessDto[0].claimDetails[0].reasonCode;

              this.claimDetail.commodityCode = data.businessDto[0].claimDetails[0].commodityCode;
              this.claimDetail.claimDetailsSerialNumber = data.businessDto[0].claimDetails[0].claimDetailsSerialNumber;
              this.claimDetail.severity = data.businessDto[0].claimDetails[0].severity;
              this.claimDetail.investigationResults = data.businessDto[0].claimDetails[0].investigationResults;
              this.claimDetail.approvalCateogry = data.businessDto[0].claimDetails[0].approvalCateogry;
              this.claimDetail.operationalFlag = "D";
              this.claimDetail.claimRemarks = "";

              this.claimSummary.claimDetails = [];
              this.claimSummary.claimDetails.push(this.claimDetail);

              this.transactionService.saveClaim(environment.claimsAPI, this.constantService.ICARGO_URL, this.claimSummary).subscribe(
                (data) => {
                  if (data.responseDto.response === this.constantService.RESPONSE_OK) {
                    this.transactionService
                      .delete(environment.adminAPI, this.constantService.CLAIM_URL, ids)
                      .subscribe(
                        (data) => {
                          if (
                            data.responseDto.response === this.constantService.RESPONSE_OK
                          ) {
                            this.messageService.add({
                              severity: 'success',
                              summary: 'Claims',
                              detail: this.translateService.instant(data.responseDto.message.replace("", ''), "moduleName"),
                              life: 3000,
                            });

                          } else {
                            this.messageService.add({
                              severity: 'warn',
                              summary: 'Claims',
                              detail: this.translateService.instant(data.responseDto.message.replace("", ''), "moduleName"),
                              life: 8000,
                            });
                          }
                        },
                        (error) => {
                          this.loading = false;
                          this.messageService.add({
                            severity: 'error',
                            summary: 'Claims',
                            detail: this.translateService.instant(data.responseDto.message.replace("", ''), "moduleName"),
                          });
                        }
                      );
                  }
                  else {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail:
                        this.translateService.instant(data.responseDto.message, "moduleName"),
                      life: 8000,
                    });
                  }
                },
                (error) => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Claim',
                    detail: this.translateService.instant('module.directClaims.serviceMessages.errorConsult', "moduleName"),
                    life: 8000,
                  });
                })


              //delete end

            }
            else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  this.translateService.instant(data.responseDto.message, "moduleName"),
                life: 8000,
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Claim',
              detail: this.translateService.instant('module.directClaims.serviceMessages.error', "moduleName"),
              life: 8000,
            });
          }
        )

      },
    });
  }



  getClaims() {
    this.claimSummaries = [];

    if (this.f.confirmarAwb) {
      var str = this.f.confirmarAwb.value.toString();
      var prefix = str.substring(0, 3);
      var guide = str.substring(3);
      var sourceSystem = this.f.airline.value.toString();
      this.sourceSystemValue = sourceSystem;

      this.transactionService.GetList(environment.claimsAPI, this.constantService.ICARGO_URL, '/' + 'GetAwbDetails' + '/' + sourceSystem + '/' + prefix + '/' + guide).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {

            this.awb = data.businessDto[0];
            this.flightBooking = data.businessDto[0].flightBooking;
            var shipmentDetailsFilterDto = data.businessDto[0].shipmentDetailsFilter;

            this.fetchClaim = new ShipmentDetailsFilter();
            this.fetchClaim.claimReferenceNumber = shipmentDetailsFilterDto.claimReferenceNumber.toString();
            this.fetchClaim.duplicateNumber = shipmentDetailsFilterDto.duplicateNumber.toString();
            this.fetchClaim.masterDocumentNumber = shipmentDetailsFilterDto.masterDocumentNumber.toString();
            this.fetchClaim.ownerId = shipmentDetailsFilterDto.ownerId.toString();
            this.fetchClaim.sequenceNumber = shipmentDetailsFilterDto.sequenceNumber.toString();
            this.fetchClaim.shipmentPrefix = shipmentDetailsFilterDto.shipmentPrefix.toString();
            this.fetchClaim.sourceSystem = this.sourceSystemValue;

            let filter = new FilterQuery();

            filter = {
              filterDto: this.fetchClaim,
              paginationDto: null
            };

            this.transactionService.fetchClaim(environment.claimsAPI, this.constantService.ICARGO_URL, filter.filterDto).subscribe(
              (data) => {
                if (data.responseDto.response === this.constantService.RESPONSE_OK) {
                  //this.claimSummariesFetch = data.businessDto;
                  this.transactionService.GetList(environment.claimsAPI, this.constantService.CLAIM_URL, '/' + 'VerifyClaim' + '/' + prefix + '/' + guide).subscribe(
                    (data) => {
                      if (data.responseDto.response === this.constantService.RESPONSE_OK) {
                        this.claimSummaries = data.businessDto;

                        if (this.claimSummaries[0].preeliminarDate != null && this.claimSummaries[0].formalDate == null) {
                          this.messageService.add({
                            severity: 'success',
                            summary: 'Claims',
                            detail:
                              this.translateService.instant("module.directClaims.serviceMessages.claimPreeliminar", "moduleName"),
                            life: 9000,
                          });
                        }

                        if (this.claimSummaries[0].formalDate != null) {
                          this.messageService.add({
                            severity: 'success',
                            summary: 'Claims',
                            detail:
                              this.translateService.instant("module.directClaims.serviceMessages.claimFormalDate", "moduleName"),
                            life: 9000,
                          });
                        }
                      }
                      else {
                        this.messageService.add({
                          severity: 'warn',
                          summary: 'Claims',
                          detail:
                            this.translateService.instant(data.responseDto.message.replace("", ''), "moduleName"),
                          life: 8000,
                        });
                      }
                    }
                  )
                }
                else {
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Claims',
                    detail:
                      this.translateService.instant(data.responseDto.message, "moduleName"),
                    life: 8000,
                  });
                }
              },
              (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Claim',
                  detail: error,
                  life: 8000,
                });
              }
            )
          }
          else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                this.translateService.instant(data.responseDto.message, "moduleName"),
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Claim',
            detail: this.translateService.instant('module.directClaims.serviceMessages.error', "moduleName"),
            life: 8000,
          });
        }
      );
    }
  }

  update(claimSummariesFetch: ClaimSummary, claimDetail: ClaimDetail, claim: Claim, daugtherDocumentNumber: String) {
    this.submitted = true;
    this.loading = true;

    var today = new Date();
    var currentDate = String(today.getDate()).padStart(2, '0') + '-' + (this.monthNames[today.getMonth()]) + '-' + today.getFullYear();
    //Debido a la historia HU-336815 se elimina campo invoiceNumber
    //let descripInvoice = claimSummariesFetch.invoiceNumber == undefined ? "" : ' \nINV: ' + claimSummariesFetch.invoiceNumber;
    let descripInvoice = "";
    let descripCompany = claimSummariesFetch.companyCode == undefined ? "" : ' \nCOM: ' + claimSummariesFetch.companyCode;
    let hawb = this.f.daughterDocumentNumber.value != '' && this.f.daughterDocumentNumber.value != undefined ? `\nHAWB: ${this.f.daughterDocumentNumber.value}` : '';

    this.claimSummary.shipmentPrefix = claimSummariesFetch.shipmentPrefix;
    this.claimSummary.claimReferenceNumber = claimSummariesFetch.claimReferenceNumber;
    this.claimSummary.claimantCode = claimSummariesFetch.claimantCode;
    this.claimSummary.stationCode = claimSummariesFetch.stationCode;
    this.claimSummary.shipmentPrefix = claimSummariesFetch.shipmentPrefix;
    this.claimSummary.documentOwnerId = claimSummariesFetch.documentOwnerId;
    this.claimSummary.masterDocumentNumber = claimSummariesFetch.masterDocumentNumber;
    this.claimSummary.sequenceNumber = claimSummariesFetch.sequenceNumber;
    this.claimSummary.duplicateNumber = claimSummariesFetch.duplicateNumber;
    this.claimSummary.companyCode = claimSummariesFetch.companyCode;
    this.claimSummary.claimDate = claimSummariesFetch.claimDate;
    this.claimSummary.communicationMode = "M";
    this.claimSummary.claimStatus = "N";
    this.claimSummary.totalClaimAmount = claimSummariesFetch.totalClaimAmount;
    this.claimSummary.totalClaimAmountCurrency = "USD";
    this.claimSummary.claimantName = claimSummariesFetch.claimantName;
    this.claimSummary.claimantAddress1 = claimSummariesFetch.claimantAddress1;
    this.claimSummary.daughterDocumentNumber = daugtherDocumentNumber;
    this.claimSummary.claimantAddress2 = claimSummariesFetch.claimantAddress2;
    this.claimSummary.claimantZipCode = claimSummariesFetch.claimantZipCode;
    this.claimSummary.claimantCountry = claimSummariesFetch.claimantCountry;
    this.claimSummary.claimantTelephoneNumber = claimSummariesFetch.claimantTelephoneNumber.toString();
    this.claimSummary.claimantEmail = claimSummariesFetch.claimantEmail;
    this.claimSummary.arrivalDate = new Date(moment(this.flightBooking[this.flightBooking.length - 1].arrivalDate).format("YYYY/MM/DD"));
    this.claimSummary.remarks = this.f.claimDescription.value + "  " + descripInvoice + "  " + descripCompany + " " + hawb;
    this.claimSummary.sourceSystem = claimSummariesFetch.companyCode.toString();

    this.claimDetail.numberOfPieces = claimDetail.numberOfPieces;
    this.claimDetail.weight = claimDetail.weight;
    this.claimDetail.weightUnit = claimDetail.weightUnit;
    this.claimDetail.volume = claimDetail.volume;
    this.claimDetail.volumeUnit = claimDetail.volumeUnit;
    this.claimDetail.portOfDelivery = claimDetail.portOfDelivery;
    this.claimDetail.stationResposible = claimDetail.stationResposible;
    this.claimDetail.claimAmount = this.f.claimAmount.value;
    this.claimDetail.claimAmountCurrency = "USD";
    this.claimDetail.approvedAmount = claimDetail.claimAmount.toString();
    this.claimDetail.approvedAmountCurrency = "USD";
    this.claimDetail.reasonCode = claimDetail.reasonCode;
    this.claimDetail.commodityCode = claimDetail.commodityCode;
    this.claimDetail.claimDetailsSerialNumber = claimDetail.claimDetailsSerialNumber;
    this.claimDetail.severity = claimDetail.severity;
    this.claimDetail.investigationResults = claimDetail.investigationResults;
    this.claimDetail.approvalCateogry = claimDetail.approvalCateogry;
    this.claimDetail.operationalFlag = "U";
    this.claimDetail.claimRemarks = "";

    this.claimSummary.claimDetails = [];
    this.claimSummary.claimDetails.push(this.claimDetail);

    this.claimDialog = false;
    this.transactionService.saveClaim(environment.claimsAPI, this.constantService.ICARGO_URL, this.claimSummary).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.updateClaimDataBase(this.claimSummary, this.claimSummary.claimReferenceNumber.toString(), claim, daugtherDocumentNumber);
          this.submitted = false;
          /*
          this.messageService.add({
            severity: 'success',
            summary: 'Claim',
            detail: this.translateService.instant(data.responseDto.message, "moduleName"),
          });
          */
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Claim',
            detail: this.translateService.instant(data.responseDto.message, "moduleName"),
          });
          this.loading = false;
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Claim',
          detail: this.translateService.instant('module.directClaims.serviceMessages.error', "moduleName"),
        });
        this.loading = false;
      }
    );
  }

  deleteICargoClaim(claimSummariesFetch: ClaimSummary, claimDetail: ClaimDetail, claim: Claim, daugtherDocumentNumber: String) {
    this.submitted = true;
    this.loading = true;

    var today = new Date();
    var currentDate = String(today.getDate()).padStart(2, '0') + '-' + (this.monthNames[today.getMonth()]) + '-' + today.getFullYear();

    this.claimSummary.shipmentPrefix = claimSummariesFetch.shipmentPrefix;
    this.claimSummary.claimReferenceNumber = claimSummariesFetch.claimReferenceNumber;
    this.claimSummary.claimantCode = claimSummariesFetch.claimantCode;
    this.claimSummary.stationCode = claimSummariesFetch.stationCode;
    this.claimSummary.shipmentPrefix = claimSummariesFetch.shipmentPrefix;
    this.claimSummary.documentOwnerId = claimSummariesFetch.documentOwnerId;
    this.claimSummary.masterDocumentNumber = claimSummariesFetch.masterDocumentNumber;
    this.claimSummary.sequenceNumber = claimSummariesFetch.sequenceNumber;
    this.claimSummary.duplicateNumber = claimSummariesFetch.duplicateNumber;
    this.claimSummary.companyCode = claimSummariesFetch.companyCode;
    this.claimSummary.claimDate = claimSummariesFetch.claimDate;
    this.claimSummary.communicationMode = "M";
    this.claimSummary.claimStatus = "N";
    this.claimSummary.totalClaimAmount = claimSummariesFetch.totalClaimAmount;
    this.claimSummary.totalClaimAmountCurrency = "USD";
    this.claimSummary.claimantName = claimSummariesFetch.claimantName;
    this.claimSummary.claimantAddress1 = claimSummariesFetch.claimantAddress1;
    this.claimSummary.daughterDocumentNumber = daugtherDocumentNumber;
    this.claimSummary.claimantAddress2 = claimSummariesFetch.claimantAddress2;
    this.claimSummary.claimantZipCode = claimSummariesFetch.claimantZipCode;
    this.claimSummary.claimantCountry = claimSummariesFetch.claimantCountry;
    this.claimSummary.claimantTelephoneNumber = claimSummariesFetch.claimantTelephoneNumber;
    this.claimSummary.claimantEmail = claimSummariesFetch.claimantEmail;
    this.claimSummary.remarks = "";
    //Debido a la historia HU-336815 se elimina campo invoiceNumber
    //this.claimSummary.remarks = claimSummariesFetch.remarks + ' \nINV: ' + claimSummariesFetch.invoiceNumber + ' \nCOM' + claimSummariesFetch.companyCode;
    this.claimSummary.remarks = claimSummariesFetch.remarks + ' \nINV: ' + ' \nCOM' + claimSummariesFetch.companyCode;
    this.claimSummary.sourceSystem = claimSummariesFetch.companyCode.toString();

    this.claimDetail.numberOfPieces = claimDetail.numberOfPieces;
    this.claimDetail.weight = claimDetail.weight;
    this.claimDetail.weightUnit = claimDetail.weightUnit;
    this.claimDetail.volume = claimDetail.volume;
    this.claimDetail.volumeUnit = claimDetail.volumeUnit;
    this.claimDetail.portOfDelivery = claimDetail.portOfDelivery;
    this.claimDetail.stationResposible = claimDetail.stationResposible;
    this.claimDetail.claimAmount = claimDetail.claimAmount;
    this.claimDetail.claimAmountCurrency = "USD";
    this.claimDetail.approvedAmount = claimDetail.claimAmount.toString();
    this.claimDetail.approvedAmountCurrency = "USD";
    this.claimDetail.reasonCode = claimDetail.reasonCode;

    this.claimDetail.commodityCode = claimDetail.commodityCode;
    this.claimDetail.claimDetailsSerialNumber = claimDetail.claimDetailsSerialNumber;
    this.claimDetail.severity = claimDetail.severity;
    this.claimDetail.investigationResults = claimDetail.investigationResults;
    this.claimDetail.approvalCateogry = claimDetail.approvalCateogry;
    this.claimDetail.operationalFlag = "D";
    this.claimDetail.claimRemarks = "";

    this.claimSummary.claimDetails = [];
    this.claimSummary.claimDetails.push(this.claimDetail);


    this.transactionService.saveClaim(environment.claimsAPI, this.constantService.ICARGO_URL, this.claimSummary)
      .subscribe(
        (data) => {
          if (
            data.responseDto.response === this.constantService.RESPONSE_OK
          ) {
            this.updateClaimDataBase(this.claimSummary, this.claimSummary.claimReferenceNumber.toString(), claim , daugtherDocumentNumber)
            this.submitted = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Claim',
              detail: this.translateService.instant(data.responseDto.message, "moduleName"),
            });
            this.claimDialog = false;
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Claim',
              detail: this.translateService.instant(data.responseDto.message, "moduleName"),

            });

          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Claim',
            detail: this.translateService.instant('module.directClaims.serviceMessages.error', "moduleName"),

          });
        }
      );

  }



  confirmation() {
    this.confirmationService.confirm({
      message: this.translateService.instant('module.directClaims.policies.message', "moduleName"),
      header: this.translateService.instant('module.directClaims.policies.header', "moduleName"),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'success', summary: this.translateService.instant('module.directClaims.policies.summaryConfirmed', "moduleName"), detail: this.translateService.instant('module.directClaims.policies.confirmDetail', "moduleName") });
        var today = new Date();
        this.policieAccepted = true;
        this.policieAcceptedDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        this.route.navigate(['home/fetch-claim']);
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: this.translateService.instant('module.directClaims.policies.summaryReject', "moduleName"), detail: this.translateService.instant('module.directClaims.policies.rejectDetail', "moduleName") });
            this.route.navigate(['home/claimMenu']);
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            this.route.navigate(['home/claimMenu']);
            break;
        }
      }
    });
  }


  addFile() {
    this.fileVisible = false;

  }



  selectFile(event) {
    var files = event.target.files;
    var file = files[0];

    this.attachmentName = event.target.files[0].name.toString();

    if (files && file) {
      var reader = new FileReader();
      reader.onload = this.handleFile.bind(this);
      reader.readAsBinaryString(file);
    }

  }


  uploader(event) {

    const file = event.files[0];
    const reader = new FileReader();
    this.attachmentName = event.files[0].name.toString();
    reader.onload = this.handleFile.bind(this);
    reader.readAsDataURL(file);
  }

  handleFile(event) {
    var binaryString = event.target.result;
    this.attachmentData = btoa(binaryString);


    if (this.claimSummary.claimAttachments == undefined) {

      this.claimSummary.claimAttachments = [];
      this.claimAttachment = new ClaimAttachment();
      this.claimAttachment.fileName = this.attachmentName;
      this.claimAttachment.fileData = this.attachmentData;
      this.claimAttachment.operationalFlag = "I";
      this.claimAttachment.remarks = this.f.attachmentRemark.value == undefined ? "" : this.f.attachmentRemark.value.toString();
      this.claimSummary.claimAttachments.push(this.claimAttachment);
      this.f.attachmentRemark.reset("");
      this.messageService.add({ severity: 'info', summary: this.translateService.instant('module.directClaims.fileUploaded', "moduleName"), detail: '' });
      //console.log(this.claimSummary.claimAttachments);

    } else {
      this.claimAttachment = new ClaimAttachment();
      this.claimAttachment.fileName = this.attachmentName;
      this.claimAttachment.fileData = this.attachmentData;
      this.claimAttachment.operationalFlag = "I";
      this.claimAttachment.remarks = this.f.attachmentRemark.value == undefined ? "" : this.f.attachmentRemark.value.toString();
      this.claimSummary.claimAttachments.push(this.claimAttachment);
      this.f.attachmentRemark.reset("");
      this.messageService.add({ severity: 'info', summary: this.translateService.instant('module.directClaims.fileUploaded', "moduleName"), detail: '' });
      //console.log(this.claimSummary.claimAttachments);
    }









    // this.claimAttachment = new ClaimAttachment();
    // this.claimAttachment.fileName = this.attachmentName;
    // this.claimAttachment.fileData = this.attachmentData;
    // this.claimAttachment.operationalFlag = "I";
    // this.claimAttachment.remarks = this.f.attachmentRemark.value == undefined ? "" : this.f.attachmentRemark.value.toString();
    // this.claimSummary.claimAttachments.push(this.claimAttachment);
    // this.f.attachmentRemark.reset("");
    // this.messageService.add({ severity: 'info', summary: this.translateService.instant('module.directClaims.fileUploaded', "moduleName"), detail: '' });


  }

  updateClaimDataBase(claimSummary: any, claimReferenceNumber: string, claim: Claim, daughterDocumentNumber: String) {
    var sourceSystem = this.sourceSystemValue;
    let lang = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE).lang

    this.transactionService.GetList(environment.claimsAPI, this.constantService.ICARGO_URL, '/' + 'GetAwbDetails' + '/' + sourceSystem + '/' + claimSummary.shipmentPrefix + '/' + claimSummary.masterDocumentNumber).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.awb = data.businessDto[0];
          this.flightBooking = data.businessDto[0].flightBooking;
          var shipmentDetailsFilterDto = data.businessDto[0].shipmentDetailsFilter;

          this.claim = new Claim();
          this.claim.id = this.id;
          this.claim.claimReferenceNumber = Number(claimReferenceNumber);
          this.claim.duplicateNumber = Number(shipmentDetailsFilterDto.duplicateNumber);
          this.claim.masterDocumentNumber = Number(shipmentDetailsFilterDto.masterDocumentNumber);
          this.claim.documentOwnerId = Number(shipmentDetailsFilterDto.ownerId);
          this.claim.sequenceNumber = Number(shipmentDetailsFilterDto.sequenceNumber);
          this.claim.shipmentPrefix = Number(shipmentDetailsFilterDto.shipmentPrefix);
          this.claim.cargoTypeId = claimSummary.cargoTypeId;
          this.claim.claimReasonId = Number(claimSummary.claimReasonId);
          //this.claim.stationClaimCode = claimSummary.stationResposible;
          this.claim.stationClaimCodeDest = claimSummary.claimDetails[0].portOfDelivery;
          this.claim.isLoaded = this.loadedDocument;
          this.claim.stationClaimId = Number(claimSummary.stationClaimId);
          this.claim.claimAmount = Number(claim.claimAmount);
          this.claim.daughterDocumentNumber = daughterDocumentNumber.toString();
          this.claim.freightAmount = Number(claim.freightAmount);
          this.claim.otherAmount = Number(claim.otherAmount);
          this.claim.totalAmount = Number(claimSummary.totalClaimAmount);
          this.claim.ArrivalDate = new Date(moment(this.flightBooking[this.flightBooking.length - 1].arrivalDate).format("YYYY/MM/DD"));
          this.claim.policieAccepted = this.policieAccepted;
          this.claim.policieAcceptedDate = new Date(this.policieAcceptedDate);
          this.claim.createdDate = new Date(this.createdDate);
          this.claim.claimantName = claimSummary.claimantName.toString();
          this.claim.email = claimSummary.claimantEmail.toString();
          this.claim.preeliminarDate = claimSummary.preeliminarDate;
          this.claim.formalDate = claimSummary.formalDate;
          this.claim.language = lang;

          this.transactionService.update(environment.claimsAPI, this.constantService.CLAIM_URL, this.claim).subscribe(
            (data) => {
              if (data.responseDto.response === this.constantService.RESPONSE_OK) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Claims',
                  detail: this.translateService.instant(data.responseDto.message, "moduleName"),
                });
              }
              else {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Claims',
                  detail: this.translateService.instant(data.responseDto.message, "moduleName"),
                  life: 8000,
                });
              }

              this.loading = false;
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Claims',
                detail: this.translateService.instant(data.responseDto.message, "moduleName"),
                life: 8000,
              });

              this.loading = false;
            }
          )
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.translateService.instant(data.responseDto.message, "moduleName"),
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Claim',
          detail: this.translateService.instant('module.directClaims.serviceMessages.error', "moduleName"),
          life: 8000,
        });
      }
    );
  }

  deleteFile(attachment: ClaimAttachment) {
    this.confirmationService.confirm({
      message: this.translateService.instant('module.directClaims.deleteMessageFetch', "moduleName") + '  ' + attachment.fileName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        attachment.operationalFlag = "D";
        this.messageService.add({ severity: 'success', summary: this.translateService.instant('module.directClaims.files', "moduleName"), detail: this.translateService.instant('module.directClaims.fileMarkedDelete', "moduleName"), life: 3000 });
      }
    });
  }
}
