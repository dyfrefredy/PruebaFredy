import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { Awb } from '../../../model/awb';
import { Claim } from '../../../model/claim';
import { ClaimDetail } from '../../../model/claim-detaill';
import { ClaimSummary } from '../../../model/claim-summary';
import { FilterQuery } from '../../../model/filter-query';
import { FlightBooking } from '../../../model/flight-booking.model';
import { User } from '../../../model/user';
import { AuthService } from '../../../services/auth.service';
import { TransactionService } from '../../../services/transaction.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { ClaimAttachment } from '../../../model/claim-attachment.model';

@Component({
  selector: 'app-direct-claims',
  templateUrl: './direct-claims.component.html',
  styleUrls: ['./direct-claims.component.scss']
})
export class DirectClaimsComponent implements OnInit {


  @Input() options: Array<{ label: string }>;
  @Input() selectionLabel: string;
  @Input() disabled = false;
  @Input() filter = true;
  @Input() claimAdd: Array<{
    claimReferenceNumber: String;
    claimantCode: String;
    stationCode: String;
    shipmentPrefix: String;
    documentOwnerId: String;
    masterDocumentNumber: String;
    sequenceNumber: String;
    duplicateNumber: String;
    companyCode: String;
    claimDate: String;
    nature: String;
    communicationMode: String;
    claimStatus: String;
    totalClaimAmount: Number;
    totalClaimAmountCurrency: String;
    totalApprovedAmount: Number;
    totalApprovedAmountCurrency: String;
    carrierLiabilityAmount: String;
    carrierLiabilityAmountCurrency: String;
    claimantName: String;
    invoiceNumber: String;
    claimantAddress1: String;
    claimantAddress2: String;
    claimantZipCode: string;
    claimantCountry: String;
    claimantTelephoneNumber: String;
    claimantFax: string;
    claimantEmail: String;
    claimantCompany: String;
    claimDescription: String;
    otherAmount: string;
    totalAmount: string;
    remarks: string;
    numberOfPieces: Number;
    weight: Number;
    weightUnit: String;
    volume: Number;
    volumeUnit: String;
    portOfDelivery: String;
    stationResposible: String;
    claimAmount: Number;
    claimAmountCurrency: String;
    approvedAmount: String;
    approvedAmountCurrency: String;
    reasonCodeId: String;
    reasonCodeName: String;
    reasonCode: String;
    commodityCode: String;
    commodityCodeName: String;
    commodityCodeId: String;
    claimDetailsSerialNumber: String;
    severity: String;
    investigationResults: String;
    approvalCateogry: String;
    operationalFlag: String
  }>;

  selectionStation: any;
  user: User;
  activeIndex: number = 0;
  submitted: boolean;
  items: MenuItem[];
  directClaimsHeaderForm: FormGroup;
  claimSummaryForm: FormGroup;
  claimDetailForm: FormGroup;
  createHidden: boolean;
  hiddenClaim: boolean;
  hiddenClaimReason: boolean;
  confirm: boolean;
  claimForm: FormGroup;
  claim: Claim;
  value2: number;
  claimMotive: any[];
  loading: boolean;
  awb: Awb;

  claimDetail: ClaimDetail;
  claimSummary: ClaimSummary;
  claimAttachment: ClaimAttachment;
  claimTable: ClaimSummary[] = [];
  reasonCode: any[] = [];
  commodity: any[] = [];

  value1: string = "AV";
  stateOptions: any[];
  monthNames: any[];


  claimSummarySave: ClaimSummary[] = [];
  aClaimDetails: Array<{}>


  events1: any[];
  uniqueArray: any[];
  flightBooking: FlightBooking[];
  uploadedFiles: any[] = [];
  policieDialog: boolean;

  awbNumber: string;
  policieAccepted: boolean;
  policieAcceptedDate: string;
  sourceSystemValue: string;


  attachmentName: string;
  attachmentData: string;
  attachmentRemark: string;
  base64textString: string;

  initialValuesDetail: any;
  initialValuesSummary: any;
  initialValuesHeader: any;


