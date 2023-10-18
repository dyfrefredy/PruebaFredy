import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { ConstantService } from '../../../../constant/constant-service';
import { TransactionService } from '../../../../services/transaction.service';
import { FilterQuery } from '../../../../model/filter-query';
import { Pagination } from '../../../../model/pagination';
import { OrderTable } from '../../../../model/order-table';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../model/user';
import { environment } from '../../../../../environments/environment';
import { Quotation } from '../../../../model/quotation';
import { City } from '../../../../model/city';
import { TranslateService } from "@ngx-translate/core";
import { QuotationAsignment } from '../../../../model/quotation-asignment';
import moment from 'moment';
import { BookingModel } from '../../../../model/bookingModel';
import { Station } from '../../../../model/station';
import { Shipper } from '../../../../model/shipper';
import { Consignee } from '../../../../model/consignee';
import { BookingHistoryStatus } from '../../../../model/booking-history-status';
import { BookingConfirmationLegs } from '../../../../model/booking-confirmation-legs';
import { BookingConfirmation } from '../../../../model/booking-confirmation';
import { UserCtsDetail } from '../../../../model/user-cts-detail';
import { DryIceSupplyStation } from '../../../../model/dry-ice-supply-station';
import { style } from '@angular/animations';
import { BookingDetails } from '../../../../model/booking-details';

@Component({
  selector: 'app-manage-your-booking',
  templateUrl: './manage-your-booking.component.html',
  styleUrls: ['./manage-your-booking.component.css']
})

export class ManageYourBookingComponent implements OnInit {
  user_current: any;
  notFound: boolean = true;
  originStationFind: Station;
  destinationStationFind: Station;

  bookingModelFind: BookingModel;

  bookingModels: BookingModel[];
  bookingModel: BookingModel;
  quotation: Quotation;
  originStation: Station;
  destinationStation: Station;
  shipperInfo: Shipper;
  consigneeInfo: Consignee;
  bookingHistoryStatus: BookingHistoryStatus;
  bookingConfirmationLeg: BookingConfirmationLegs;
  originStationLeg: Station;
  destinationStationLeg: Station;
  bookingConfirmation: BookingConfirmation;
  estimatedTimeDeparture: Date;
  estimatedTimeArrival: Date;

  bookingDetailsDialog: boolean;
  bookingForm: FormGroup;

  confirmDialog: boolean;
  confirmForm: FormGroup;
  confirmLegForm: FormGroup;
  bookingDetailsForm: FormGroup;
  bookingDetail: BookingDetails;

