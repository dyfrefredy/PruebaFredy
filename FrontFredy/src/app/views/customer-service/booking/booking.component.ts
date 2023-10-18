import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ConstantService } from '../../../constant/constant-service';
import { BookingModel } from '../../../model/bookingModel';
import { Consignee } from '../../../model/consignee';
import { Shipper } from '../../../model/shipper';
import { TransactionService } from '../../../services/transaction.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../model/user';
import { environment } from '../../../../environments/environment';
import { Quotation } from '../../../model/quotation';
import { ActivatedRoute } from '@angular/router';
import { QuotationAnimal } from '../../../model/quotationAnimal';
import { Perishable } from '../../../model/perishable';
import { UsingPerishable } from '../../../model/using-perishable';
import IATACode from '../../../IATACode/IATACode.json';
import  moment  from 'moment-timezone';
import { Container } from '../../../model/container';
import { UsingPharma } from '../../../model/using-pharma';
import { LoadTypeService } from '../../../enumeration/load-type';
import { PackagingPassive } from '../../../model/packaging-passive';
import { DryIceResupply } from '../../../model/dry-ice-resupply';
import { Positioning } from '../../../model/positioning';
import { BookingDetails } from '../../../model/booking-details';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  submitted: boolean;
  loading: boolean;
  bookingForm: FormGroup;
  originStation: any;
  destinationCity: any;
  quotation: Quotation;
  shipperInfo: Shipper;
  consigneeInfo: Consignee;
  booking: BookingModel;
  shipperDialog: boolean = false;
  submittedShipper: boolean;
  shipperForm: FormGroup;
  cityShipper: any;
  consigneeDialog: boolean = false;
  submittedConsignee: boolean;
  consigneeForm: FormGroup;
  cityConsignee: any;
  userLogin: User;
  warningDialog: boolean = false;
  warningBooking: String;
  quotationId: Number = 0;
  originStationName : String = 'MIAMI AIRPORT';
  commodityAnimalDialog: boolean = false;
  perishablesDialog: boolean;
  temperatureControl: String = "";
  perishable: Perishable;

  pharmaDialog: boolean;
  usingPharma: UsingPharma;
  submittedUsingPharma: boolean;
  container: Container;
  containerForm: FormGroup;
  submittedContainer: boolean;
  dryIceDialog: boolean;
  dryIceResupplyForm: FormGroup;
  submittedDryIce: boolean;
  positioningDialog: boolean;
  submittedPositioning: boolean;
  repositioningDialog: boolean;
  submittedRepositioning: boolean;
  existContainers: boolean = false;

  validateBookingDetailsOk: boolean = false;
  bookingDetailsForm: FormGroup;
  bookingDetail: BookingDetails;
  submittedDetail: boolean;
  bookingCreatedSuccessfully: boolean;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public loadTypeService: LoadTypeService
  ) {
    this.userLogin = this.authService.currentUserValue;

    if (this.route.snapshot.params['id']) {
      this.route.paramMap.subscribe(params => {
        this.quotationId = Number.parseInt(params.get('id'));
        if (this.quotationId != 0)
          this.getQuotationById(this.quotationId);
      });
    }


    this.bookingForm = this.fb.group({
      userName: ['', Validators.required],
      customer: [''],
      docNum: ['', Validators.required],
      quotationId: ['',],
      originStation: ['', Validators.required],
      destinationCity: ['', Validators.required],
      estimatedDeliveryDate: [''],
      loadTypeId: ['', Validators.required],
      //piece: ['', Validators.required],
      //weightKgs: [''],
      volume: [''],
      //measurementUnit: ['', Validators.required],
      //chargeableWeight: ['', Validators.required],
      rate: ['', Validators.required],
      shc: [''],
      bookingInstruction: [''],
      flightNumber: [''],
      estimatedFlightDate: ['', Validators.required],
      company: [''],
      //lengthUnitId: ['', Validators.required],
      //weightUnitId: ['', Validators.required],
      removable: ['', Validators.required],
      description: ['', Validators.required],
      comment: [''],
      paymentMode: ['', Validators.required],
      shipperInformation: ['', Validators.required],
      consigneeInformation: ['', Validators.required]
    });

    this.shipperForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      telephoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      city: ['', Validators.required]
    });

    this.consigneeForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      telephoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      city: ['', Validators.required]
    });

    this.getCitysByName(this.originStationName);

    this.newUsingPharma();

    this.containerForm = this.fb.group({
      quantityContainers: ['', Validators.required],
      containerTypeId: ['', Validators.required],
      temperatureRangeId: ['', Validators.required],
      dryIceRessupply: ['', Validators.required],
      positioning: ['', Validators.required],
      repositioning: ['', Validators.required]
    });

    this.bookingDetailsForm = this.fb.group({
      numberPieces: ['', Validators.required],
      width: ['', Validators.required],
      high: ['', Validators.required],
      depth: ['', Validators.required],
      weight: ['', Validators.required],
      weightUnitId: ['', Validators.required],
      lengthUnitId: ['', Validators.required]
    });

    this.dryIceResupplyForm = this.fb.group({
      quantity: ['', Validators.required],
      station: ['', Validators.required],
    });
  }

  get fContainer() {
    return this.containerForm.controls;
  }

  get fDryIceResupply() {
    return this.dryIceResupplyForm.controls;
  }

  ngOnInit(): void {
    this.booking = new BookingModel();
    this.booking.bookingDetails = [];
    this.booking.quotationAnimal = new QuotationAnimal();
    this.submitted = false;
    this.shipperInfo = new Shipper();
    this.consigneeInfo = new Consignee();
    this.booking.userName = this.userLogin.firstName;
    this.booking.company = this.userLogin.userCtsDetail?.companyName ?? "";
    this.booking.userId = this.userLogin.id;
    this.booking.createdUserId = this.userLogin.id;
    this.warningBooking = new String();
    this.perishable = new Perishable();
    this.bookingDetail = new BookingDetails();
    this.bookingCreatedSuccessfully = false;
  }

  get f() {
    return this.bookingForm.controls;
  }

  get g() {
    return this.shipperForm.controls;
  }
  get h() {
    return this.consigneeForm.controls;
  }

  get fDetail() {
    return this.bookingDetailsForm.controls;
  }

  getShipper() {
    this.shipperDialog = true;
  }

  getConsignee() {
    this.consigneeDialog = true;
  }

  getQuotation() {
    if (this.quotation != null) {
      // this.originStation = new Station();

      if (this.originStation != null) {

        this.originStation.id = this.quotation.originStationId;
        this.originStation.name = this.quotation.originStationName;
      }
      if (this.destinationCity != null) {

        // this.destinationCity = new Station();
        this.destinationCity.id = this.quotation.destinationStationId;
        this.destinationCity = this.quotation.destinationStationDesc;
      }
      this.booking.piece = this.quotation.numberPieces;
      this.booking.description = this.quotation.description;
      this.booking.rate = this.quotation.quotationStatus.rate;
      this.booking.chargeableWeight = this.quotation.chargableWeight;
      this.booking.loadTypeId = this.quotation.loadTypeId;
    }

  }
  saveShipper() {
    this.submittedShipper = true;
    this.loading = true;
    if (this.shipperForm.invalid) {
      this.loading = false;
      return;
    }
    this.shipperInfo.userId = this.userLogin.id;
    this.shipperInfo.cityId = this.cityShipper.id;

    this.transactionService.save(environment.adminAPI, this.constantService.SHIPPER_INFORMATION, this.shipperInfo).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.shipperInfo = data.businessDto[0];
          this.messageService.add({
            severity: 'success',
            summary: 'Usuario',
            detail: data.responseDto.message,
          });
          this.shipperDialog = false;
          this.submittedShipper = false;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Usuario',
            detail:
              data.responseDto.message + ' , por favor inténtelo de nuevo!',
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Usuario',
          detail: 'Por favor inténtelo de nuevo!',
          life: 8000,
        });
      }
    );

    this.loading = false;
  }

  warningShowDialog() {
    this.loading = true;
    this.submitted = true;

    if (this.bookingForm.invalid ||
      ((this.booking.bookingDetails == null || this.booking.bookingDetails.length <= 0) && (this.booking.usingPharma == null || this.booking.usingPharma.packagingPassive != null))
   || (this.booking.usingPharma != null && this.booking.usingPharma.packagingTypeAnswer == "Active" && this.booking.usingPharma.containers.length <= 0)){
      this.loading = false;
      return;
    }

    this.transactionService.GetList(environment.adminAPI, this.constantService.SETTING, `/GetByName/Booking`).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.warningDialog = true;
          this.warningBooking = data.businessDto[0].value;
          this.messageService.add({
            severity: 'success',
            summary: 'Usuario',
            detail: data.responseDto.message,
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Usuario',
            detail:
              data.responseDto.message + ' , por favor inténtelo de nuevo!',
            life: 8000,
          });
        }

        this.loading = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Usuario',
          detail: 'Por favor inténtelo de nuevo!',
          life: 8000,
        });

        this.loading = false;
      }
    );
  }

  getQuotationById(id) {

    this.transactionService.GetList(environment.adminAPI, this.constantService.QUOTATION_URL, `/GetById/${id}`).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.quotation = data.businessDto[0].value;
          this.messageService.add({
            severity: 'success',
            summary: 'Usuario',
            detail: data.responseDto.message,
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Usuario',
            detail:
              data.responseDto.message + ' , por favor inténtelo de nuevo!',
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Usuario',
          detail: 'Por favor inténtelo de nuevo!',
          life: 8000,
        });
      }
    );
  }

  consigneeSave() {
    this.submittedConsignee = true;
    this.loading = true;
    if (this.consigneeForm.invalid) {
      this.loading = false;
      return;
    }

    this.consigneeInfo.userId = this.userLogin.id;
    this.consigneeInfo.cityId = this.cityConsignee.id;
    this.transactionService.save(environment.adminAPI, this.constantService.CONSIGNEE_INFORMATION, this.consigneeInfo).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.consigneeInfo = data.businessDto[0];
          this.messageService.add({
            severity: 'success',
            summary: 'Usuario',
            detail: data.responseDto.message,
          });
          this.consigneeDialog = false;
          this.submittedConsignee = true;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Usuario',
            detail:
              data.responseDto.message + ' , por favor inténtelo de nuevo!',
            life: 8000,
          });
        }

        this.loading = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Usuario',
          detail: 'Por favor inténtelo de nuevo!',
          life: 8000,
        });

        this.loading = false;
      }
    );
  }

  saveBooking() {
    this.loading = true;
    this.warningDialog = false;

    if (this.originStation != null)
      this.booking.orgStationId = this.originStation.id;

    if (this.destinationCity != null)
      this.booking.destStationId = this.destinationCity.id;

    if (this.shipperInfo != null)
      this.booking.shipperInformationId = this.shipperInfo.id;

    if (this.consigneeInfo != null)
      this.booking.consigneeInformationId = this.consigneeInfo.id;

    if (this.quotation != null)
      this.booking.quotationId = this.quotation.id;

    // if (this.bookingForm.invalid) {
    //   this.loading = false;
    //   return;
    // }

    if (this.booking.loadTypeId != this.loadTypeService.liveAnimals)
      this.booking.quotationAnimal = undefined;
    else {
      if (this.booking.quotationAnimal.animalAmount == 0 || this.booking.quotationAnimal.animalAmount == undefined)
        this.booking.quotationAnimal = null
    }

    if (this.booking.loadTypeId != this.loadTypeService.pharmaceutical)
      this.booking.usingPharma = undefined;

    let timeZone = IATACode.find(x=> x.IATA == this.originStation.name);
    let dateTimeZone=  moment().tz(timeZone.timeZone).format();
    this.booking.creationDateTimeZone = dateTimeZone;
    this.transactionService.save(environment.adminAPI, this.constantService.BOOKING_URL, this.booking).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.bookingCreatedSuccessfully = true;
          this.submitted = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Usuario',
            detail: data.responseDto.message,
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Usuario',
            detail:
              data.responseDto.message + ' , por favor inténtelo de nuevo!',
            life: 8000,
          });
        }

        this.loading = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Usuario',
          detail: 'Por favor inténtelo de nuevo!',
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
          this.originStation = data.businessDto[0];
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  loadTypeChange() {
    this.pharmaDialog = false;
    this.perishablesDialog = false;
    this.commodityAnimalDialog = false;

    if(this.booking.loadTypeId == this.loadTypeService.liveAnimals)
      this.commodityAnimalDialog = true;

    if (this.booking.loadTypeId == this.loadTypeService.perishable)
      this.perishablesDialog = true;

    if (this.booking.loadTypeId == this.loadTypeService.pharmaceutical) {
      this.newContainer();
      this.pharmaDialog = true;
    }
  }

  selectedPerishable(selected: Boolean) {
    if (selected == true) {
      this.perishablesDialog = true;
    }
  }

  hidePerishablesDialog() {
    this.perishablesDialog = false;
    this.temperatureControl = undefined;
    this.perishable = new Perishable();
    this.booking.loadTypeId = 0;
  }

  createPerishable() {
    if (this.temperatureControl == 'Yes') {
      this.booking.usingPerishable = new UsingPerishable();
      if(this.perishable.id != 0){
        this.booking.usingPerishable.perishableId = this.perishable.id;
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
    this.container.positioning = new Positioning();
  }

  cancelPharmaDialog() {
    this.newUsingPharma();
    this.booking.loadTypeId = 0;
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
    this.submittedDryIce = false;

    if (this.dryIceResupplyForm.invalid) {
      this.loading = true;
      return;
    }

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

  addBookingContainer() {
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
    this.existContainers = true;
    this.newContainer();
  }

  deleteBookingContainer(rowIndex: any) {
    this.usingPharma.containers.splice(rowIndex, 1);

    if (this.usingPharma.containers != null && this.usingPharma.containers.length > 0) {
      this.existContainers = true;
    } else {
      this.existContainers = false;
    }
  }

  savePharmaDialog() {
    this.loading = true;
    this.submittedUsingPharma = false;

    if (
      !this.usingPharma.temperatureControl ||
      (this.usingPharma.temperatureControl == "Yes" && !this.usingPharma.packagingTypeAnswer) ||
      (this.usingPharma.temperatureControl == "Yes" && this.usingPharma.packagingTypeAnswer == "Active" && this.usingPharma.containers.length < 1)
    ) {
      this.submittedUsingPharma = true;
      this.loading = false;
      return;
    }

    this.booking.usingPharma = new UsingPharma();
    this.booking.usingPharma.dangerousGoodsCode = this.usingPharma.dangerousGoodsCode;
    this.booking.usingPharma.temperatureControl = this.usingPharma.temperatureControl;
        
    if (this.usingPharma.temperatureControl == "Yes" && this.usingPharma.packagingTypeAnswer == 'Passive') {
        this.booking.usingPharma.packagingPassive = new PackagingPassive();
        this.booking.usingPharma.packagingPassive.packagingLifetime = this.usingPharma.packagingPassive.packagingLifetime;
        this.booking.usingPharma.packagingPassive.packagingDescription = this.usingPharma.packagingPassive.packagingDescription;
    }
    
    if (this.usingPharma.temperatureControl == "Yes" && this.usingPharma.packagingTypeAnswer == 'Active')
      this.booking.usingPharma.containers = this.usingPharma.containers;

    this.existContainers = false;
    this.loading = false;
    this.pharmaDialog = false;
  }

  receiveMeasurementUnit(description: String){
    this.bookingDetail.weightUnitDesc = description;
  }
  
  receiveLengthUnit(description: String){
    this.bookingDetail.lengthUnitDesc = description;
  }

  deleteDetail(rowIndex: any) {
    this.booking.bookingDetails.splice(rowIndex, 1);

    if (this.booking.bookingDetails != null && this.booking.bookingDetails.length > 0) {
      this.validateBookingDetailsOk = true;
    } else {
      this.validateBookingDetailsOk = false;
    }
  }

  addDetails() {
    this.submittedDetail = false;
    this.loading = true;

    if (this.bookingDetailsForm.invalid) {
      this.submittedDetail = true;
      this.loading = false;
      return;
    }
    
    this.booking.bookingDetails.push(this.bookingDetail);

    if (this.booking.bookingDetails != null && this.booking.bookingDetails.length > 0) {
      this.validateBookingDetailsOk = true;
    } else {
      this.validateBookingDetailsOk = false;
    }

    this.bookingDetail = new BookingDetails();
    this.loading = false;
  }

  newBooking() {
    window.location.reload();
  }
}