  constructor(private fb: FormBuilder,
    private transactionService: TransactionService,
    private messageService: MessageService,
    private constantService: ConstantService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private zone: NgZone,
    private route: Router,
    private storageService: StorageService) {

    this.user = this.authService.currentUserValue;

    this.monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    this.stateOptions = [{ label: 'Avianca', value: 'AV' }, { label: 'Aerounion', value: 'AEROUNION' }];

    this.directClaimsHeaderForm = this.fb.group({
      confirmarAwb: [''],
      airline: ['AV'],
    })


    this.claimSummaryForm = this.fb.group({
      claimReferenceNumber: [''],
      claimantCode: new FormControl('C1001', [
        Validators.required]),
      stationCode: [''],
      shipmentPrefix: [''],
      documentOwnerId: [''],
      masterDocumentNumber: [''],
      duplicateNumber: [''],
      companyCode: [''],
      claimDate: [''],
      nature: [''],
      communicationMode: [''],
      claimStatus: [''],
      totalClaimAmount: new FormControl('', [
        Validators.required]),
      totalClaimAmountCurrency: [''],
      totalApprovedAmountCurrency: [''],
      totalApprovedAmount: new FormControl('', [
        Validators.required]),
      carrierLiabilityAmount: new FormControl('', [
        Validators.required]),
      carrierLiabilityAmountCurrency: [''],
      flightArrivalDate: [''],
      flightDepartureDate: [''],
      claimantName: new FormControl('', [
        Validators.required]),
      claimantCompany: new FormControl('', [
        Validators.required]),
      claimantAddress1: new FormControl('', [
        Validators.required]),
      claimantAddress2: new FormControl('', [
        Validators.required]),
      claimantZipCode: [''],
      claimantCountry: [''],
      claimantTelephoneNumber: new FormControl('', [
        Validators.required]),
      claimantFax: [''],
      claimantEmail: new FormControl('', [
        Validators.required,
        Validators.email]),
      claimDescription: ['', Validators.required],
      invoiceNumber: ['']
    });



    this.claimDetailForm = this.fb.group({
      numberOfPieces: new FormControl('', [
        Validators.required]),
      weight: new FormControl('', [
        Validators.required]),
      weightUnit: new FormControl('', [
        Validators.required]),
      volume: new FormControl('', [
        Validators.required]),
      volumeUnit: new FormControl('', [
        Validators.required]),
      portOfDelivery: new FormControl({ value: '', disabled: true }),
      stationResposible: [''],
      claimAmount: ['0'],
      claimAmountCurrency: [''],
      approvedAmount: ['0'],
      approvedAmountCurrency: new FormControl('', [
        Validators.required]),
      reasonCode: [''],
      commodityCode: [''],
      claimDetailsSerialNumber: [''],
      severity: [''],
      investigationResults: [''],
      approvalCateogry: [''],
      operationalFlag: [''],
      otherAmount: ['0'],
      totalAmount: new FormControl({ value: '', disabled: true }),
      attachment: new FormControl('', [Validators.required]),
      attachmentRemark: new FormControl({ value: ("").toString() }),
    });
  }


  ngOnInit(): void {

    this.claim = new Claim();
    this.awb = new Awb();
    this.claimSummary = new ClaimSummary();
    this.claimDetail = new ClaimDetail();
    this.claimAdd = new Array();
    this.aClaimDetails = new Array();


    this.initialValuesDetail = this.claimDetailForm.value;
    this.initialValuesSummary = this.claimSummaryForm.value;
    this.initialValuesHeader = this.directClaimsHeaderForm.value;


    this.items = [
      {
        label: 'Informacion Vuelo'
      },
      {
        label: 'Informacion Salida/Llegada'
      },
      {
        label: 'Remitente'
      },
      {
        label: 'Consignatario'
      },
      {
        label: 'Detalles Envio'
      }
    ];

    //this.submitted = false;
    this.createHidden = true;
    this.hiddenClaim = true;
    this.hiddenClaimReason = true;
    this.confirm = true;
    this.activeIndex = 0;

  }