  loading: boolean;
  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;
  submitted: boolean;
  submittedLeg: boolean;
  submittedConfirm: boolean;
  user: User;
  validateBookingDetailsOk: boolean = false;
  submittedDetail: boolean;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService
  ) {
    this.bookingForm = this.fb.group({
      userName: ['', Validators.required],
      customer: [''],
      docNum: ['', Validators.required],
      quotationId: ['',],
      originStation: ['', Validators.required],
      destinationStation: ['', Validators.required],
      estimatedDeliveryDate: [''],
      loadTypeId: ['', Validators.required],
      piece: ['', Validators.required],
      weightKgs: [''],
      volume: [''],
      measurementUnit: [''],
      chargeableWeight: ['', Validators.required],
      rate: ['', Validators.required],
      shc: [''],
      description: ['', Validators.required],
      bookingInstruction: [''],
      flightNumber: [''],
      estimatedFlightDate: ['', Validators.required],
      company: [''],
      lengthUnitId: ['', Validators.required],
      weightUnitId: ['', Validators.required],
      removable: ['', Validators.required],
      comment: [''],
      paymentMode: ['', Validators.required],
      shipperInformation: ['', Validators.required],
      consigneeInformation: ['', Validators.required]
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

    this.user = this.authService.currentUserValue;
    this.pagination = new Pagination();

    this.originStation = new Station();
    this.destinationStation = new Station();

    this.pagination.pageSize = 10;
    this.pagination.pageNo = 0;
    this.bookingModelFind = new BookingModel();
    this.bookingModelFind.bookingHistoryStatus = [];
    this.bookingDetail = new BookingDetails();
  }

  ngOnInit(): void {
  }

  get fDetail() {
    return this.bookingDetailsForm.controls;
  }

  getPaginationAndFilter() {
    let filter = new FilterQuery();
    // let bookingHistoryStatus = new BookingHistoryStatus();
    // bookingHistoryStatus.userAssigmentId = this.user.id;
    this.bookingModelFind.createdUserId = this.user.id;
    // this.bookingModelFind.bookingHistoryStatus.push(bookingHistoryStatus);

    if (this.bookingModelFind.createdDate == null)
      this.bookingModelFind.createdDate = undefined;

    if (this.originStation.id != undefined) {
      this.bookingModelFind.orgStationId = Number(this.originStation.id);
    } else {
      this.bookingModelFind.orgStationId = undefined;
    }

    if (this.destinationStation.id != undefined) {
      this.bookingModelFind.destStationId = Number(this.destinationStation.id);
    } else {
      this.bookingModelFind.destStationId = undefined;
    }



    filter = {
      filterDto: this.bookingModelFind,
      paginationDto: this.pagination
    };
    this.transactionService
      .getPaginationAndFilter(environment.adminAPI, `${this.constantService.BOOKING_URL}/GetBookingAsignment`, filter).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.bookingModels = data.businessDto;
            this.totalRecords = data.totalRecords;
            this.bookingModelFind.orgStationId = 0;
            this.originStation.id = 0;
            this.destinationStation.id = 0;
            this.bookingModelFind.destStationId = 0;
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: this.translateService.instant('module.manage-your-Booking.moduleName', "moduleName"),
              detail: data.responseDto.message,
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('module.manage-your-Booking.moduleName', "moduleName"),
            detail: this.translateService.instant('module.alerts.errorWeb', "errorWeb"),
          });
        }
      );

  }

  loadBookings(event: LazyLoadEvent) {
    this.loading = true;
    this.pagination.pageSize = event.rows;
    this.pagination.pageNo = event.first / event.rows;
    this.pagination.orderTable = [];

    //Para conocer los campos por los cuales se va a filtrar
    if (event.sortField != undefined) {
      let orderTable = new OrderTable();
      orderTable.sorterField = event.sortField;
      orderTable.sorterMode = event.sortOrder === -1 ? 0 : event.sortOrder;
      this.pagination.orderTable.push(orderTable);
    }

    this.getPaginationAndFilter();
    this.loading = false;
  }

  openDetails(bookingModel) {
    this.bookingModel = new BookingModel();
    this.bookingModel = bookingModel;
    this.quotation = this.bookingModel.quotation;
    this.originStationFind = this.bookingModel.orgStation;
    this.destinationStationFind = this.bookingModel.destStation;
    this.shipperInfo = this.bookingModel.shipperInformation;
    this.consigneeInfo = this.bookingModel.consigneeInformation;
    this.bookingModel.estimatedFlightDate = new Date(this.bookingModel.estimatedFlightDate);
    this.bookingDetailsDialog = true;

    //
    //this.bookingModel.bookingHistoryLastStatus.bookingStatusId
    //

  }

  cancel() {
    this.loading = true;
    this.bookingHistoryStatus = new BookingHistoryStatus();
    this.confirmationService.confirm({
      message: this.translateService.instant('module.manage-your-Booking.msgCancel', 'msgCancel') + this.bookingModel.id + '?',
      header: this.translateService.instant('module.manage-your-Booking.headerCancel', 'headerCancel'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bookingHistoryStatus.bookingId = this.bookingModel.id;
        this.bookingHistoryStatus.bookingStatusId = this.constantService.BookingStatusIdPendiCancelled;
        this.bookingHistoryStatus.userAssigmentId = null;
        this.bookingHistoryStatus.active = true;
        this.bookingHistoryStatus.createdUserId = this.user.id;
        this.bookingHistoryStatus.createdDate = new Date(Date.now());
        this.transactionService.save(environment.adminAPI, this.constantService.BOOKING_HISTORY_STATUS, this.bookingHistoryStatus).subscribe(
          (data) => {
            if (data.responseDto.response === this.constantService.RESPONSE_OK) {
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('module.manage-your-Booking.moduleName', "moduleName"),
                detail: data.responseDto.message,
              });
              this.getPaginationAndFilter();
              this.hideDialog();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: this.translateService.instant('module.myTaskDashboard.bookingConfirmation.moduleName', "moduleName"),
                detail: data.responseDto.message + ', ' + this.translateService.instant('module.alerts.errorApi', "errorApi"),
                life: 8000,
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('module.myTaskDashboard.bookingConfirmation.moduleName', "moduleName"),
              detail: this.translateService.instant('module.alerts.errorWeb', "errorWeb"),
              life: 8000,
            });
          }
        );
      },
    });

    this.loading = false;
  }

  confirm() {
    this.loading = true;
    // this.bookingConfirmation = new BookingConfirmation();
    // this.bookingConfirmation.bookingConfirmationLegs = [];
    // this.bookingConfirmation.bookingId = this.bookingModel.id;
    // this.bookingConfirmation.rate = this.bookingModel.rate;
    // this.bookingConfirmation.createdUserId = this.user.id;

    this.confirmationService.confirm({
      message: this.translateService.instant('module.manage-your-Booking.msgConfirm', "msgConfirm"),
      header: this.translateService.instant('module.manage-your-Booking.headerConfirm', "headerConfirm"),
      icon: 'pi pi-exclamation-circle',
      accept: () => {
        this.bookingModel.orgStationId = (this.originStationFind.id);
        this.bookingModel.destStationId = (this.destinationStationFind.id);
        this.bookingModel.updatedUserId = Number(this.user.id);

        this.transactionService.update(environment.adminAPI, this.constantService.BOOKING_URL, this.bookingModel).subscribe(
          (data) => {
            if (data.responseDto.response === this.constantService.RESPONSE_OK) {
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('module.manage-your-Booking.moduleName', "moduleName"),
                detail: data.responseDto.message,
              });
              this.getPaginationAndFilter();
              this.hideDialog();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Booking',
                detail:
                  data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Booking',
              detail: 'Por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        );
      },
    });

    this.loading = false;
  }

  addDetails() {
    this.submittedDetail = false;
    this.loading = true;

    if (this.bookingDetailsForm.invalid) {
      this.submittedDetail = true;
      this.loading = false;
      return;
    }
    
    this.bookingDetail.active = true;
    this.bookingModel.bookingDetails.push(this.bookingDetail);

    if (this.bookingModel.bookingDetails != null && this.bookingModel.bookingDetails.length > 0) {
      this.validateBookingDetailsOk = true;
    } else {
      this.validateBookingDetailsOk = false;
    }

    this.bookingDetail = new BookingDetails();
    this.loading = false;
  }

  deleteDetail(rowIndex: any) {
    this.bookingModel.bookingDetails[rowIndex].active = false;
    //this.bookingModel.bookingDetails.splice(rowIndex, 1);    

    if (this.bookingModel.bookingDetails != null && this.bookingModel.bookingDetails.length > 0) {
      this.validateBookingDetailsOk = true;
    } else {
      this.validateBookingDetailsOk = false;
    }
  }

  hideDialog() {
    this.bookingDetailsDialog = false;
  }

  receiveOriginStation(user: Station) {
    this.originStationFind = user;
  }

  receiveDestinationStation(user: Station) {
    this.destinationStationFind = user;
  }

  receiveMeasurementUnit(description: String){
    this.bookingDetail.weightUnitDesc = description;
  }
  
  receiveLengthUnit(description: String){
    this.bookingDetail.lengthUnitDesc = description;
  }

  closeDetailsDialog(){
    this.getPaginationAndFilter();
  }
}
