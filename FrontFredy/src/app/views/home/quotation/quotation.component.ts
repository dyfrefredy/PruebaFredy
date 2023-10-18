import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { Quotation } from '../../../model/quotation';
import { QuoteDetails } from '../../../model/quote-details';
import { TransactionService } from '../../../services/transaction.service';
import { TranslateService } from "@ngx-translate/core";
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../model/user';
import { UsingPerishable } from '../../../model/using-perishable';
import { Perishable } from '../../../model/perishable';
import { QuotationAnimal } from '../../../model/quotationAnimal';
import IATACode from '../../../IATACode/IATACode.json';
import  moment  from 'moment-timezone';
import { LoadTypeService } from '../../../enumeration/load-type';
import { UsingPharma } from '../../../model/using-pharma';
import { Container } from '../../../model/container';
import { DryIceResupply } from '../../../model/dry-ice-resupply';
import { Positioning } from '../../../model/positioning';
import { PackagingPassive } from '../../../model/packaging-passive';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {
  submitted: boolean;
  submitted2: boolean;
  loading: boolean;
  quotationForm: FormGroup;
  quoteDetailsForm: FormGroup;
  emailForm: FormGroup;
  validateQuotationDetailsOk: boolean;
  originCity: any;
  destinationCity: any;
  temperatureControl: String = "";
  quotationCreatedSuccessfully: boolean;

  quotation: Quotation;
  quoteDetails: QuoteDetails;
  listQuoteDetails: QuoteDetails[];
  contQuoteDetails: number = 0;
  countries: Array<{ label: string; value: any }>;
  options: Array<{ label: string; value: any }>;
  userLogin: User;
  isLogin: boolean = false;
  originStationName : String = 'MIAMI AIRPORT';
  perishablesDialog: boolean;
  usingPerishable: UsingPerishable;
  perishable: Perishable;
  emailDialog: boolean = false;
  emails: Array<{ label: String; value: any }>;
  emailInput: String;
  quotationAnimalDialog: boolean = false;

  pharmaDialog: boolean;
  usingPharma: UsingPharma;
  submittedUsingPharma: boolean;
  container: Container;
  containerForm: FormGroup;
  submittedContainer: boolean;
  dryIceDialog: boolean;
  submittedDryIce: boolean;
  positioningDialog: boolean;
  submittedPositioning: boolean;
  repositioningDialog: boolean;
  submittedRepositioning: boolean;
  validateQuotationContainerOk: boolean;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private storageService: StorageService,
    private authService: AuthService,
    private loadTypeService: LoadTypeService) {

    this.userLogin = this.authService.currentUserValue;
    this.quotationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      customerTypeId: ['', Validators.required],
      description: ['', Validators.required],
      loadTypeId: ['', Validators.required],
      company: [''],
      originCity: ['', Validators.required],
      destinationCity: ['', Validators.required],
      removable: ['', Validators.required],
      customerQuoteId: [''],
      emailOption: ['']
    });

    this.quoteDetailsForm = this.fb.group({
      numberPieces: ['', Validators.required],
      width: ['', Validators.required],
      high: ['', Validators.required],
      depth: ['', Validators.required],
      weight: ['', Validators.required],
      weightUnitId: ['', Validators.required],
      lengthUnitId: ['', Validators.required]
    });

    this.validateQuotationDetailsOk = true;
    this.getCitysByName(this.originStationName);
    this.usingPerishable = new UsingPerishable();
    this.perishable = new Perishable();

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });

    this.newUsingPharma();

    this.containerForm = this.fb.group({
      quantityContainers: ['', Validators.required],
      containerTypeId: ['', Validators.required],
      temperatureRangeId: ['', Validators.required],
      dryIceRessupply: ['', Validators.required],
      positioning: ['', Validators.required],
      repositioning: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.quotation = new Quotation();
    this.quotation.quotationAnimal = new QuotationAnimal();
    this.quotation.quotationAnimal.animalAmount = 0;
    this.quotation.quotationAnimal.active = true;
    this.quoteDetails = new QuoteDetails();
    this.listQuoteDetails = [];
    this.submitted2 = false;
    this.validateQuotationDetailsOk = true;
    this.isLogin = this.userLogin != undefined;
    this.quotation.name = this.userLogin?.firstName;
    this.quotation.company = this.userLogin?.userCtsDetail?.companyName ?? "";
    this.quotation.email = this.userLogin?.email;
    this.quotation.customerTypeId = this.userLogin?.userCtsDetail?.companyTypeId ?? 0;
    this.getCitysByName(this.originStationName);
    this.emails = new Array();
    this.quotationCreatedSuccessfully = false;
  }

  get f() {
    return this.quotationForm.controls;
  }

  get f2() {
    return this.quoteDetailsForm.controls;
  }

  get f3() {
    return this.emailForm.controls;
  }

  get fContainer() {
    return this.containerForm.controls;
  }

  deleteQuoteDetails(rowIndex: any) {
    this.listQuoteDetails.splice(rowIndex, 1);

    if (this.listQuoteDetails != null && this.listQuoteDetails.length > 0) {
      this.validateQuotationDetailsOk = false;
    } else {
      this.validateQuotationDetailsOk = true;
    }
  }

  addQuoteDetails() {
    this.submitted2 = false;
    this.loading = true;

    if (this.quoteDetailsForm.invalid) {
      this.submitted2 = true;
      this.loading = false;
      return;
    }
    
    let quotation = new QuoteDetails();
    quotation.id = this.quoteDetails.id;
    quotation.pieces = this.quoteDetails.pieces;
    quotation.width = this.quoteDetails.width;
    quotation.weightUnitId = this.quoteDetails.weightUnitId;
    quotation.weightUnitDesc = this.quoteDetails.weightUnitDesc;
    quotation.high = this.quoteDetails.high;
    quotation.depth = this.quoteDetails.depth;
    quotation.weight = this.quoteDetails.weight;
    quotation.lengthUnitId = this.quoteDetails.lengthUnitId;
    quotation.lengthUnitDesc = this.quoteDetails.lengthUnitDesc;
    this.listQuoteDetails.push(quotation);

    if (this.listQuoteDetails != null && this.listQuoteDetails.length > 0) {
      this.validateQuotationDetailsOk = false;
    } else {
      this.validateQuotationDetailsOk = true;
    }

    this.quoteDetailsForm.reset(
      { onlySelf: false, emitEvent: false }
    );

    this.loading = false;
  }

  save() {
    this.loading = true;
    this.submitted = true;

    if (this.quotationForm.invalid || 
      (this.listQuoteDetails.length <= 0 && this.quotation.loadTypeId != this.loadTypeService.pharmaceutical) ||
      (this.listQuoteDetails.length <= 0 &&
        (this.quotation.loadTypeId == this.loadTypeService.pharmaceutical && this.quotation.usingPharma.containers.length <= 0)
      )
    ) {
      this.loading = false;
      return;
    }

    let lang = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE).lang

    if (lang == "en") this.quotation.languageId = 1;
    else if (lang == "es") this.quotation.languageId = 2;

    this.quotation.originStationId = this.originCity.id;
    this.quotation.destinationStationId = this.destinationCity.id;
    this.quotation.quoteDetails = this.listQuoteDetails;
    let timeZone = IATACode.find(x=> x.IATA == this.originCity.name);
    let dateTimeZone=  moment().tz(timeZone.timeZone).format();
    this.quotation.creationDateTimeZone = dateTimeZone;
    
    if (this.quotation.loadTypeId != this.loadTypeService.pharmaceutical)
      this.quotation.usingPharma = undefined;

    this.quotation.userCreatedId = this.userLogin?.id;

    this.transactionService.save(environment.adminAPI, this.constantService.QUOTATION_URL, this.quotation).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.quotationCreatedSuccessfully = true;
          this.submitted = false;
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
            detail: this.translateService.instant('module.quote.quotation.success', "success") + data.businessDto[0].id,
            sticky: true,
          });

        } else {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
            detail: data.responseDto.message + ', ' + this.translateService.instant('module.alerts.errorApi', "errorApi"),
            life: 8000,
          });
        }

        this.loading = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
          detail: this.translateService.instant('module.alerts.errorWeb', "errorWeb"),
          life: 8000,
        });

        this.loading = false;
      }
    );
  }

  getCitysByName(query: String) {
    this.transactionService.GetList(environment.adminAPI, this.constantService.STATION_URL, '/GetStationByName/' + query).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.originCity = data.businessDto[0];
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  addEmail() {
    if (this.emailForm.invalid && this.emails.length > 10) {
      return;
    }
    this.emails.push({ label: this.emailInput, value: this.emailInput });
    this.emailInput = "";


  }

  deleteEmail(rowIndex: any) {
    this.emails.splice(rowIndex, 1);
  }

  saveEmail() {
    this.quotation.optionalEmail = this.emails.map(_=> _.value).join(";");
    this.emailDialog = false;
    
  }

  loadTypeChange() {
    this.pharmaDialog = false;
    this.perishablesDialog = false;
    this.quotationAnimalDialog = false;

    if(this.quotation.loadTypeId == this.loadTypeService.liveAnimals)
      this.quotationAnimalDialog = true;

    if (this.quotation.loadTypeId == this.loadTypeService.perishable)
      this.perishablesDialog = true;

    if (this.quotation.loadTypeId == this.loadTypeService.pharmaceutical) {
      this.newContainer();
      this.pharmaDialog = true;
    }    
  }

  hidePerishablesDialog() {
    this.perishablesDialog = false;
  }

  createPerishable() {
    if (this.temperatureControl == 'Yes') {
      this.quotation.usingPerishable = new UsingPerishable();
      if(this.perishable.id != 0){
        this.quotation.usingPerishable.perishableId = this.perishable.id;
      }
    }

    this.perishablesDialog = false;
  }

  newUsingPharma() {
    this.usingPharma = new UsingPharma();
    this.usingPharma.packagingPassive = new PackagingPassive();
    this.usingPharma.containers = [];
    this.newContainer();
  }

  newContainer() {
    this.container = new Container();
    this.container.dryIceResupply = new DryIceResupply();
    this.container.dryIceResupply.quantity = 0;
    this.container.positioning = new Positioning();
  }

  cancelPharmaDialog() {
    this.newUsingPharma();
    this.quotation.loadTypeId = 0;
    this.pharmaDialog = false;
  }

  receiveVariableName(variableName: String) {
    if (variableName == "dryIceRessupplyAnswer" && this.container.dryIceResupplyAnswer == "Yes")
      this.dryIceDialog = true;

    if (variableName == "positioningAnswer" && this.container.positioningAnswer == "Yes")
      this.positioningDialog = true;

    if (variableName == "repositioningAnswer" && this.container.repositioningAnswer == "Yes")
      this.repositioningDialog = true;
  }

  receiveDescContainerType(description: String){
    this.container.containerTypeDesc = description; 
  }

  receiveDescTemperatureRange(description: String){
    this.container.temperatureRangeDesc = description; 
  }

  cancelDryIceDialog() {
    this.container.dryIceResupply = new DryIceResupply();
    this.container.dryIceResupplyAnswer = undefined;
    this.submittedDryIce = false;
    this.dryIceDialog = false;
  }

  createDryIceDialog() {
    this.submittedDryIce = true;

    if (this.container.dryIceResupply.quantity == 0 || !this.container.dryIceResupply.quantity ||
      !this.container.dryIceResupply.station)
      return;

    this.dryIceDialog = false;
    this.submittedDryIce = false;
  }

  cancelPositioning() {
    this.container.positioning = new Positioning();
    this.container.positioningAnswer = undefined;
    this.submittedPositioning = false;
    this.positioningDialog = false;
  }

  createPositioning() {
    this.submittedPositioning = true;

    if (!this.container.positioning.originStation || !this.container.positioning.destinationStation)
      return;

    this.positioningDialog = false;
    this.submittedPositioning = false;
  }

  cancelRepositioning() {
    this.container.repositioningStationId = 0;
    this.container.repositioningAnswer = undefined;
    this.submittedRepositioning = false;
    this.repositioningDialog = false;
  }

  createRepositioning() {
    this.submittedRepositioning = true;

    if (!this.container.repositioningStation)
      return;

    this.repositioningDialog = false;
    this.submittedRepositioning = false;
  }

  addQuoteContainer() {
    this.submittedContainer = false;
    this.loading = true;

    if (this.containerForm.invalid) {
      this.submittedContainer = true;
      this.loading = false;
      return;
    }

    if (this.container.dryIceResupplyAnswer == "Yes")
      this.container.dryIceResupply.stationId = this.container.dryIceResupply.station.id;
    else
      this.container.dryIceResupply = undefined;

    if (this.container.positioningAnswer == "Yes") {
      this.container.positioning.originStationId = this.container.positioning.originStation.id;
      this.container.positioning.destinationStationId = this.container.positioning.destinationStation.id;
    }
    else
      this.container.positioning = undefined;

    if (this.container.repositioningAnswer == "Yes")
      this.container.repositioningStationId = this.container.repositioningStation.id;
    else
      this.container.repositioningStationId = undefined;

    this.container.repositioningStation = undefined;

    this.usingPharma.containers.push(this.container);
    this.newContainer();
  }

  deleteQuoteContainer(rowIndex: any) {
    this.usingPharma.containers.splice(rowIndex, 1);

    if (this.usingPharma.containers != null && this.usingPharma.containers.length > 0) {
      this.validateQuotationContainerOk = false;
    } else {
      this.validateQuotationContainerOk = true;
    }
  }

  savePharmaDialog() {
    this.loading = true;
    this.submittedUsingPharma = false;

    if (
      !this.usingPharma.temperatureControl ||
      (this.usingPharma.temperatureControl == "Yes" && !this.usingPharma.packagingTypeAnswer)|| 
      (this.usingPharma.temperatureControl == "Yes" && this.usingPharma.packagingTypeAnswer == "Active" && this.usingPharma.containers.length < 1)) {
      this.submittedUsingPharma = true;
      this.loading = false;
      return;
    }

    this.quotation.usingPharma = new UsingPharma();
    this.quotation.usingPharma.dangerousGoodsCode = this.usingPharma.dangerousGoodsCode;
    this.quotation.usingPharma.temperatureControl = this.usingPharma.temperatureControl;
        
    if (this.usingPharma.temperatureControl == "Yes" && this.usingPharma.packagingTypeAnswer == 'Passive') {
      if (this.usingPharma.packagingPassive.packagingLifetime > 0 || this.usingPharma.packagingPassive.packagingDescription.length > 0) {
        this.quotation.usingPharma.packagingPassive = new PackagingPassive();
        this.quotation.usingPharma.packagingPassive.packagingLifetime = this.usingPharma.packagingPassive.packagingLifetime;
        this.quotation.usingPharma.packagingPassive.packagingDescription = this.usingPharma.packagingPassive.packagingDescription;
      }
    }
    
    if (this.usingPharma.temperatureControl == "Yes" && this.usingPharma.packagingTypeAnswer == 'Active')
      this.quotation.usingPharma.containers = this.usingPharma.containers;

    this.loading = false;
    this.pharmaDialog = false;
  }

  receiveMeasurementUnit(description: String){
    this.quoteDetails.weightUnitDesc = description;
  }
  
  receiveLengthUnit(description: String){
    this.quoteDetails.lengthUnitDesc = description;
  }

  newQuotation() {
    window.location.reload();
  }
}