  sumValues() {
    this.fcd.totalAmount.setValue(this.fcd.claimAmount.value + this.fcd.approvedAmount.value + this.fcd.otherAmount.value);
  }


  get fa() {
    return this.directClaimsHeaderForm.controls;
  }


  get fcs() {
    return this.claimSummaryForm.controls;
  }

  get fcd() {
    return this.claimDetailForm.controls;
  }


  nextPage() {
    this.activeIndex = this.activeIndex + 1;
    this.submitted = true;

    return;
  }
  prevPage() {
    this.activeIndex = this.activeIndex - 1;
    this.submitted = true;
    this.createHidden = true;
    return;
  }


  createClaim() {
    this.createHidden = false;
    return;
  }


  saveClaim() {

    var prefix = this.awbNumber.substring(0, 3);
    var guide = this.awbNumber.substring(3);
    var today = new Date();
    var currentDate = String(today.getDate()).padStart(2, '0') + '-' + (this.monthNames[today.getMonth()]) + '-' + today.getFullYear();

    for (let i = 0; i < this.claimAdd.length; i++) {

      this.submitted = true;
      this.loading = true;

      let descripInvoice = this.claimAdd[i].invoiceNumber == undefined ? "" : ' \nINV: ' + this.claimAdd[i].invoiceNumber;
      let descripCompany = this.claimAdd[i].companyCode == undefined ? "" : ' \nCOM: ' + this.claimAdd[i].companyCode;

      //
      this.claimSummary.claimReferenceNumber = "0";
      this.claimSummary.claimantCode = this.claimAdd[i].claimantCode;
      this.claimSummary.stationCode = this.claimAdd[i].stationCode;
      this.claimSummary.shipmentPrefix = this.claimAdd[i].shipmentPrefix;
      this.claimSummary.documentOwnerId = this.claimAdd[i].documentOwnerId;
      this.claimSummary.masterDocumentNumber = this.claimAdd[i].masterDocumentNumber;
      this.claimSummary.sequenceNumber = this.claimAdd[i].sequenceNumber;
      this.claimSummary.duplicateNumber = this.claimAdd[i].duplicateNumber;
      this.claimSummary.companyCode = this.claimAdd[i].companyCode;
      this.claimSummary.claimDate = currentDate;
      this.claimSummary.communicationMode = "M";
      this.claimSummary.claimStatus = "N";
      this.claimSummary.totalClaimAmount = this.claimAdd[i].totalClaimAmount;
      this.claimSummary.totalClaimAmountCurrency = "USD";
      this.claimSummary.claimantName = this.claimAdd[i].claimantName;
      this.claimSummary.claimantAddress1 = this.claimAdd[i].claimantAddress1;
      this.claimSummary.claimantAddress2 = this.claimAdd[i].claimantAddress1;
      this.claimSummary.claimantZipCode = this.claimAdd[i].claimantZipCode == "" ? "0" : this.claimAdd[i].claimantZipCode;
      this.claimSummary.claimantCountry = this.claimAdd[i].claimantCountry;
      this.claimSummary.claimantTelephoneNumber = this.claimAdd[i].claimantTelephoneNumber;
      this.claimSummary.claimantEmail = this.claimAdd[i].claimantEmail;
      this.claimSummary.remarks = this.claimAdd[i].claimDescription.toString() + "  " + descripInvoice + "  " + descripCompany;
      this.claimSummary.sourceSystem = this.sourceSystemValue.toString();

      this.claimDetail.numberOfPieces = this.claimAdd[i].numberOfPieces;
      this.claimDetail.weight = this.claimAdd[i].weight;
      this.claimDetail.weightUnit = this.claimAdd[i].weightUnit;
      this.claimDetail.volume = this.claimAdd[i].volume;
      this.claimDetail.volumeUnit = this.claimAdd[i].volumeUnit;
      this.claimDetail.portOfDelivery = this.claimAdd[i].portOfDelivery;
      this.claimDetail.stationResposible = this.claimAdd[i].stationResposible;
      this.claimDetail.claimAmount = this.claimAdd[i].claimAmount;
      this.claimDetail.claimAmountCurrency = "USD";
      this.claimDetail.approvedAmount = this.claimAdd[i].claimAmount.toString();
      this.claimDetail.approvedAmountCurrency = this.claimAdd[i].approvedAmountCurrency.toString();
      this.claimDetail.reasonCode = this.claimAdd[i].reasonCode;
      //this.claimSummry.claimDetails.reasonCodeId = this.claimAdd[i].reasonCodeId;
      this.claimDetail.commodityCode = this.claimAdd[i].commodityCode;
      this.claimDetail.claimDetailsSerialNumber = this.claimAdd[i].claimDetailsSerialNumber;
      this.claimDetail.severity = this.claimAdd[i].severity;
      this.claimDetail.investigationResults = this.claimAdd[i].investigationResults;
      this.claimDetail.approvalCateogry = this.claimAdd[i].approvalCateogry;
      this.claimDetail.operationalFlag = this.claimAdd[i].operationalFlag;

      this.claimSummary.claimDetails = [];
      this.claimSummary.claimDetails.push(this.claimDetail);

      console.log(this.awb);

      this.transactionService.saveClaim(environment.claimsAPI, this.constantService.ICARGO_URL, this.claimSummary)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.saveClaimDataBase(this.claimAdd[i]);
              this.submitted = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Claim',
                detail: this.translateService.instant(data.responseDto.message, "moduleName"),
              });
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Claim',
                detail: this.translateService.instant(data.responseDto.message, "moduleName"),
              });

              this.claimAdd = [];


              this.hiddenClaimReason = true;
              this.hiddenClaim = true;
              this.createHidden = true;

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
        );
    }
    this.loading = false;
  }

  saveClaimDataBase(claimSummary: any) {

    if (this.fa.confirmarAwb) {

      var prefix = this.awbNumber.substring(0, 3);
      var guide = this.awbNumber.substring(3);

      var sourceSystem = this.sourceSystemValue;

      var lang = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE).lang


      this.transactionService.GetList(environment.claimsAPI, this.constantService.ICARGO_URL, '/' + 'GetAwbDetails' + '/' + sourceSystem + '/' + prefix + '/' + guide).subscribe(
        (data) => {

          if (data.responseDto.response === this.constantService.RESPONSE_OK) {

            this.awb = data.businessDto[0];
            this.flightBooking = data.businessDto[0].flightBooking;
            var shipmentDetailsFilterDto = data.businessDto[0].shipmentDetailsFilter;

            this.claim = new Claim();
            this.claim.claimReferenceNumber = Number(shipmentDetailsFilterDto.claimReferenceNumber);
            this.claim.duplicateNumber = Number(shipmentDetailsFilterDto.duplicateNumber);
            this.claim.masterDocumentNumber = Number(shipmentDetailsFilterDto.masterDocumentNumber);
            this.claim.documentOwnerId = Number(shipmentDetailsFilterDto.ownerId);
            this.claim.sequenceNumber = Number(shipmentDetailsFilterDto.sequenceNumber);
            this.claim.shipmentPrefix = Number(shipmentDetailsFilterDto.shipmentPrefix);
            this.claim.cargoTypeId = Number(claimSummary.commodityCodeId);
            this.claim.claimReasonId = Number(claimSummary.reasonCodeId);
            this.claim.stationClaimCode = claimSummary.stationResposible;
            this.claim.stationClaimCodeDest = claimSummary.portOfDelivery;
            this.claim.claimAmount = Number(claimSummary.claimAmount);
            this.claim.freightAmount = Number(claimSummary.carrierLiabilityAmount);
            this.claim.otherAmount = Number(claimSummary.otherAmount);
            this.claim.totalAmount = Number(claimSummary.totalClaimAmount);
            this.claim.ArrivalDate = new Date(this.flightBooking[this.flightBooking.length - 1].arrivalDate);
            this.claim.userCreateId = Number(this.user.id);
            this.claim.claimantName = claimSummary.claimantName.toString();
            this.claim.email = claimSummary.claimantEmail.toString();
            this.claim.language = lang.toString();
            this.claim.userCreateId = Number(this.user.id);



            this.transactionService.save(environment.claimsAPI, this.constantService.CLAIM_URL, this.claim).subscribe(
              (data) => {
                if (data.responseDto.response === this.constantService.RESPONSE_OK) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Claims',
                    detail: this.translateService.instant(data.responseDto.message, "moduleName"),
                  });

                  this.claimDetailForm.reset(this.initialValuesDetail);
                  this.claimSummaryForm.reset(this.initialValuesSummary);
                  this.directClaimsHeaderForm.reset(this.initialValuesHeader);
                  this.claimAdd = [];
                  this.awb = new Awb();
                  this.flightBooking = [];

                  this.hiddenClaimReason = true;
                  this.hiddenClaim = true;
                  this.createHidden = true;

                }
                else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: this.translateService.instant(data.responseDto.message, "moduleName"),
                    life: 8000,
                  });
                  this.directClaimsHeaderForm.reset(this.initialValuesHeader);
                  this.claimAdd = [];
                }
              },
              (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Claims',
                  detail: this.translateService.instant(data.responseDto.message, "moduleName"),
                  life: 8000,
                });
                this.claimDetailForm.reset(this.initialValuesDetail);
                this.claimSummaryForm.reset(this.initialValuesSummary);
                this.directClaimsHeaderForm.reset(this.initialValuesHeader);
                this.claimAdd = [];
                this.awb = new Awb();
                this.flightBooking = [];
                this.hiddenClaimReason = true;
                this.hiddenClaim = true;
                this.createHidden = true;
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
            this.createHidden = true;
            this.claimAdd = [];

            this.directClaimsHeaderForm.reset(this.initialValuesHeader);


          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Claim',
            detail: 'Por favor inténtelo de nuevo!',
            life: 8000,
          });
          this.createHidden = true;
          this.claimDetailForm.reset(this.initialValuesDetail);
          this.claimSummaryForm.reset(this.initialValuesSummary);
          this.directClaimsHeaderForm.reset(this.initialValuesHeader);
          this.claimAdd = [];
          this.awb = new Awb();
          this.flightBooking = [];
          this.hiddenClaimReason = true;
          this.hiddenClaim = true;
          this.createHidden = true;
        }
      );
    }
  }

  addClaim() {

    //var str = this.fa.confirmarAwb.value.toString();
    //this.awbNumber = str;
    var prefix = this.awbNumber.substring(0, 3);
    var guide = this.awbNumber.substring(3);
    var today = new Date();
    var currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    if (this.claimAdd.length == 0) {
      if (this.fcd.reasonCode.value.length <= 2) {
        for (let index = 0; index < this.fcd.reasonCode.value.length; index++) {

          this.claimAdd.push({
            claimReferenceNumber: "0",
            claimantCode: this.fcs.claimantCode.value,
            stationCode: environment.stationCode,   //fcs.stationCode.value,
            shipmentPrefix: prefix,
            documentOwnerId: "1" + prefix,
            masterDocumentNumber: guide,
            sequenceNumber: "1",
            duplicateNumber: "1",
            companyCode: "AV",
            claimDate: currentDate,
            nature: "",
            communicationMode: "M",
            claimStatus: "N",
            totalClaimAmount: this.fcd.totalAmount.value,
            totalClaimAmountCurrency: "USD",
            totalApprovedAmount: 0,
            totalApprovedAmountCurrency: "USD",
            carrierLiabilityAmount: "",
            carrierLiabilityAmountCurrency: "USD",
            claimantName: this.fcs.claimantName.value,
            claimantAddress1: this.fcs.claimantAddress1.value,
            claimantAddress2: this.fcs.claimantAddress1.value,
            claimantZipCode: this.fcs.claimantZipCode.value,
            claimantCountry: this.fcs.claimantCountry.value.toString(),
            claimantTelephoneNumber: this.fcs.claimantTelephoneNumber.value.toString(),
            claimantFax: this.fcs.claimantFax.toString(),
            claimantEmail: this.fcs.claimantEmail.value,
            claimantCompany: this.fcs.claimantCompany.value,
            invoiceNumber: this.fcs.invoiceNumber.value.toString(),
            claimDescription: this.fcs.claimDescription.value,
            otherAmount: this.fcd.otherAmount.value,
            totalAmount: this.fcd.totalAmount.value,
            remarks: this.fcs.claimDescription.value,
            numberOfPieces: this.fcd.numberOfPieces.value,
            weight: this.fcd.weight.value,
            weightUnit: "L",
            volume: 0,
            volumeUnit: "",
            portOfDelivery: this.fcd.portOfDelivery.value.toString(),
            stationResposible: this.fcd.stationResposible.value,
            claimAmount: this.fcd.claimAmount.value,
            claimAmountCurrency: "USD",
            approvedAmount: "0",
            approvedAmountCurrency: "USD",
            reasonCodeId: this.fcd.reasonCode.value[index].key,
            reasonCodeName: this.fcd.reasonCode.value[index].name,
            reasonCode: this.fcd.reasonCode.value[index].code,
            commodityCode: this.fcd.commodityCode.value.value,
            commodityCodeName: this.fcd.commodityCode.value.label,
            commodityCodeId: this.fcd.commodityCode.value.id,
            claimDetailsSerialNumber: "",
            severity: "H",
            investigationResults: "",
            approvalCateogry: "",
            operationalFlag: "I"
          });

        }
        this.createHidden = false;
        console.log(this.claimAdd);
      }
      else {
        this.messageService.add({
          severity: 'warn',
          // summary: 'Claim',
          // detail: "Solo se pueden seleccionar 2 motivos por commodity",
          summary: this.translateService.instant('module.directClaims.moduleName', "moduleName"),
          detail: this.translateService.instant('module.alerts.warningClaim', "errorWeb"),
          life: 8000,
        });
      }
    } else {
      var tamañoTabla = this.claimAdd.length;
      for (let indexA = 0; indexA < tamañoTabla; indexA++) {
        if (this.claimAdd[indexA].commodityCode == this.fcd.commodityCode.value.label && this.claimAdd[indexA].masterDocumentNumber == this.claimSummary.masterDocumentNumber && this.claimAdd[indexA].shipmentPrefix == this.claimSummary.shipmentPrefix && this.claimAdd[indexA].reasonCode == this.fcd.reasonCode.value[indexA].name) {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('module.directClaims.moduleName', "moduleName"),
            detail: this.translateService.instant('module.alerts.warningAddClaimTable', "errorWeb"),
            life: 8000,
          });
        }
        else {
          this.claimSummary.claimDetails;
          if (this.fcd.reasonCode.value.length <= 2) {
            this.claimAdd.push({
              claimReferenceNumber: "0",
              claimantCode: this.fcs.claimantCode.value,
              stationCode: environment.stationCode,   //fcs.stationCode.value,
              shipmentPrefix: prefix,
              documentOwnerId: "1" + prefix,
              masterDocumentNumber: guide,
              sequenceNumber: "1",
              duplicateNumber: "1",
              companyCode: "AV",
              claimDate: currentDate,
              nature: "",
              communicationMode: "M",
              claimStatus: "N",
              totalClaimAmount: this.fcd.totalAmount.value,
              totalClaimAmountCurrency: "USD",
              totalApprovedAmount: 0,
              totalApprovedAmountCurrency: "USD",
              carrierLiabilityAmount: "",
              carrierLiabilityAmountCurrency: "USD",
              claimantName: this.fcs.claimantName.value,
              claimantAddress1: this.fcs.claimantAddress1.value,
              claimantAddress2: this.fcs.claimantAddress1.value,
              claimantZipCode: this.fcs.claimantZipCode.value,
              claimantCountry: this.fcs.claimantCountry.value.toString(),
              claimantTelephoneNumber: this.fcs.claimantTelephoneNumber.value.toString(),
              claimantFax: this.fcs.claimantFax.toString(),
              claimantEmail: this.fcs.claimantEmail.value,
              claimantCompany: this.fcs.claimantCompany.value,
              invoiceNumber: this.fcs.invoiceNumber.value.toString(),
              claimDescription: this.fcs.claimDescription.value,
              otherAmount: this.fcd.otherAmount.value,
              totalAmount: this.fcd.totalAmount.value,
              remarks: this.fcs.claimDescription.value,
              numberOfPieces: this.fcd.numberOfPieces.value,
              weight: this.fcd.weight.value,
              weightUnit: "L",
              volume: 0,
              volumeUnit: "",
              portOfDelivery: this.fcd.portOfDelivery.value.toString(),
              stationResposible: this.fcd.stationResposible.value,
              claimAmount: this.fcd.claimAmount.value,
              claimAmountCurrency: "USD",
              approvedAmount: "0",
              approvedAmountCurrency: "USD",
              reasonCodeId: this.fcd.reasonCode.value[indexA].key,
              reasonCodeName: this.fcd.reasonCode.value[indexA].name,
              reasonCode: this.fcd.reasonCode.value[indexA].code,
              commodityCode: this.fcd.commodityCode.value.value,
              commodityCodeName: this.fcd.commodityCode.value.label,
              commodityCodeId: this.fcd.commodityCode.value.id,
              claimDetailsSerialNumber: "",
              severity: "H",
              investigationResults: "",
              approvalCateogry: "",
              operationalFlag: "I"
            });

            this.createHidden = false;

          }
          else {
            this.messageService.add({
              severity: 'warn',
              // summary: 'Claim',
              // detail: "Solo se pueden seleccionar 2 motivos por commodity",
              summary: this.translateService.instant('module.directClaims.moduleName', "moduleName"),
              detail: this.translateService.instant('module.alerts.warningClaim', "errorWeb"),
              life: 8000,
            });
          }
        }
      }
    }

  }



  confirmAWB() {
    if (this.fa.confirmarAwb) {
      var str = this.fa.confirmarAwb.value.toString();
      this.awbNumber = str;
      var prefix = str.substring(0, 3);
      var guide = str.substring(3);
      this.transactionService.GetList(environment.claimsAPI, this.constantService.CLAIM_URL, '/' + 'VerifyClaim' + '/' + prefix + '/' + guide).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            if (!data.businessDto[0].claimExist) {
              //this.getAwbDetails();
              this.directClaimsHeaderForm.reset(
                {
                  confirmarAwb: null,
                  airline: "AV"
                },
                { onlySelf: false, emitEvent: false }
              );
              this.messageService.add({
                severity: 'success',
                summary: 'Claims',
                detail: this.translateService.instant(data.responseDto.message, "moduleName"),
                life: 8000,
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Claims',
                detail: this.translateService.instant(data.responseDto.message, "moduleName"),
                life: 8000,
              });
            }
          }
          else {
            this.getAwbDetails();
            this.messageService.add({
              severity: 'warn',
              summary: 'Claims',
              detail: this.translateService.instant(data.responseDto.message, "moduleName"),
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Por favor, intente nuevamente.',
            detail: 'Por favor, intente más tarde.',
          });
        }
      );
    }
  }


  getAwbDetails() {
    if (this.fa.confirmarAwb) {
      var str = this.fa.confirmarAwb.value.toString();
      this.awbNumber = str;
      var prefix = this.awbNumber.substring(0, 3);
      var guide = this.awbNumber.substring(3);
      var sourceSystem = this.fa.airline.value.toString();
      this.sourceSystemValue = sourceSystem;

      this.transactionService.GetList(environment.claimsAPI, this.constantService.ICARGO_URL, '/' + 'GetAwbDetails' + '/' + sourceSystem + '/' + prefix + '/' + guide).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {

            this.directClaimsHeaderForm.reset(
              {
                confirmarAwb: null
              },
              { onlySelf: false, emitEvent: false }
            );

            this.awb = data.businessDto[0];
            console.log(this.awb);
            this.flightBooking = data.businessDto[0].flightBooking;


            this.fcd.portOfDelivery.setValue(data.businessDto[0].awbDestination);
            this.fcd.totalAmount.setValue(data.businessDto[0].totalClaimAmount);

            this.selectionLabel = this.translateService.instant('module.directClaims.associatedStation', "moduleName");

            this.options = new Array();
            this.options.push({ label: this.selectionLabel });

            for (let index = 0; index < this.flightBooking.length; index++) {
              this.options.push({ label: data.businessDto[0].flightBooking[index].flightSegmentOrigin });
              this.options.push({ label: data.businessDto[0].flightBooking[index].flightSegmentDestination });
            }

            var flags = [], output = [], l = this.options.length, i;
            for (i = 0; i < l; i++) {
              if (flags[this.options[i].label]) continue;
              flags[this.options[i].label] = true;
              output.push({ label: this.options[i].label });
            }
            this.options = output;

            this.hiddenClaim = false;
            this.hiddenClaimReason = false;
            //this.createHidden = false;

          } else {
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
            detail: error,
            life: 8000,
          });
        }
      );
      this.confirm = false;
    }
  }


  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }


  propagateChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    this.selectionStation = value;
  }
  onChange(event): void {
    /* this.zone.run(() => {
      this.propagateChange(this.selectionStation);
    }); */
    this.fcd.stationResposible.setValue(event.value.label);
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
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
      this.claimAttachment.remarks = this.fcd.attachmentRemark.value == undefined ? "" : this.fcd.attachmentRemark.value.toString();
      this.claimSummary.claimAttachments.push(this.claimAttachment);
      this.fcd.attachmentRemark.reset("");
      this.messageService.add({ severity: 'info', summary: this.translateService.instant('module.directClaims.fileUploaded', "moduleName"), detail: '' });
      //console.log(this.claimSummary.claimAttachments);

    } else {
      this.claimAttachment = new ClaimAttachment();
      this.claimAttachment.fileName = this.attachmentName;
      this.claimAttachment.fileData = this.attachmentData;
      this.claimAttachment.operationalFlag = "I";
      this.claimAttachment.remarks = this.fcd.attachmentRemark.value == undefined ? "" : this.fcd.attachmentRemark.value.toString();
      this.claimSummary.claimAttachments.push(this.claimAttachment);
      this.fcd.attachmentRemark.reset("");
      this.messageService.add({ severity: 'info', summary: this.translateService.instant('module.directClaims.fileUploaded', "moduleName"), detail: '' });
      //console.log(this.claimSummary.claimAttachments);
    }

  }

  deleteFile(attachment: ClaimAttachment) {
    this.confirmationService.confirm({
      message: this.translateService.instant('module.directClaims.deleteFile', "moduleName") + '  ' + attachment.fileName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.claimSummary.claimAttachments = this.claimSummary.claimAttachments.filter(val => val.fileName !== attachment.fileName);
        this.loading = true;
        this.messageService.add({ severity: 'success', summary: this.translateService.instant('module.directClaims.files', "moduleName"), detail: this.translateService.instant('module.directClaims.fileDeleted', "moduleName"), life: 3000 });
      }
    });
  }

  deletePreparedClaim(claim: Claim) {
    this.confirmationService.confirm({
      message: this.translateService.instant('module.directClaims.deleteFile', "moduleName") + '  ' + claim.shipmentPrefix + claim.masterDocumentNumber + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.claimAdd = this.claimAdd.filter(val => val.masterDocumentNumber !== claim.masterDocumentNumber.toString());

        this.messageService.add({ severity: 'success', summary: this.translateService.instant('module.directClaims.tableClaim', "moduleName"), detail: this.translateService.instant('module.directClaims.tableClaimReset', "moduleName"), life: 3000 });
      }
    });
  }


}
