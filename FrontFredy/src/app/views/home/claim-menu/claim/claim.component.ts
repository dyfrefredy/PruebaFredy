import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Claim } from '../../../../model/claim';
import { User } from '../../../../model/user';
import { Awb } from '../../../../model/awb';
import { ClaimDetail } from '../../../../model/claim-detaill';
import { ClaimSummary } from '../../../../model/claim-summary';
import { FlightBooking } from '../../../../model/flight-booking.model';
import { TransactionService } from '../../../../services/transaction.service';
import { AuthService } from '../../../../services/auth.service';
import { ConstantService } from '../../../../constant/constant-service';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';

import { ClaimAttachment } from '../../../../model/claim-attachment.model';
import { StorageService } from '../../../../services/storage.service';
import moment from 'moment';
import { ShipmentDetailsFilter } from '../../../../model/shipment-details-filter.model';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit {
  typeClaim: Boolean = false;
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
    daughterDocumentNumber: String;
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
    operationalFlag: String;
    insertBD:boolean;
  }>;

  shipmentDetailFilter : ShipmentDetailsFilter;
  selectionStation: any;
  selectedValue: string;
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

  claimDate: string;

  attachmentName: string;
  attachmentData: string;
  attachmentRemark: string;
  base64textString: string;


  initialValuesDetail: any;
  initialValuesSummary: any;
  initialValuesHeader: any;

  loadedDocument: boolean;
  isValidAwb: boolean;
  isfieldRequired:boolean;
  claimSummaryFormValid: Array<{ key: string, value:string }>;
  claimDetailFormValid: Array<{ key: string, value:string }>;

  //lang = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE).lang




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

    this.loading = false;

    this.monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    this.stateOptions = [{ label: 'Avianca', value: 'AV' }, { label: 'Aerounion', value: 'AEROUNION' }];

    this.directClaimsHeaderForm = this.fb.group({
      confirmarAwb: [''],
      airline: ['AV'],
    })
    
    this.shipmentDetailFilter = new ShipmentDetailsFilter();
    this.claimSummaryFormValid = new Array();
    this.claimSummaryFormValid.push({key: 'claimantName', value: 'module.directClaims.claimantName'});
    this.claimSummaryFormValid.push({key: 'claimantCompany', value: 'module.directClaims.claimantCompany'});
    this.claimSummaryFormValid.push({key: 'claimantAddress1', value: 'module.directClaims.claimantAdress'});
    this.claimSummaryFormValid.push({key: 'claimantEmail', value: 'module.directClaims.claimantEmail'});
    this.claimSummaryFormValid.push({key: 'claimDescription', value: 'module.directClaims.claimDescription'});
    this.claimSummaryFormValid.push({key: 'claimantTelephoneNumber', value: 'module.directClaims.claimantPhone'});
    this.claimSummaryFormValid.push({key: 'stationResposible', value: 'module.directClaims.responsibleEstation'});
    this.isValidAwb = false;
    this.isfieldRequired = false;
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
      totalClaimAmount: [''],
      totalClaimAmountCurrency: [''],
      totalApprovedAmountCurrency: [''],
      totalApprovedAmount: [''],
      carrierLiabilityAmount: [''],
      carrierLiabilityAmountCurrency: [''],
      flightArrivalDate: [''],
      flightDepartureDate: [''],
      claimantName: new FormControl('', [
        Validators.required]),
      claimantCompany: new FormControl('', [
        Validators.required]),
      claimantAddress1: new FormControl('', [
        Validators.required]),
      daughterDocumentNumber:[''],
      claimantAddress2: [''],
      claimantZipCode: [''],
      claimantCountry: [''],
      claimantTelephoneNumber: new FormControl('', [
        Validators.required]),
      claimantFax: [''],
      claimantEmail: new FormControl('', [
        Validators.required,
        Validators.email]),
      claimDescription: ['', Validators.required],
      invoiceNumber: [''],
      stationResposible:  ['', Validators.required]
    });


    this.claimDetailFormValid = new Array();
    this.claimDetailFormValid.push({key: 'numberOfPieces', value: 'module.directClaims.pieces'});
    this.claimDetailFormValid.push({key: 'weight', value: 'module.directClaims.weight'});
    this.claimDetailFormValid.push({key: 'claimAmount', value: 'module.directClaims.claimAmount'});
    this.claimDetailFormValid.push({key: 'approvedAmount', value: 'module.directClaims.cargoAmount'});
    this.claimDetailFormValid.push({key: 'otherAmount', value: 'module.directClaims.otherAmount'});
    this.claimDetailForm = this.fb.group({
      numberOfPieces: new FormControl('', [
        Validators.required]),
        weight: new FormControl('', [
          Validators.required]),
      weightUnit: [''],
      volume: [''],
      volumeUnit: [''],
      portOfDelivery: new FormControl({ value: '', disabled: true }),      
      claimAmount: new FormControl('0', [
        Validators.required,
        Validators.pattern(/^[0-9]{1,7}(\.[0-9]{1,2})?$/)]),
      claimAmountCurrency: [''],
      approvedAmount: new FormControl('0', [
        Validators.required,
        Validators.pattern(/^[0-9]{1,7}(\.[0-9]{1,2})?$/)]),
      approvedAmountCurrency: [''],
      reasonCode: [''],
      commodityCode: [''],
      claimDetailsSerialNumber: [''],
      severity: [''],
      investigationResults: [''],
      approvalCateogry: [''],
      operationalFlag: [''],
      otherAmount: new FormControl('0', [
        Validators.required,
        Validators.pattern(/^[0-9]{1,7}(\.[0-9]{1,2})?$/)]),
      totalAmount: new FormControl({ value: '0', disabled: true }),
      attachment: [''],
      attachmentRemark: new FormControl({ value: ("").toString() }),
    });
  }


  ngOnInit(): void {

    this.attachmentData = "";
    this.claim = new Claim();
    this.awb = new Awb();

    this.claimDetail = new ClaimDetail();
    this.claimAttachment = new ClaimAttachment();
    this.claimSummary = new ClaimSummary();
    this.claimAdd = new Array();
    this.aClaimDetails = new Array();
    var today = new Date();
    this.claimDate = String(today.getDate()).padStart(2, '0') + '-' + (this.monthNames[today.getMonth()]) + '-' + today.getFullYear();

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
    this.loadedDocument = false;

    this.initialValuesDetail = this.claimDetailForm.value;
    this.initialValuesSummary = this.claimSummaryForm.value;
    this.initialValuesHeader = this.directClaimsHeaderForm.value;



    this.confirmation();

  }


  sumValues() {
    this.fcd.totalAmount.reset();

    var claimAmount = this.fcd.claimAmount.value == "" ? 0 : this.fcd.claimAmount.value;
    var approvedAmount = this.fcd.approvedAmount.value == "" ? 0 : this.fcd.approvedAmount.value;
    var otherAmount = this.fcd.otherAmount.value == "" ? 0 : this.fcd.otherAmount.value;

    this.fcd.totalAmount.setValue(Number(claimAmount) + Number(approvedAmount) + Number(otherAmount));
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
    this.loading = true;
    this.createHidden = true;
    this.submitted = true;
    this.sumValues();
     if (this.claimDetailForm.invalid || this.claimSummaryForm.invalid || this.directClaimsHeaderForm.invalid) {
       this.loading = false;
       this.createHidden = false;
       this.isfieldRequired = true;
       let messageClaimSummary = '';
       let messageClaimDetail = '';
       
      this.messageService.add({
        severity: 'warn',
        summary: 'Claim',
        detail: this.translateService.instant("module.directClaims.fieldRequired", "moduleName"),
      });
      Object.keys(this.claimSummaryForm.controls).forEach(key => {
      
        if(this.claimSummaryForm.get(key).invalid){
          let messa = this.claimSummaryFormValid.filter(x=> x.key == key);
          messageClaimSummary += `${this.translateService.instant(messa[0].value, "moduleName")},`;
        }
      });

      Object.keys(this.claimDetailForm.controls).forEach(key => {
      
        if(this.claimDetailForm.get(key).invalid){
          let messa = this.claimDetailFormValid.filter(x=> x.key == key);
          messageClaimDetail += `${this.translateService.instant(messa[0].value, "moduleName")},`;
        }
      });
      
      this.messageService.add({
        severity: 'warn',
        summary: this.translateService.instant("module.directClaims.claim", "moduleName"),
        detail: messageClaimSummary
      });

      this.messageService.add({
        severity: 'warn',
        summary: this.translateService.instant("module.directClaims.claimReason", "moduleName"),
        detail: messageClaimDetail
      });
       
       return;
     }

     this.loading = true;
    var prefix = this.awbNumber.substring(0, 3);
    var guide = this.awbNumber.substring(3);
    var today = new Date();
    var currentDate = String(today.getDate()).padStart(2, '0') + '-' + (this.monthNames[today.getMonth()]) + '-' + today.getFullYear();
    let descripInvoice = this.fcs.invoiceNumber.value.toString() == undefined ? "" : ' \nHAWB: ' + this.fcs.daughterDocumentNumber.value.toString();
    let descripCompany = ' \nCOM: ' + "AV";
    // let hawb = this.fcs.daughterDocumentNumber.value != '' && this.fcs.daughterDocumentNumber.value != undefined ? `\nHAWB: ${this.fcs.daughterDocumentNumber.value}` : '';

    this.claimSummary.claimReferenceNumber = "0";
    this.claimSummary.claimantCode = this.fcs.claimantCode.value;
    this.claimSummary.stationCode = environment.stationCode;
    this.claimSummary.shipmentPrefix = prefix;
    this.claimSummary.documentOwnerId = "1" + prefix;
    this.claimSummary.masterDocumentNumber = guide;
    this.claimSummary.sequenceNumber = this.shipmentDetailFilter.sequenceNumber;
    this.claimSummary.duplicateNumber = this.shipmentDetailFilter.duplicateNumber;
    this.claimSummary.companyCode = "AV";
    this.claimSummary.claimDate = currentDate;
    this.claimSummary.communicationMode = "M";
    this.claimSummary.claimStatus = "N";
    this.claimSummary.totalClaimAmount = Number(this.fcd.totalAmount.value);
    this.claimSummary.totalClaimAmountCurrency = "USD";
    this.claimSummary.claimantName = this.fcs.claimantName.value;
    this.claimSummary.claimantAddress1 = this.fcs.claimantAddress1.value;
    this.claimSummary.daughterDocumentNumber = this.fcs.daughterDocumentNumber.value;
    this.claimSummary.claimantAddress2 = this.fcs.claimantAddress2.value;
    this.claimSummary.claimantZipCode = this.fcs.claimantZipCode.value == "" ? "0" : this.fcs.claimantZipCode.value;
    this.claimSummary.claimantCountry = this.fcs.claimantCountry.value.toString();
    this.claimSummary.claimantTelephoneNumber = this.fcs.claimantTelephoneNumber.value.toString();
    this.claimSummary.claimantEmail = this.fcs.claimantEmail.value;
    this.claimSummary.remarks = this.fcs.claimDescription.value + "  " + descripInvoice + "  " + descripCompany;
    this.claimSummary.sourceSystem = this.sourceSystemValue.toString();
    this.claimSummary.arrivalDate = new Date(moment(this.flightBooking[this.flightBooking.length - 1].arrivalDate).format("YYYY/MM/DD"));
    this.claimSummary.claimDetails = [];
    

    this.fcd.reasonCode.value.forEach(x => {
      this.claimDetail = new ClaimDetail();
      this.claimDetail.numberOfPieces = this.fcd.numberOfPieces.value;
      this.claimDetail.weight = this.fcd.weight.value;
      this.claimDetail.weightUnit = "K";
      this.claimDetail.volume = 0;
      this.claimDetail.volumeUnit = "";
      this.claimDetail.portOfDelivery = this.fcd.portOfDelivery.value.toString();
      this.claimDetail.stationResposible = this.fcs.stationResposible.value.label;
      this.claimDetail.claimAmount = Number(this.fcd.claimAmount.value);
      this.claimDetail.claimAmountCurrency = "USD";
      this.claimDetail.approvedAmount = "0";
      this.claimDetail.approvedAmountCurrency = "USD";
      this.claimDetail.reasonCode = x.code;
      this.claimDetail.commodityCode = this.fcd.commodityCode.value.value;
      this.claimDetail.claimDetailsSerialNumber = "";
      this.claimDetail.severity = "H";
      this.claimDetail.investigationResults = "";
      this.claimDetail.approvalCateogry = "";
      this.claimDetail.operationalFlag = "I";
      this.claimDetail.claimRemarks = "";
      this.claimDetail.limitDay = x.limitDays;

      this.claimSummary.claimDetails.push(this.claimDetail);

    });

    this.transactionService.saveClaim(environment.claimsAPI, this.constantService.ICARGO_URL, this.claimSummary)
      .subscribe(
        (data) => {
          this.loading = true;
          if (
            data.responseDto.response === this.constantService.RESPONSE_OK
          ) {
            let claimReferenceNumber = '';
            let reasonCode = '';
            claimReferenceNumber = data.businessDto[0];
            reasonCode = data.businessDto[1];
            //let dataClaim = this.fcd.reasonCode.value.find(x=> x.code == reasonCode);
            this.fcd.reasonCode.value.forEach((x, index) => {

              this.claimAdd.push({
                claimReferenceNumber: "0",
                claimantCode: this.fcs.claimantCode.value,
                stationCode: environment.stationCode,   //fcs.stationCode.value,
                shipmentPrefix: prefix,
                documentOwnerId: "1" + prefix,
                masterDocumentNumber: guide,
                sequenceNumber: this.shipmentDetailFilter.sequenceNumber,
                duplicateNumber: this.shipmentDetailFilter.duplicateNumber,
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
                daughterDocumentNumber: this.fcs.daughterDocumentNumber.value,
                claimantAddress2: this.fcs.claimantAddress2.value,
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
                weightUnit: "K",
                volume: 0,
                volumeUnit: "",
                portOfDelivery: this.fcd.portOfDelivery.value.toString(),
                stationResposible: this.fcs.stationResposible.value.label,
                claimAmount: this.fcd.claimAmount.value,
                claimAmountCurrency: "USD",
                approvedAmount: this.fcd.approvedAmount.value,
                approvedAmountCurrency: "USD",
                reasonCodeId: x.key,
                reasonCodeName: x.name,
                reasonCode: x.code,
                commodityCode: this.fcd.commodityCode.value.value,
                commodityCodeName: this.fcd.commodityCode.value.label,
                commodityCodeId: this.fcd.commodityCode.value.id,
                claimDetailsSerialNumber: "",
                severity: "H",
                investigationResults: "",
                approvalCateogry: "",
                operationalFlag: "I",
                insertBD: reasonCode == x.code
              });
              this.saveClaimDataBase(this.claimAdd[index], claimReferenceNumber);

            });
            
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
              this.createHidden = false;
              this.claimAdd = [];
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Claim',
              detail: error + '. ' +
                      this.translateService.instant("module.directClaims.serviceMessages.error", "moduleName"),
              life: 16000,
            });
            this.createHidden = false;
          }
        );

    // this.loading = false;
    // this.loading = false;
    // this.createHidden = false;
  }

  saveClaimDataBase(claimSummary: any, claimReferenceNumber: string) {

    this.createHidden = true;
    if (this.fa.confirmarAwb) {
      this.createHidden = true;
      var prefix = this.awbNumber.substring(0, 3);
      var guide = this.awbNumber.substring(3);

      var sourceSystem = this.sourceSystemValue;

      var lang = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE).lang

      this.transactionService.GetList(environment.claimsAPI, this.constantService.ICARGO_URL, '/' + 'GetAwbDetails' + '/' + sourceSystem + '/' + prefix + '/' + guide).subscribe(
        (data) => {

          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.createHidden = true;

            this.awb = data.businessDto[0];
            this.flightBooking = data.businessDto[0].flightBooking;
            this.shipmentDetailFilter = data.businessDto[0].shipmentDetailsFilter;

            this.claim = new Claim();
            this.claim.claimReferenceNumber = Number(claimReferenceNumber);
            this.claim.duplicateNumber = Number(this.shipmentDetailFilter.duplicateNumber);
            this.claim.masterDocumentNumber = Number(this.shipmentDetailFilter.masterDocumentNumber);
            this.claim.documentOwnerId = Number(this.shipmentDetailFilter.ownerId);
            this.claim.sequenceNumber = Number(this.shipmentDetailFilter.sequenceNumber);
            this.claim.shipmentPrefix = Number(this.shipmentDetailFilter.shipmentPrefix);
            this.claim.cargoTypeId = Number(claimSummary.commodityCodeId);
            this.claim.claimReasonId = Number(claimSummary.reasonCodeId);
            this.claim.stationClaimCode = claimSummary.stationCode;
            this.claim.stationClaimCodeDest = claimSummary.stationResposible;
            this.claim.claimAmount = Number(claimSummary.claimAmount);
            this.claim.freightAmount = Number(this.fcd.approvedAmount.value);
            this.claim.daughterDocumentNumber = this.fcs.daughterDocumentNumber.value; 
            this.claim.otherAmount = Number(claimSummary.otherAmount);
            this.claim.totalAmount = Number(claimSummary.totalClaimAmount);
            this.claim.ArrivalDate = new Date(moment(this.flightBooking[this.flightBooking.length - 1].arrivalDate).format("YYYY/MM/DD"));
            this.claim.policieAccepted = this.policieAccepted;
            this.claim.policieAcceptedDate = new Date(this.policieAcceptedDate);
            this.claim.isLoaded = this.loadedDocument;
            this.claim.claimantName = claimSummary.claimantName.toString();
            this.claim.email = claimSummary.claimantEmail.toString();
            this.claim.language = lang;
            this.claim.insertBD = claimSummary.insertBD;

            //this.claim.userCreateId = Number(1037)//Number(this.user.id);


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
                  this.claimSummary.claimAttachments = [];

                  this.hiddenClaimReason = true;
                  this.hiddenClaim = true;
                  this.createHidden = true;



                }
                else {
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Claims',
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
                  detail: this.translateService.instant(data.responseDto.message, "moduleName") + '. ' +
                          this.translateService.instant("module.directClaims.serviceMessages.error", "moduleName"),
                  life: 16000,
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
            this.route.navigate(['home/claimMenu']);
          }
          else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Claims',
              detail: this.translateService.instant(data.responseDto.message, "moduleName"),
              life: 8000,
            });

            this.createHidden = false;
            this.directClaimsHeaderForm.reset(this.initialValuesHeader);
            this.claimAdd = [];
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Claim',
            detail: 'Por favor inténtelo de nuevo!' + '. ' +
                    this.translateService.instant("module.directClaims.serviceMessages.error", "moduleName"),
            life: 16000,
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
      );

    }
    this.createHidden = false;
  }

  addClaim() {

    //var str = this.fa.confirmarAwb.value.toString();
    //this.awbNumber = str;
    var prefix = this.awbNumber.substring(0, 3);
    var guide = this.awbNumber.substring(3);
    var today = new Date();
    //var currentDate = String(today. getDate()). padStart(2, '0') + '-' + (this.monthNames[today.getMonth()]) + '-' + today.getFullYear(); //today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
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
            sequenceNumber: this.shipmentDetailFilter.sequenceNumber,
            duplicateNumber: this.shipmentDetailFilter.duplicateNumber,
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
            daughterDocumentNumber:this.fcs.daughterDocumentNumber.value,
            claimantAddress2: this.fcs.claimantAddress2.value,
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
            weightUnit: "K",
            volume: 0,
            volumeUnit: "",
            portOfDelivery: this.fcd.portOfDelivery.value.toString(),
            stationResposible: this.fcs.stationResposible.value.label,
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
            operationalFlag: "I",
            insertBD:false
          });

        }
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
              sequenceNumber: this.shipmentDetailFilter.sequenceNumber,
              duplicateNumber: this.shipmentDetailFilter.duplicateNumber,
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
              daughterDocumentNumber:this.fcs.daughterDocumentNumber.value,
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
              weightUnit: "K",
              volume: 0,
              volumeUnit: "",
              portOfDelivery: this.fcd.portOfDelivery.value.toString(),
              stationResposible: this.fcs.stationResposible.value.label,
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
              operationalFlag: "I",
              insertBD:false
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
            this.hiddenClaim = true;
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
              this.isValidAwb = true;
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
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Por favor, intente nuevamente.',
            detail: 'Por favor, intente más tarde.' + '. ' +
                    this.translateService.instant("module.directClaims.serviceMessages.error", "moduleName"),
            life: 16000
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
            this.messageService.add({
              severity: 'success',
              summary: 'Claims',
              detail: this.translateService.instant("module.directClaims.serviceMessages.claimNoExist", "moduleName"),
              life: 8000,
            });

            this.directClaimsHeaderForm.reset(
              {
                confirmarAwb: null
              },
              { onlySelf: false, emitEvent: false }
            );

            this.awb = data.businessDto[0];

            this.shipmentDetailFilter = data.businessDto[0].shipmentDetailsFilter;
            this.flightBooking = data.businessDto[0].flightBooking;
            //this.claimSummary.claimAttachments = data.businessDto[0].claimAttachments;


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
            this.directClaimsHeaderForm.reset(this.initialValuesHeader);
            //this.createHidden = false;
            this.isValidAwb = true;

          } else {
            this.hiddenClaim = true;
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
            detail: error + '. ' +
              this.translateService.instant("module.directClaims.serviceMessages.error", "moduleName"),
            life: 16000,
          });
        }
      );
      this.confirm = false;
    }
  }

  propagateChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    this.selectionStation = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionStation.value.label);
    });
    //this.fcs.stationResposible.setValue(event.value.label);
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



  loadPolicie() {
    this.policieDialog = true;
  }


  confirmation() {
    this.confirmationService.confirm({
      message: this.translateService.instant('module.directClaims.policies.message', "moduleName"),
      header: this.translateService.instant('module.directClaims.policies.header', "moduleName"),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.messageService.add({ severity: 'info', summary: this.translateService.instant('module.directClaims.policies.summaryConfirmed', "moduleName"), detail: this.translateService.instant('module.directClaims.policies.confirmDetail', "moduleName") });

        var today = new Date();
        this.policieAccepted = true;
        this.policieAcceptedDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        this.route.navigate(['home/claim']);
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ 
              severity: 'error', 
              summary: this.translateService.instant('module.directClaims.policies.summaryReject', "moduleName"), 
              detail: this.translateService.instant('module.directClaims.policies.rejectDetail', "moduleName"),
              life: 8000
            });
            
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
      this.loadedDocument = true;
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
      this.loadedDocument = true;
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

  preliminaryClick() {
    this.typeClaim = false;

    this.fcd.claimAmount.reset("0");
    this.fcd.approvedAmount.reset("0");
    this.fcd.otherAmount.reset("0");
  }
}
